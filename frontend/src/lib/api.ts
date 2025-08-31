import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE_URL + '/api/v1',
  withCredentials: false,
})


export async function uploadData(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/data/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data; // { columns: [...], preview: [...] }
}

// Apply cleaning operation
export async function cleanData(payload: {
  action: string;
  columns?: string[];
  strategy?: string;
  dtype?: string;
}) {
  const res = await api.post("/data/clean", payload);
  return res.data;
}