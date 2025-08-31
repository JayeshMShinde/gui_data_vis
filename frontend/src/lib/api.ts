import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',
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

type CleaningAction = "drop_duplicates" | "drop_columns" | "drop_rows" | "handle_missing" | "convert_types" | "detect_outliers";

// Apply cleaning operation
export async function cleanData(payload: {
  session_id: string;
  action: CleaningAction;
  columns?: string[];
  indices?: number[];
  strategy?: string;
  column_types?: Record<string, string>;
  outlier_method?: string;
}) {
  const res = await api.post("/data/clean", payload);
  return res.data;
}

// Get data info
export async function getDataInfo(sessionId: string) {
  const res = await api.get(`/data/info/${sessionId}`);
  return res.data;
}

// Generate chart
export async function generateChart(payload: {
  session_id: string;
  chart_type: string;
  x_column?: string;
  y_column?: string;
  color_column?: string;
  group_column?: string;
  orientation?: string;
  bins?: number;
  title?: string;
}) {
  const res = await api.post("/charts/generate", payload);
  return res.data;
}

// Train ML model
export async function trainModel(payload: {
  session_id: string;
  model_type: string;
  target_column: string;
  feature_columns: string[];
  test_size: number;
}) {
  const res = await api.post("/ml/train", payload);
  return res.data;
}

// Train clustering
export async function trainClustering(payload: {
  session_id: string;
  algorithm: string;
  feature_columns: string[];
  n_clusters: number;
}) {
  const res = await api.post("/ml/cluster", payload);
  return res.data;
}

// Apply PCA
export async function applyPCA(payload: {
  session_id: string;
  feature_columns: string[];
  n_components: number;
}) {
  const res = await api.post("/ml/pca", payload);
  return res.data;
}

// Generate report
export async function generateReport(payload: {
  session_id: string;
  report_type: "data_summary" | "data_quality" | "statistical_analysis" | "visualization_recommendations";
}) {
  const res = await api.post("/reports/generate", payload);
  return res.data;
}

// Session management
export async function getAllSessions() {
  const res = await api.get("/sessions");
  return res.data;
}

export async function saveSession(payload: {
  session_id: string;
  name: string;
}) {
  const res = await api.post("/sessions/save", payload);
  return res.data;
}

export async function deleteSession(sessionId: string) {
  const res = await api.delete(`/sessions/${sessionId}`);
  return res.data;
}