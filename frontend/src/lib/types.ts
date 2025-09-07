// Common Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Data Types
export interface DataInfo {
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  numeric_columns: string[];
  categorical_columns: string[];
}

export interface PreviewData {
  columns: string[];
  preview: Record<string, unknown>[];
  shape: [number, number];
  session_id: string;
  data_info: DataInfo;
}

// Chart Types
export type ChartType = 'bar' | 'scatter' | 'line' | 'histogram' | 'pie' | 'box' | 'heatmap';

export interface ChartConfig {
  chart_type: ChartType;
  x_column?: string;
  y_column?: string;
  color_column?: string;
  group_column?: string;
  orientation?: 'vertical' | 'horizontal';
  bins?: number;
  title?: string;
}

// ML Types
export type MLType = 'supervised' | 'clustering' | 'pca';
export type ModelType = 'linear' | 'random_forest' | 'svm' | 'knn' | 'decision_tree';
export type ClusteringAlgorithm = 'kmeans' | 'dbscan';

export interface MLResult {
  model_type?: string;
  algorithm?: string;
  metrics?: any;
  labels?: number[];
  explained_variance_ratio?: number[];
  is_classification?: boolean;
}

// Session Types
export interface SavedSession {
  session_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  data_shape: [number, number];
  columns: string[];
}

// Report Types
export type ReportType = 'session_activity' | 'data_summary' | 'data_quality' | 'statistical_analysis' | 'visualization_recommendations';

export interface ReportData {
  report_type: string;
  generated_at: string;
  [key: string]: any;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
export type ColorPalette = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

// Recommendation Types
export interface MLRecommendation {
  column: string;
  type?: 'classification' | 'regression';
  reason: string;
  score: number;
}

export interface VisualizationRecommendation {
  column: string;
  reason: string;
  score: number;
}

export interface ChartRecommendation {
  chart_type: ChartType;
  x_column: string;
  y_column?: string;
  title: string;
  reason: string;
}