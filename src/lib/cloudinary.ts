const CLOUD_NAME = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

if (!CLOUD_NAME) {
  console.warn('VITE_CLOUDINARY_CLOUD_NAME is not set');
}
if (!UPLOAD_PRESET) {
  console.warn('VITE_CLOUDINARY_UPLOAD_PRESET is not set');
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars are not configured');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    console.error('Cloudinary upload error:', data);
    throw new Error(data.error?.message || 'Failed to upload image');
  }

  return data.secure_url as string;
}
