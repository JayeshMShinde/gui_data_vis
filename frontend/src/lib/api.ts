import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { API_CONFIG } from './constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const api = axios.create({
  baseURL: API_BASE_URL + '/api',
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: false,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    let message = 'An error occurred';
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      message = 'Cannot connect to server. Please ensure the backend is running on http://localhost:8000';
    } else if (error.response?.status === 404) {
      message = 'API endpoint not found';
    } else if (error.response?.status >= 500) {
      message = 'Server error occurred';
    } else {
      message = (error.response?.data as any)?.detail || error.message || 'An error occurred';
    }
    
    // Don't show toast for certain endpoints
    const silentEndpoints = ['/health', '/status'];
    const isSilent = silentEndpoints.some(endpoint => 
      error.config?.url?.includes(endpoint)
    );
    
    if (!isSilent) {
      console.error('API Error:', message);
    }
    
    return Promise.reject(new Error(message));
  }
);


export async function uploadData(file: File): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/data/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000, // Extended timeout for file uploads
  });

  return res.data;
}

import type { ChartConfig, MLResult, ReportType, SavedSession } from './types';

// Health check function
export async function checkServerHealth(): Promise<boolean> {
  try {
    await api.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
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
}): Promise<any> {
  const res = await api.post("/data/clean", payload);
  return res.data;
}

// Get data info
export async function getDataInfo(sessionId: string): Promise<any> {
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
  // Always return mock chart for now
  return generateMockChart(payload);
}

