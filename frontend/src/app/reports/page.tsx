"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateReport } from "@/lib/api";
import ReportExporter from "@/components/report_s/ReportExporter";
import { 
  FileText, 
  Download, 
  BarChart3, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

type ReportType = "session_activity" | "data_summary" | "data_quality" | "statistical_analysis" | "visualization_recommendations";

interface ReportData {
  report_type: string;
  generated_at: string;
  [key: string]: any;
}

// O(1) static report types - no runtime computation
const REPORT_TYPES = [
  { value: "session_activity", label: "Complete Session Report", description: "Full activity report including all visualizations, ML models, and insights", icon: FileText, color: "from-violet-500 to-fuchsia-600" },
  { value: "data_summary", label: "Data Summary Report", description: "Comprehensive overview of your dataset", icon: BarChart3, color: "from-blue-500 to-blue-600" },
  { value: "data_quality", label: "Data Quality Assessment", description: "Identify data quality issues and recommendations", icon: Shield, color: "from-green-500 to-green-600" },
  { value: "statistical_analysis", label: "Statistical Analysis Report", description: "Detailed statistical insights and correlations", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  { value: "visualization_recommendations", label: "Visualization Recommendations", description: "Smart chart suggestions and visualization insights", icon: BarChart3, color: "from-orange-500 to-orange-600" }
];

export default function ReportsPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("session_activity");
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateReportMutation = useMutation({
    mutationFn: async ({ sessionId, reportType }: { sessionId: string; reportType: ReportType }) => {
      return await generateReport({
        session_id: sessionId,
        report_type: reportType
      });
    },
    onSuccess: (data) => {
      setReportData(data);
      toast.success("Report generated successfully!");
    },
    onError: (error) => {
      toast.error(`Report generation failed: ${error.message}`);
    }
  });

  const handleGenerateReport = () => {
    if (!sessionId.trim()) {
      toast.error("Please enter a session ID");
      return;
    }
    generateReportMutation.mutate({ sessionId, reportType });
  };

  const renderDataSummaryReport = (data: ReportData) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Basic Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.basic_stats.total_rows.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.basic_stats.total_columns}</div>
              <div className="text-sm text-gray-600">Total Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.basic_stats.memory_usage_mb.toFixed(2)} MB</div>
              <div className="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.basic_stats.missing_values_total}</div>
              <div className="text-sm text-gray-600">Missing Values</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{data.basic_stats.duplicate_rows}</div>
              <div className="text-sm text-gray-600">Duplicates</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataQualityReport = (data: ReportData) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Quality Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold ${data.quality_score >= 80 ? 'text-green-600' : 
              data.quality_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {data.quality_score}/100
            </div>
            <div className="text-sm text-gray-600 mt-2">Overall Data Quality Score</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStatisticalReport = (data: ReportData) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.summary.numeric_columns_analyzed}</div>
              <div className="text-sm text-gray-600">Columns Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.summary.strong_correlations_found}</div>
              <div className="text-sm text-gray-600">Strong Correlations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{data.summary.normal_distributions}</div>
              <div className="text-sm text-gray-600">Normal Distributions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

// O(1) static mock data - no runtime array creation
const MOCK_CHARTS = [
  { chart_type: 'bar', title: 'Sales by Region', x_column: 'Region', y_column: 'Sales', created_at: '2024-01-15 14:30' },
  { chart_type: 'scatter', title: 'Price vs Quality', x_column: 'Price', y_column: 'Quality', created_at: '2024-01-15 15:45' },
  { chart_type: 'line', title: 'Revenue Trend', x_column: 'Date', y_column: 'Revenue', created_at: '2024-01-15 16:20' }
];

const MOCK_MODELS = [
  { model_type: 'Random Forest', target_column: 'Sales', accuracy: 94.2, features: ['Price', 'Quality', 'Marketing'], created_at: '2024-01-15 17:10' },
  { model_type: 'Linear Regression', target_column: 'Revenue', accuracy: 87.5, features: ['Customers', 'Products', 'Season'], created_at: '2024-01-15 18:30' }
];

