"use client";

import { useState, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
const renderCellValue = (value: unknown): string => {
  if (value == null) return "";
  const type = typeof value;
  if (type === "object") {
    try { return JSON.stringify(value); } catch { return "[Object]"; }
  }
  return String(value);
};

export default function DataUploadPage() {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const { setCurrentSessionId } = useSession();
  const queryClient = useQueryClient();

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

  // O(n) memoized column generation - only recalculates when preview changes
  const columns = useMemo<ColumnDef<RowData, unknown>[]>(() => 
    preview?.columns?.map((col) => ({
      accessorKey: col,
      header: col,
      cell: (info) => renderCellValue(info.getValue()),
    })) || [], [preview?.columns]);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Upload className="h-8 w-8" />
            Data Management
          </h1>
          <p className="text-lg text-gray-600">Upload, clean, and prepare your datasets for analysis</p>
        </div>
        
        <ServerStatus />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Upload Section */}
        <div className="lg:col-span-3">
          <FileUpload onUpload={handleUpload} />
          
          {preview && (
            <div className="mt-6">

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Data Preview</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {preview.shape[0]} rows × {preview.shape[1]} columns
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link href={`/visualize?session=${preview.session_id}`}>
                      <Button size="sm" className="dark:bg-blue-600 dark:hover:bg-blue-700">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Visualize
                      </Button>
                    </Link>
                    <Link href={`/ml?session=${preview.session_id}`}>
                      <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        <Brain className="h-4 w-4 mr-2" />
                        ML
                      </Button>
                    </Link>
                    <Link href={`/reports?session=${preview.session_id}`}>
                      <Button size="sm" variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        <FileText className="h-4 w-4 mr-2" />
                        Reports
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
                      className="dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy ID
                    </Button>
                  </div>
                </div>
              </div>
              <DataTable columns={columns} data={preview.preview} />
            </div>
          )}
        </div>
        
        {/* Enhanced Sidebar */}
        {preview && (
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* One-Click Presets - Coming Soon */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Quick Presets</h4>
                <p className="text-sm text-gray-600">One-click cleaning presets coming soon!</p>
              </div>
              
              {/* Manual Cleaning Controls */}
              <div>
                <h3 className="font-semibold mb-4">Manual Cleaning</h3>
                <DataCleaningControls
                  sessionId={preview.session_id}
                  dataInfo={preview.data_info}
                  onCleaningAction={handleCleaningAction}
                  isLoading={cleaningMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}
