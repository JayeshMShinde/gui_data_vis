"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MLTraining from "@/components/ml-models/MLTraining";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Brain, FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import { getDataInfo } from "@/lib/api";

interface DataInfo {
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  numeric_columns: string[];
  categorical_columns: string[];
}

export default function MLPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetchDataInfo();
    }
  }, [sessionId]);

  const fetchDataInfo = async () => {
    try {
      const info = await getDataInfo(sessionId!);
      setDataInfo(info);
    } catch (error) {
      console.error("Failed to fetch data info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">No Data Session Found</h2>
            <p className="text-muted-foreground mb-4">
              Please upload data first to train machine learning models.
            </p>
            <Link href="/data">
              <Button>Upload Data</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading data information...</span>
        </div>
      </div>
    );
  }

  if (!dataInfo) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-4">Data Session Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The data session may have expired or is invalid.
            </p>
            <Link href="/data">
              <Button>Upload New Data</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Brain className="h-8 w-8" />
            Machine Learning
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Train models and discover insights with AI • {dataInfo.shape[0]} rows × {dataInfo.shape[1]} columns
          </p>
          <div className="mt-4 flex gap-2">
            <Link href={`/reports?session=${sessionId}`}>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={async () => {
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(sessionId!);
                  } else {
                    const textArea = document.createElement('textarea');
                    textArea.value = sessionId!;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                  }
                  toast.success("Session ID copied!");
                } catch (error) {
                  toast.error("Failed to copy session ID");
                }
              }}
              className="dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Session ID
            </Button>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Data Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dataset Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Total Features</h4>
                <div className="text-2xl font-bold text-blue-600">
                  {dataInfo.columns.length}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Numeric Features</h4>
                <div className="text-xl font-bold text-green-600">
                  {dataInfo.numeric_columns.length}
                </div>
                <div className="space-y-1 mt-2">
                  {dataInfo.numeric_columns.slice(0, 3).map((col) => (
                    <div key={col} className="text-xs text-muted-foreground truncate">
                      {col}
                    </div>
                  ))}
                  {dataInfo.numeric_columns.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dataInfo.numeric_columns.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Categorical Features</h4>
                <div className="text-xl font-bold text-purple-600">
                  {dataInfo.categorical_columns.length}
                </div>
                <div className="space-y-1 mt-2">
                  {dataInfo.categorical_columns.slice(0, 3).map((col) => (
                    <div key={col} className="text-xs text-muted-foreground truncate">
                      {col}
                    </div>
                  ))}
                  {dataInfo.categorical_columns.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dataInfo.categorical_columns.length - 3} more
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Missing Values</h4>
                <div className="text-xl font-bold text-red-600">
                  {Object.values(dataInfo.missing_values).reduce((sum, count) => sum + count, 0)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/visualize?session=${sessionId}`}>
                <Button variant="outline" size="sm" className="w-full">
                  Visualize Data
                </Button>
              </Link>
              <Link href="/data">
                <Button variant="outline" size="sm" className="w-full">
                  Clean Data
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* ML Training Interface */}
        <div className="lg:col-span-3">
          <MLTraining
            sessionId={sessionId}
            columns={dataInfo.columns}
            numericColumns={dataInfo.numeric_columns}
          />
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}