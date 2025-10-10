import axios from 'axios';

const baseUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CLOUDINARY_URL,
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const uploadImage = async (file: File, preset: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  return await baseUrl.post('image/upload', formData);
};
