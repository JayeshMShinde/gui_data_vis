// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Chart Types
export const CHART_TYPES = {
  BAR: 'bar',
  SCATTER: 'scatter',
  LINE: 'line',
  HISTOGRAM: 'histogram',
  PIE: 'pie',
  BOX: 'box',
  HEATMAP: 'heatmap',
} as const;

// ML Types
export const ML_TYPES = {
  SUPERVISED: 'supervised',
  CLUSTERING: 'clustering',
  PCA: 'pca',
} as const;

export const MODEL_TYPES = {
  LINEAR: 'linear',
  RANDOM_FOREST: 'random_forest',
  SVM: 'svm',
  KNN: 'knn',
  DECISION_TREE: 'decision_tree',
} as const;

// Report Types
export const REPORT_TYPES = {
  DATA_SUMMARY: 'data_summary',
  DATA_QUALITY: 'data_quality',
  STATISTICAL_ANALYSIS: 'statistical_analysis',
  VISUALIZATION_RECOMMENDATIONS: 'visualization_recommendations',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  THEMES: ['light', 'dark', 'system'] as const,
  COLOR_PALETTES: ['blue', 'purple', 'green', 'orange', 'red', 'pink'] as const,
} as const;

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ACCEPTED_TYPES: ['.csv', '.xlsx', '.xls'],
  MIME_TYPES: [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
  ],
} as const;