-- Run once in Supabase SQL Editor. No secret keys are needed in this file.
begin;
create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null check (category in ('Road Damage / Potholes', 'Garbage Overflow', 'Water Leakage', 'Street Light Issue', 'Other')),
  location text not null check (char_length(trim(location)) between 1 and 500),
  description text not null check (char_length(trim(description)) between 1 and 5000),
  photo_url text,
  status text not null default 'pending' check (status in ('pending', 'solved')),
  created_at timestamptz not null default now()
);
comment on column public.complaints.photo_url is 'Private storage object path, not a public URL';
create index complaints_user_created_idx on public.complaints(user_id, created_at desc);
alter table public.complaints enable row level security;
revoke all on public.complaints from anon, authenticated;
grant select on public.complaints to authenticated;
grant insert (user_id, category, location, description, photo_url, status) on public.complaints to authenticated;
grant update (status) on public.complaints to authenticated;
grant all on public.complaints to service_role;
create policy complaints_read on public.complaints for select to authenticated using (
  user_id = (select auth.uid()) or coalesce((select auth.jwt())->'app_metadata'->>'role', '') = 'admin'
);
create policy complaints_insert on public.complaints for insert to authenticated with check (
  user_id = (select auth.uid()) and status = 'pending'
  and (photo_url is null or split_part(photo_url, '/', 1) = (select auth.uid())::text)
);
create policy complaints_admin_update on public.complaints for update to authenticated
using (coalesce((select auth.jwt())->'app_metadata'->>'role', '') = 'admin')
with check (coalesce((select auth.jwt())->'app_metadata'->>'role', '') = 'admin');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('complaint-photos', 'complaint-photos', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy complaint_photos_insert on storage.objects for insert to authenticated with check (
  bucket_id = 'complaint-photos' and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy complaint_photos_read on storage.objects for select to authenticated using (
  bucket_id = 'complaint-photos' and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or coalesce((select auth.jwt())->'app_metadata'->>'role', '') = 'admin'
  )
);
create policy complaint_photos_delete on storage.objects for delete to authenticated using (
  bucket_id = 'complaint-photos' and (storage.foldername(name))[1] = (select auth.uid())::text
);
notify pgrst, 'reload schema';
commit;

-- OPTIONAL: Promote an existing user separately, replacing the email below.
-- update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
--   || '{"role":"admin"}'::jsonb where email = 'REPLACE_WITH_ADMIN_EMAIL';
-- Sign out and sign back in after promotion. Never put roles in user_metadata.
