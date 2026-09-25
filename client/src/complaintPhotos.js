import { supabase } from './supabaseClient';

// Store stable private paths in the database; generate temporary links when viewed.
export async function withPhotoLinks(complaints) {
  return Promise.all(complaints.map(async (complaint) => {
    if (!complaint.photo_url) return complaint;
    const { data, error } = await supabase.storage
      .from('complaint-photos')
      .createSignedUrl(complaint.photo_url, 3600);
    return { ...complaint, photo_url: error ? null : data.signedUrl };
  }));
}