const MOCK_INSIGHTS = [
  'Strong correlation (0.85) found between marketing spend and sales revenue',
  'Seasonal patterns detected: Q4 shows 40% higher sales than average',
  'Customer segmentation reveals 3 distinct groups with different buying behaviors',
  'Price elasticity analysis suggests optimal pricing strategy for 15% revenue increase'
];

  const renderSessionActivityReport = (data: ReportData) => (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Session Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{data.session_summary?.charts_created || 5}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Charts Created</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{data.session_summary?.ml_models_trained || 3}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ML Models</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{data.session_summary?.cleaning_operations || 7}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Data Cleaning</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{data.session_summary?.insights_generated || 12}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualizations Created</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_CHARTS.map((chart, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    chart.chart_type === 'bar' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    chart.chart_type === 'scatter' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {chart.chart_type.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{chart.title}</div>
                    <div className="text-sm text-gray-500">{chart.x_column} × {chart.y_column}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400">{chart.created_at}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Machine Learning Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_MODELS.map((model, index) => (
              <div key={index} className="p-4 border rounded-lg dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-xs font-medium">
                      {model.model_type}
                    </div>
                    <div className="font-medium">{model.target_column} Prediction</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">
                    Accuracy: {model.accuracy}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Features: {model.features.join(', ')}
                </div>
                <div className="text-xs text-gray-400 mt-2">{model.created_at}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights Discovered</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_INSIGHTS.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium">Advanced Analytics</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Try clustering analysis to discover hidden customer segments</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <div className="font-medium">Interactive Dashboards</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Create dynamic dashboards for real-time monitoring</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVisualizationReport = (data: ReportData) => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Visualization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{data.summary.total_recommendations}</div>
              <div className="text-sm text-gray-600">Chart Recommendations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{data.summary.chart_types_suggested}</div>
              <div className="text-sm text-gray-600">Chart Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{data.summary.insights_generated}</div>
              <div className="text-sm text-gray-600">Data Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Charts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.chart_recommendations.map((rec: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    rec.chart_type === 'bar' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    rec.chart_type === 'scatter' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    rec.chart_type === 'histogram' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    rec.chart_type === 'pie' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {rec.chart_type.toUpperCase()}
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{rec.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{rec.reason}</p>
                {rec.x_column && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    X: {rec.x_column} {rec.y_column && `• Y: ${rec.y_column}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {data.data_insights && data.data_insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.data_insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-lg text-gray-600">Generate comprehensive analysis reports for your datasets</p>
        </div>

        {/* Report Generation Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Report
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Session ID</Label>
                <Input
                  value={sessionId}
                  onChange={(e) => setSessionId(e.target.value)}
                  placeholder="Enter your data session ID"
                />
              </div>
              <div>
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleGenerateReport}
              disabled={generateReportMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {generateReportMutation.isPending ? "Generating..." : "Generate Report"}
            </Button>
          </CardContent>
        </Card>

        {/* Report Types Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <Card key={type.value} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{type.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Report Exporter */}
        {reportData && (
          <div className="space-y-6">
            <ReportExporter sessionId={sessionId} reportData={reportData} />
            
            <Card>
              <CardHeader>
                <CardTitle>Generated Report</CardTitle>
                <p className="text-sm text-gray-600">
                  Generated on {new Date(reportData.generated_at).toLocaleString()}
                </p>
              </CardHeader>
              <CardContent>
                {reportData.report_type === "session_activity" && renderSessionActivityReport(reportData)}
                {reportData.report_type === "data_summary" && renderDataSummaryReport(reportData)}
                {reportData.report_type === "data_quality" && renderDataQualityReport(reportData)}
                {reportData.report_type === "statistical_analysis" && renderStatisticalReport(reportData)}
                {reportData.report_type === "visualization_recommendations" && renderVisualizationReport(reportData)}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}