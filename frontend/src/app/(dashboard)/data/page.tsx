"use client";

import React, { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FileUpload from "@/components/ui/FileUpload";
import DataTable from "@/components/data-table/DataTable";
import DataCleaningControls from "@/components/ui/DataCleaningControls";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { cleanData } from "@/lib/api";
import { useSession } from "@/contexts/SessionContext";
import { ClipboardUtil } from "@/lib/utils/clipboard";
import ServerStatus from "@/components/ui/ServerStatus";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Brain, Upload, FileText, Copy } from "lucide-react";

type CleaningAction = "drop_duplicates" | "drop_columns" | "drop_rows" | "handle_missing" | "convert_types" | "detect_outliers";

interface CleaningParams {
  columns?: string[];
  indices?: number[];
  strategy?: string;
  column_types?: Record<string, string>;
  outlier_method?: string;
}

// Define the structure of a row in your dataset
type RowData = Record<string, unknown>;

// Define the structure of your preview data
interface PreviewData {
  columns: string[];
  preview: RowData[];
  shape: [number, number];
  session_id: string;
  data_info: {
    shape: [number, number];
    columns: string[];
    dtypes: Record<string, string>;
    missing_values: Record<string, number>;
    numeric_columns: string[];
    categorical_columns: string[];
  };
}

