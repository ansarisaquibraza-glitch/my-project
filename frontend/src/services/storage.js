// frontend/src/services/storage.js
// Handles image uploads directly to Supabase Storage from the client

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'road-damage-images';

/**
 * Uploads an image file to Supabase Storage.
 * Returns the public URL of the uploaded image.
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} Public URL
 */
export const uploadImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `report-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `reports/${fileName}`;

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
};

export default supabase;
