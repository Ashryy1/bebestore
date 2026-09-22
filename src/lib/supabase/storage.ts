import { createServerClient, isSupabaseServerConfigured } from './server';

export type BucketName = 'products' | 'avatars' | 'chat' | 'receipts' | 'custom-requests';

/**
 * Uploads a file buffer to Supabase Storage and returns the public CDN URL.
 */
export async function uploadImage(
  bucket: BucketName,
  file: Buffer | Blob,
  fileName: string,
  contentType: string = 'image/jpeg'
): Promise<string> {
  if (!isSupabaseServerConfigured()) {
    throw new Error('Supabase Storage is not configured. Please add Supabase credentials in .env.local.');
  }

  const supabase = createServerClient();
  const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `${Date.now()}_${cleanName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) {
    console.error(`Error uploading to bucket ${bucket}:`, error);
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Handles Base64 string upload and converts it to a standard file in Supabase Storage.
 */
export async function uploadBase64Image(
  bucket: BucketName,
  base64String: string,
  fileNamePrefix: string = 'upload'
): Promise<string> {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string format');
  }

  const contentType = matches[1];
  const extension = contentType.split('/')[1] || 'jpg';
  const buffer = Buffer.from(matches[2], 'base64');
  const fileName = `${fileNamePrefix}.${extension}`;

  return uploadImage(bucket, buffer, fileName, contentType);
}
