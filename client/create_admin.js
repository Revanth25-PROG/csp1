import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Run only on a trusted server/terminal. Never prefix the secret key with VITE_.
const { VITE_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
if (!VITE_SUPABASE_URL || !SUPABASE_SECRET_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Set VITE_SUPABASE_URL, SUPABASE_SECRET_KEY, ADMIN_EMAIL, and ADMIN_PASSWORD in your server environment. Do not commit credentials.');
  process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase.auth.admin.createUser({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  email_confirm: true,
  app_metadata: { role: 'admin' },
  user_metadata: { full_name: 'Administrator' },
});
if (error) {
  console.error('Admin creation failed:', error.message);
  process.exit(1);
}
console.log('Administrator created. Credentials were not logged.');
