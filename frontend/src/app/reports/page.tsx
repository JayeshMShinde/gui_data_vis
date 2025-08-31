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

type ReportType = "data_summary" | "data_quality" | "statistical_analysis";

interface ReportData {
  report_type: string;
  generated_at: string;
  [key: string]: any;
}

const reportTypes = [
  {
    value: "data_summary",
    label: "Data Summary Report",
    description: "Comprehensive overview of your dataset",
    icon: BarChart3,
    color: "from-blue-500 to-blue-600"
  },
  {
    value: "data_quality",
    label: "Data Quality Assessment",
    description: "Identify data quality issues and recommendations",
    icon: Shield,
    color: "from-green-500 to-green-600"
  },
  {
    value: "statistical_analysis",
    label: "Statistical Analysis Report",
    description: "Detailed statistical insights and correlations",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600"
  }
];

export default function ReportsPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [reportType, setReportType] = useState<ReportType>("data_summary");
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
                    {reportTypes.map((type) => (
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
          {reportTypes.map((type) => {
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

        {/* Generated Report */}
        {reportData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Generated Report</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Generated on {new Date(reportData.generated_at).toLocaleString()}
              </p>
            </CardHeader>
            <CardContent>
              {reportData.report_type === "data_summary" && renderDataSummaryReport(reportData)}
              {reportData.report_type === "data_quality" && renderDataQualityReport(reportData)}
              {reportData.report_type === "statistical_analysis" && renderStatisticalReport(reportData)}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}