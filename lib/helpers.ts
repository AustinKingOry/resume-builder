import axios from 'axios'

/**
 * Upload a file to Supabase Storage and track progress
 * @param {File} file - The file to upload
 * @param {string} bucket - Supabase bucket name
 * @param {string} path - Full file path (e.g., userId/filename.jpg)
 * @param {(percent: number) => void} onProgress - Callback to track upload %
 */
export async function uploadFileWithProgress(
  file: File,
  bucket: string,
  path: string,
  onProgress: (percent: number) => void
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${path}`;

  try {
    const res = await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
        Authorization: `Bearer ${supabaseKey}`,
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        onProgress(percent);
      },
    });

    return { success: true, data: res.data };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error };
  }
}
