'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, BarChart3, PieChart, TrendingUp, Database } from 'lucide-react';

interface DataInfo {
  shape: [number, number];
  columns: string[];
  dtypes: Record<string, string>;
  missing_values: Record<string, number>;
  numeric_columns: string[];
  categorical_columns: string[];
}

interface DataProfilingDashboardProps {
  dataInfo: DataInfo;
  preview: any[];
}

export default function DataProfilingDashboard({ dataInfo, preview }: DataProfilingDashboardProps) {
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    generateInsights();
  }, [dataInfo]);

  const generateInsights = () => {
    const newInsights = [];
    
    // Data quality score
    const totalMissing = Object.values(dataInfo.missing_values).reduce((sum, count) => sum + count, 0);
    const missingPercentage = (totalMissing / (dataInfo.shape[0] * dataInfo.shape[1])) * 100;
    const qualityScore = Math.max(0, 100 - missingPercentage * 2);
    
    newInsights.push({
      type: 'quality',
      title: 'Data Quality Score',
      value: `${qualityScore.toFixed(0)}%`,
      status: qualityScore > 80 ? 'good' : qualityScore > 60 ? 'warning' : 'error',
      description: `${missingPercentage.toFixed(1)}% missing values detected`
    });

    // Column type distribution
    const numericRatio = (dataInfo.numeric_columns.length / dataInfo.columns.length) * 100;
    newInsights.push({
      type: 'distribution',
      title: 'Numeric Columns',
      value: `${dataInfo.numeric_columns.length}/${dataInfo.columns.length}`,
      status: numericRatio > 50 ? 'good' : 'warning',
      description: `${numericRatio.toFixed(0)}% of columns are numeric`
    });

    // Dataset size assessment
    const sizeCategory = dataInfo.shape[0] > 10000 ? 'Large' : dataInfo.shape[0] > 1000 ? 'Medium' : 'Small';
    newInsights.push({
      type: 'size',
      title: 'Dataset Size',
      value: sizeCategory,
      status: 'info',
      description: `${dataInfo.shape[0].toLocaleString()} rows × ${dataInfo.shape[1]} columns`
    });

    setInsights(newInsights);
  };

  const getColumnTypeIcon = (dtype: string) => {
    if (dtype.includes('int') || dtype.includes('float')) return <TrendingUp className="h-4 w-4" />;
    if (dtype.includes('object') || dtype.includes('string')) return <Database className="h-4 w-4" />;
    return <BarChart3 className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <div className={`p-1 rounded-full ${getStatusColor(insight.status)}`}>
                  {getStatusIcon(insight.status)}
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{insight.value}</div>
              <p className="text-xs text-gray-600">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Column Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataInfo.columns.slice(0, 8).map((column) => {
                const dtype = dataInfo.dtypes[column] || 'unknown';
                const missingCount = dataInfo.missing_values[column] || 0;
                const missingPercentage = (missingCount / dataInfo.shape[0]) * 100;
                
                return (
                  <div key={column} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      {getColumnTypeIcon(dtype)}
                      <div>
                        <div className="font-medium text-sm truncate max-w-32">{column}</div>
                        <div className="text-xs text-gray-500">{dtype}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {missingCount > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {missingPercentage.toFixed(1)}% missing
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
              {dataInfo.columns.length > 8 && (
                <div className="text-xs text-gray-500 text-center">
                  +{dataInfo.columns.length - 8} more columns
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Quality Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Quality Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Missing Values */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Missing Values</span>
                  <span className="text-sm text-gray-600">
                    {Object.values(dataInfo.missing_values).reduce((sum, count) => sum + count, 0)} total
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (Object.values(dataInfo.missing_values).reduce((sum, count) => sum + count, 0) / (dataInfo.shape[0] * dataInfo.shape[1])) * 100 * 10)} 
                  className="h-2" 
                />
              </div>

              {/* Data Types Distribution */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Numeric Columns</span>
                  <span className="text-sm text-gray-600">
                    {dataInfo.numeric_columns.length}/{dataInfo.columns.length}
                  </span>
                </div>
                <Progress 
                  value={(dataInfo.numeric_columns.length / dataInfo.columns.length) * 100} 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Categorical Columns</span>
                  <span className="text-sm text-gray-600">
                    {dataInfo.categorical_columns.length}/{dataInfo.columns.length}
                  </span>
                </div>
                <Progress 
                  value={(dataInfo.categorical_columns.length / dataInfo.columns.length) * 100} 
                  className="h-2" 
                />
              </div>

              {/* Quick Stats */}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Rows</div>
                    <div className="font-semibold">{dataInfo.shape[0].toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Columns</div>
                    <div className="font-semibold">{dataInfo.shape[1]}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.values(dataInfo.missing_values).reduce((sum, count) => sum + count, 0) > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Consider handling missing values before analysis</span>
              </div>
            )}
            {dataInfo.numeric_columns.length > 2 && (
              <div className="flex items-center space-x-2 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span>Great for correlation analysis and scatter plots</span>
              </div>
            )}
            {dataInfo.categorical_columns.length > 0 && (
              <div className="flex items-center space-x-2 text-sm">
                <PieChart className="h-4 w-4 text-green-500" />
                <span>Perfect for categorical analysis and bar charts</span>
              </div>
            )}
            {dataInfo.shape[0] > 1000 && (
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span>Large dataset - ideal for machine learning</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}