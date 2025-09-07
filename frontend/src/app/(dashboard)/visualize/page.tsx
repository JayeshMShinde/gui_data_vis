"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MobileLayout from "@/components/mobile/MobileLayout";
import ChartTemplates from "@/components/templates/ChartTemplates";
import ChartGenerator from "@/components/charts/ChartGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, BarChart3, Brain, FileText, Copy } from "lucide-react";
import { toast } from "sonner";
import { getDataInfo } from "@/lib/api";
import ShareDialog from "@/components/collaboration/ShareDialog";
import CommentSystem from "@/components/collaboration/CommentSystem";
import { Share2 } from "lucide-react";

interface DataInfo {
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  numeric_columns: string[];
  categorical_columns: string[];
}

function VisualizePageContent() {
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
              Please upload data first to create visualizations.
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

  const handleTemplateSelect = (template: string) => {
    toast.success(`Applied ${template} template!`);
  };

  return (
    <>
      <div className="block md:hidden">
        <MobileLayout>
          <div className="p-4">
            <ChartTemplates onSelectTemplate={handleTemplateSelect} />
          </div>
        </MobileLayout>
      </div>
      <div className="hidden md:block">
        <DashboardLayout>
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Chart Templates</h2>
              <ChartTemplates onSelectTemplate={handleTemplateSelect} />
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                Data Visualization
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Create stunning visualizations from your data • {dataInfo.shape[0]} rows × {dataInfo.shape[1]} columns
              </p>
              <div className="mt-4 flex gap-2">
                <Link href={`/ml?session=${sessionId}`}>
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Continue to ML
                  </Button>
                </Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Data Visualization
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create stunning visualizations from your data • {dataInfo.shape[0]} rows × {dataInfo.shape[1]} columns
          </p>
          <div className="mt-4 flex gap-2">
            <Link href={`/ml?session=${sessionId}`}>
              <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                <Brain className="h-4 w-4 mr-2" />
                Continue to ML
              </Button>
            </Link>
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
                      <h4 className="font-medium text-sm mb-2">Numeric Columns ({dataInfo.numeric_columns.length})</h4>
                      <div className="space-y-1">
                        {dataInfo.numeric_columns.slice(0, 5).map((col) => (
                          <div key={col} className="text-xs text-muted-foreground truncate">
                            {col}
                          </div>
                        ))}
                        {dataInfo.numeric_columns.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            +{dataInfo.numeric_columns.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Categorical Columns ({dataInfo.categorical_columns.length})</h4>
                      <div className="space-y-1">
                        {dataInfo.categorical_columns.slice(0, 5).map((col) => (
                          <div key={col} className="text-xs text-muted-foreground truncate">
                            {col}
                          </div>
                        ))}
                        {dataInfo.categorical_columns.length > 5 && (
                          <div className="text-xs text-muted-foreground">
                            +{dataInfo.categorical_columns.length - 5} more
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Generator */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Chart Builder</h3>
                  <ShareDialog itemType="dashboard" itemId={sessionId!}>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Dashboard
                    </Button>
                  </ShareDialog>
                </div>
                
                <ChartGenerator
                  sessionId={sessionId}
                  columns={dataInfo.columns}
                  numericColumns={dataInfo.numeric_columns}
                  categoricalColumns={dataInfo.categorical_columns}
                />
                
                <CommentSystem itemId={sessionId!} itemType="dashboard" />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}

export default function VisualizePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <VisualizePageContent />
    </Suspense>
  );
}