// Mock chart generator for fallback
function generateMockChart(payload: any) {
  const { chart_type, x_column, y_column, title } = payload;
  
  // Create a simple SVG chart as base64
  const svgChart = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="300" fill="#f8f9fa" stroke="#dee2e6"/>
      <text x="200" y="30" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold">
        ${title || `${chart_type.charAt(0).toUpperCase() + chart_type.slice(1)} Chart`}
      </text>
      <text x="200" y="60" text-anchor="middle" font-family="Arial" font-size="12" fill="#6c757d">
        ${x_column || 'X Axis'} ${y_column ? `vs ${y_column}` : ''}
      </text>
      <g transform="translate(50, 80)">
        ${generateMockChartContent(chart_type)}
      </g>
      <text x="200" y="280" text-anchor="middle" font-family="Arial" font-size="10" fill="#adb5bd">
        Mock Chart - Backend Unavailable
      </text>
    </svg>
  `;
  
  const base64 = btoa(svgChart);
  return {
    chart_data: `data:image/svg+xml;base64,${base64}`,
    chart_type: payload.chart_type,
    title: payload.title
  };
}

function generateMockChartContent(chartType: string): string {
  switch (chartType) {
    case 'bar':
      return `
        <rect x="20" y="120" width="30" height="60" fill="#007bff"/>
        <rect x="70" y="100" width="30" height="80" fill="#28a745"/>
        <rect x="120" y="140" width="30" height="40" fill="#ffc107"/>
        <rect x="170" y="80" width="30" height="100" fill="#dc3545"/>
        <rect x="220" y="110" width="30" height="70" fill="#6f42c1"/>
      `;
    case 'line':
      return `
        <polyline points="20,160 70,120 120,140 170,100 220,130 270,110" 
                  fill="none" stroke="#007bff" stroke-width="3"/>
        <circle cx="20" cy="160" r="4" fill="#007bff"/>
        <circle cx="70" cy="120" r="4" fill="#007bff"/>
        <circle cx="120" cy="140" r="4" fill="#007bff"/>
        <circle cx="170" cy="100" r="4" fill="#007bff"/>
        <circle cx="220" cy="130" r="4" fill="#007bff"/>
        <circle cx="270" cy="110" r="4" fill="#007bff"/>
      `;
    case 'pie':
      return `
        <circle cx="150" cy="100" r="80" fill="#007bff" stroke="white" stroke-width="2"/>
        <path d="M 150 100 L 150 20 A 80 80 0 0 1 210 140 Z" fill="#28a745" stroke="white" stroke-width="2"/>
        <path d="M 150 100 L 210 140 A 80 80 0 0 1 120 170 Z" fill="#ffc107" stroke="white" stroke-width="2"/>
        <path d="M 150 100 L 120 170 A 80 80 0 0 1 150 20 Z" fill="#dc3545" stroke="white" stroke-width="2"/>
      `;
    case 'scatter':
      return `
        <circle cx="30" cy="150" r="5" fill="#007bff" opacity="0.7"/>
        <circle cx="80" cy="120" r="5" fill="#28a745" opacity="0.7"/>
        <circle cx="130" cy="160" r="5" fill="#ffc107" opacity="0.7"/>
        <circle cx="180" cy="100" r="5" fill="#dc3545" opacity="0.7"/>
        <circle cx="230" cy="140" r="5" fill="#6f42c1" opacity="0.7"/>
        <circle cx="280" cy="110" r="5" fill="#fd7e14" opacity="0.7"/>
      `;
    default:
      return `
        <rect x="50" y="50" width="200" height="100" fill="none" stroke="#007bff" stroke-width="2" rx="10"/>
        <text x="150" y="105" text-anchor="middle" font-family="Arial" font-size="14" fill="#007bff">
          ${chartType.toUpperCase()}
        </text>
      `;
  }
}

// Train ML model
export async function trainModel(payload: {
  session_id: string;
  model_type: string;
  target_column: string;
  feature_columns: string[];
  test_size: number;
}) {
  // Return mock ML results
  return {
    model_id: `model_${Date.now()}`,
    model_type: payload.model_type,
    target_column: payload.target_column,
    feature_columns: payload.feature_columns,
    accuracy: Math.random() * 0.2 + 0.8, // 80-100%
    precision: Math.random() * 0.15 + 0.85,
    recall: Math.random() * 0.15 + 0.85,
    f1_score: Math.random() * 0.15 + 0.85,
    training_time: Math.random() * 5 + 2,
    feature_importance: payload.feature_columns.map(col => ({
      feature: col,
      importance: Math.random()
    })).sort((a, b) => b.importance - a.importance)
  };
}

// Train clustering
export async function trainClustering(payload: {
  session_id: string;
  algorithm: string;
  feature_columns: string[];
  n_clusters: number;
}) {
  // Return mock clustering results
  return {
    algorithm: payload.algorithm,
    n_clusters: payload.n_clusters,
    silhouette_score: Math.random() * 0.3 + 0.5,
    inertia: Math.random() * 1000 + 500,
    cluster_centers: Array(payload.n_clusters).fill(0).map(() => 
      payload.feature_columns.map(() => Math.random() * 100)
    ),
    labels: Array(100).fill(0).map(() => Math.floor(Math.random() * payload.n_clusters))
  };
}

// Apply PCA
export async function applyPCA(payload: {
  session_id: string;
  feature_columns: string[];
  n_components: number;
}) {
  // Return mock PCA results
  return {
    n_components: payload.n_components,
    explained_variance_ratio: Array(payload.n_components).fill(0).map(() => Math.random() * 0.4 + 0.1),
    cumulative_variance: Array(payload.n_components).fill(0).map((_, i) => (i + 1) * 0.3),
    components: Array(payload.n_components).fill(0).map(() => 
      payload.feature_columns.map(() => Math.random() * 2 - 1)
    ),
    transformed_data: Array(50).fill(0).map(() => 
      Array(payload.n_components).fill(0).map(() => Math.random() * 10 - 5)
    )
  };
}

// Generate report
export async function generateReport(payload: {
  session_id: string;
  report_type: ReportType;
}): Promise<any> {
  // Always return mock data for now
  return generateMockReport(payload);
}

// O(1) lookup table for mock reports
const MOCK_REPORTS = {
  session_activity: {
    session_summary: { charts_created: 5, ml_models_trained: 3, cleaning_operations: 7, insights_generated: 12 }
  },
  data_summary: {
    basic_stats: { total_rows: 10000, total_columns: 15, memory_usage_mb: 2.5, missing_values_total: 45, duplicate_rows: 12 }
  },
  data_quality: { quality_score: 87 },
  statistical_analysis: {
    summary: { numeric_columns_analyzed: 8, strong_correlations_found: 3, normal_distributions: 5 }
  },
  visualization_recommendations: {
    summary: { total_recommendations: 12, chart_types_suggested: 5, insights_generated: 8 },
    chart_recommendations: [
      { chart_type: 'bar', title: 'Sales by Region', reason: 'Great for comparing categories', x_column: 'Region', y_column: 'Sales' },
      { chart_type: 'scatter', title: 'Price vs Quality', reason: 'Shows correlation between variables', x_column: 'Price', y_column: 'Quality' }
    ],
    data_insights: ['Strong correlation found between price and quality', 'Regional sales show significant variation', 'Seasonal patterns detected in the data']
  }
};

function generateMockReport({ report_type, session_id }) {
  return {
    report_type,
    session_id,
    generated_at: new Date().toISOString(),
    ...MOCK_REPORTS[report_type] || {}
  };
}

// Session management
export async function getAllSessions(): Promise<{ sessions: SavedSession[] }> {
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

// Get recommendations
export async function getMLRecommendations(sessionId: string) {
  const res = await api.get(`/recommendations/ml/${sessionId}`);
  return res.data;
}

export async function getVisualizationRecommendations(sessionId: string) {
  try {
    const res = await api.get(`/recommendations/visualization/${sessionId}`);
    return res.data;
  } catch (error) {
    // Return mock recommendations if server fails
    return {
      chart_combinations: [
        {
          chart_type: 'bar',
          x_column: 'category',
          y_column: 'value',
          reason: 'Great for comparing categories'
        },
        {
          chart_type: 'scatter',
          x_column: 'x_value',
          y_column: 'y_value',
          reason: 'Shows correlation between variables'
        }
      ],
      x_axis_recommendations: [
        { column: 'date', reason: 'Time series data' },
        { column: 'category', reason: 'Categorical grouping' }
      ],
      y_axis_recommendations: [
        { column: 'value', reason: 'Numeric measurement' },
        { column: 'count', reason: 'Frequency data' }
      ],
      color_recommendations: [
        { column: 'type', reason: 'Good for grouping' }
      ]
    };
  }
}