// O(1) optimized cell value renderer
const renderCellValue = (value: unknown): React.ReactNode => {
  if (value == null) {
    return <span className="text-gray-400 italic">null</span>;
  }
  
  const type = typeof value;
  
  if (type === "number") {
    const isInteger = Number.isInteger(value as number);
    const formatted = isInteger 
      ? (value as number).toLocaleString()
      : (value as number).toLocaleString(undefined, { maximumFractionDigits: 4 });
    return <span className="font-mono text-blue-600 dark:text-blue-400">{formatted}</span>;
  }
  
  if (type === "boolean") {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        value ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        {value ? '✓ True' : '✗ False'}
      </span>
    );
  }
  
  if (type === "string") {
    const strValue = value as string;
    
    // Check if it's a URL
    if (strValue.match(/^https?:\/\//)) {
      return (
        <a 
          href={strValue} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline truncate block max-w-xs"
        >
          {strValue}
        </a>
      );
    }
    
    // Check if it's an email
    if (strValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return (
        <a 
          href={`mailto:${strValue}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {strValue}
        </a>
      );
    }
    
    // Check if it's a date
    const date = new Date(strValue);
    if (!isNaN(date.getTime()) && strValue.match(/^\d{4}-\d{2}-\d{2}/)) {
      return (
        <span className="font-mono text-purple-600 dark:text-purple-400">
          {date.toLocaleDateString()}
        </span>
      );
    }
    
    // Regular string
    return <span className="text-gray-900 dark:text-gray-100">{strValue}</span>;
  }
  
  if (type === "object") {
    try { 
      const jsonStr = JSON.stringify(value);
      return (
        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          {jsonStr.length > 50 ? `${jsonStr.substring(0, 50)}...` : jsonStr}
        </span>
      );
    } catch { 
      return <span className="text-gray-400 italic">[Object]</span>; 
    }
  }
  
  return <span>{String(value)}</span>;
};

export default function DataUploadPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const { setCurrentSessionId } = useSession();

  // Mutation for data cleaning operations
  const cleaningMutation = useMutation({
    mutationFn: async ({ action, params }: { action: CleaningAction; params: CleaningParams }) => {
      return await cleanData({
        session_id: preview?.session_id!,
        action,
        ...params
      });
    },
    onSuccess: (data) => {
      if (data.outliers) {
        // Handle outlier detection results
        const outlierCount = Object.values(data.outliers).reduce((sum: number, indices: any) => sum + indices.length, 0);
        toast.success(`Found ${outlierCount} outliers`, {
          description: "Check console for detailed outlier information"
        });
        console.log("Outliers detected:", data.outliers);
      } else {
        // Update preview with cleaned data
        setPreview(prev => prev ? {
          ...prev,
          columns: data.columns,
          preview: data.preview,
          shape: data.shape,
          data_info: data.data_info
        } : null);
        toast.success("Data cleaned successfully!", {
          description: "Your dataset has been updated with the cleaning operation"
        });
      }
    },
    onError: (error) => {
      toast.error("Data cleaning failed", {
        description: error.message
      });
    }
  });

  // Handler to transform the uploaded data to match PreviewData structure
  const handleUpload = (data: any) => {
    // The backend now returns the full structure with session_id and data_info
    if (data.session_id && data.preview) {
      setPreview({
        columns: data.columns,
        preview: data.preview,
        shape: data.shape,
        session_id: data.session_id,
        data_info: data.data_info
      });
      // Update session context
      setCurrentSessionId(data.session_id);
      toast.success("Data uploaded successfully!", {
        description: "You can now visualize and analyze your data"
      });
    }
  };

  const handleCleaningAction = (action: string, params: any) => {
    cleaningMutation.mutate({ action: action as CleaningAction, params });
  };

  // Enhanced column generation with data type detection
  const columns = useMemo<ColumnDef<RowData, unknown>[]>(() => {
    if (!preview?.columns || !preview.preview || preview.preview.length === 0) return [];
    
    return preview.columns.map((col) => {
      // Analyze first few non-null values to determine data type
      const sampleValues = preview.preview
        .slice(0, 10)
        .map(row => row[col])
        .filter(val => val != null);
      
      let dataType = 'text';
      let typeIcon = '📝';
      
      if (sampleValues.length > 0) {
        const firstValue = sampleValues[0];
        if (typeof firstValue === 'number') {
          dataType = Number.isInteger(firstValue) ? 'integer' : 'decimal';
          typeIcon = '🔢';
        } else if (typeof firstValue === 'boolean') {
          dataType = 'boolean';
          typeIcon = '✓';
        } else if (typeof firstValue === 'string') {
          // Check for date patterns
          if (firstValue.match(/^\d{4}-\d{2}-\d{2}/)) {
            dataType = 'date';
            typeIcon = '📅';
          }
          // Check for email patterns
          else if (firstValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            dataType = 'email';
            typeIcon = '📧';
          }
          // Check for URL patterns
          else if (firstValue.match(/^https?:\/\//)) {
            dataType = 'url';
            typeIcon = '🔗';
          }
        }
      }

      return {
        accessorKey: col,
        header: () => (
          <div className="flex items-center gap-2">
            <span className="text-xs" title={dataType}>{typeIcon}</span>
            <span className="font-semibold">{col}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {dataType}
            </span>
          </div>
        ),
        cell: (info) => renderCellValue(info.getValue()),
        enableSorting: true,
      };
    });
  }, [preview?.columns, preview?.preview]);

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-slate-900/50">
        {/* Header Section */}
        <div className="section-padding py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 bg-gradient-to-br from-blue-500 via-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-strong">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                      Data Management
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ready for upload
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                  Upload, explore, and prepare your datasets with advanced cleaning tools and intelligent analysis
                </p>
              </div>
              <div className="flex-shrink-0">
                <ServerStatus />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            {/* Upload Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Step 1: Upload Your Dataset
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Drag and drop your CSV, Excel, or JSON files. We support files up to 100MB.
                </p>
              </div>
              <div className="animate-slide-up">
                <FileUpload onUpload={handleUpload} />
              </div>
            </div>

            {/* Data Analysis Section */}
            {preview && (
              <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                {/* Section Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Step 2: Explore & Analyze Your Data
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Review your dataset, understand its structure, and perform cleaning operations
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                  {/* Dataset Overview Sidebar */}
                  <div className="xl:col-span-1 order-1">
                    <div className="space-y-6">
                      {/* Dataset Overview */}
                      <Card className="shadow-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-3 text-lg">
                            <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-white" />
                            </div>
                            Dataset Overview
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Key Metrics */}
                          <div className="grid grid-cols-1 gap-3">
                            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                                {preview.shape[0].toLocaleString()}
                              </div>
                              <div className="text-xs font-semibold text-blue-600 dark:text-blue-500 uppercase tracking-wide">
                                Rows
                              </div>
                            </div>
                            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
                              <div className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-1">
                                {preview.shape[1]}
                              </div>
                              <div className="text-xs font-semibold text-purple-600 dark:text-purple-500 uppercase tracking-wide">
                                Columns
                              </div>
                            </div>
                          </div>
                          
                          {/* Data Type Breakdown */}
                          {preview.data_info && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Column Types</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-emerald-600 dark:text-emerald-400">🔢</span>
                                    <span className="text-sm font-medium">Numeric</span>
                                  </div>
                                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    {preview.data_info.numeric_columns?.length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-orange-600 dark:text-orange-400">📝</span>
                                    <span className="text-sm font-medium">Text</span>
                                  </div>
                                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">
                                    {preview.data_info.categorical_columns?.length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <span className="text-red-600 dark:text-red-400">❌</span>
                                    <span className="text-sm font-medium">Missing</span>
                                  </div>
                                  <span className="text-sm font-bold text-red-700 dark:text-red-400">
                                    {preview.data_info.missing_values ? 
                                      Object.values(preview.data_info.missing_values).reduce((sum, count) => sum + count, 0) : 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Data Quality Score */}
                      {preview.data_info && (
                        <Card className="shadow-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                          <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-3 text-lg">
                              <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                                <FileText className="h-4 w-4 text-white" />
                              </div>
                              Data Quality
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {(() => {
                              const totalCells = preview.shape[0] * preview.shape[1];
                              const missingCells = preview.data_info.missing_values ? 
                                Object.values(preview.data_info.missing_values).reduce((sum, count) => sum + count, 0) : 0;
                              const completeness = ((totalCells - missingCells) / totalCells) * 100;
                              
                              return (
                                <div className="space-y-4">
                                  <div className="text-center">
                                    <div className={`text-4xl font-bold mb-2 ${
                                      completeness > 90 ? 'text-emerald-600 dark:text-emerald-400' : 
                                      completeness > 70 ? 'text-yellow-600 dark:text-yellow-400' : 
                                      'text-red-600 dark:text-red-400'
                                    }`}>
                                      {completeness.toFixed(1)}%
                                    </div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                      Data Completeness
                                    </p>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div 
                                      className={`h-3 rounded-full transition-all duration-500 ${
                                        completeness > 90 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 
                                        completeness > 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 
                                        'bg-gradient-to-r from-red-400 to-red-600'
                                      }`}
                                      style={{ width: `${completeness}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                    {completeness > 90 ? 'Excellent data quality' : 
                                     completeness > 70 ? 'Good data quality' : 'Needs cleaning'}
                                  </p>
                                </div>
                              );
                            })()}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  {/* Data Preview - Main Content */}
                  <div className="xl:col-span-3 order-2">
                    <div className="space-y-6">
                      {/* Data Table */}
                      <Card className="shadow-strong bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-medium">
                                <BarChart3 className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <CardTitle className="text-xl mb-1">Dataset Preview</CardTitle>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                  {preview.shape[0].toLocaleString()} rows × {preview.shape[1].toLocaleString()} columns
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <Link href={`/visualize?session=${preview.session_id}`}>
                                <Button size="sm" variant="success" className="shadow-soft whitespace-nowrap">
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  Create Charts
                                </Button>
                              </Link>
                              <Link href={`/ml?session=${preview.session_id}`}>
                                <Button size="sm" variant="outline" className="shadow-soft whitespace-nowrap">
                                  <Brain className="h-4 w-4 mr-2" />
                                  Train Models
                                </Button>
                              </Link>
                              <Link href={`/reports?session=${preview.session_id}`}>
                                <Button size="sm" variant="outline" className="shadow-soft whitespace-nowrap">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Generate Reports
                                </Button>
                              </Link>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={async () => {
                                  const success = await ClipboardUtil.copyToClipboard(preview.session_id);
                                  if (success) {
                                    toast.success("Session ID copied!", {
                                      description: "You can use this ID to generate reports later"
                                    });
                                  } else {
                                    toast.error("Failed to copy session ID");
                                  }
                                }}
                                className="shadow-soft whitespace-nowrap"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Session ID
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="p-6">
                            <DataTable columns={columns} data={preview.preview} />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Data Cleaning Tools - Below Table */}
                      <Card className="shadow-medium bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-b border-gray-200 dark:border-gray-700">
                          <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="h-10 w-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-medium">
                              <Brain className="h-5 w-5 text-white" />
                            </div>
                            Data Cleaning & Preparation
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Clean and prepare your dataset for analysis. Make corrections to improve data quality.
                          </p>
                        </CardHeader>
                        <CardContent className="p-6">
                          <DataCleaningControls
                            sessionId={preview.session_id}
                            dataInfo={preview.data_info}
                            onCleaningAction={handleCleaningAction}
                            isLoading={cleaningMutation.isPending}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
