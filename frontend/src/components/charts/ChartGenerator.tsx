"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BarChart3, ScatterChart, TrendingUp, BarChart2, PieChart, Box, Grid3X3, Lightbulb, Star } from "lucide-react";
import { generateChart, getVisualizationRecommendations } from "@/lib/api";

type ChartType = "bar" | "scatter" | "line" | "histogram" | "pie" | "box" | "heatmap";

interface ChartConfig {
  chart_type: ChartType;
  x_column?: string;
  y_column?: string;
  color_column?: string;
  group_column?: string;
  orientation?: string;
  bins?: number;
  title?: string;
}

interface ChartGeneratorProps {
  sessionId: string;
  columns: string[];
  numericColumns: string[];
  categoricalColumns: string[];
}

const chartTypes = [
  { value: "bar", label: "Bar Chart", icon: BarChart3, requiresXY: true },
  { value: "scatter", label: "Scatter Plot", icon: ScatterChart, requiresXY: true },
  { value: "line", label: "Line Chart", icon: TrendingUp, requiresXY: true },
  { value: "histogram", label: "Histogram", icon: BarChart2, requiresXY: false },
  { value: "pie", label: "Pie Chart", icon: PieChart, requiresXY: false },
  { value: "box", label: "Box Plot", icon: Box, requiresXY: false },
  { value: "heatmap", label: "Heatmap", icon: Grid3X3, requiresXY: false },
];

export default function ChartGenerator({ 
  sessionId, 
  columns, 
  numericColumns, 
  categoricalColumns 
}: ChartGeneratorProps) {
  const [config, setConfig] = useState<ChartConfig>({
    chart_type: "bar",
    orientation: "vertical",
    bins: 30,
    title: ""
  });
  const [generatedChart, setGeneratedChart] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);

  const { data: recommendations } = useQuery({
    queryKey: ["viz-recommendations", sessionId],
    queryFn: () => getVisualizationRecommendations(sessionId),
    enabled: showRecommendations
  });

  const generateChartMutation = useMutation({
    mutationFn: async (chartConfig: ChartConfig) => {
      return await generateChart({
        session_id: sessionId,
        ...chartConfig
      });
    },
    onSuccess: (data) => {
      setGeneratedChart(data.chart_data);
      toast.success("Chart generated successfully!");
    },
    onError: (error) => {
      toast.error(`Chart generation failed: ${error.message}`);
    }
  });

  const handleGenerate = () => {
    const selectedChart = chartTypes.find(ct => ct.value === config.chart_type);
    
    if (selectedChart?.requiresXY && (!config.x_column || !config.y_column)) {
      toast.error("Please select both X and Y columns for this chart type");
      return;
    }
    
    if (!selectedChart?.requiresXY && !config.x_column) {
      toast.error("Please select a column for this chart type");
      return;
    }

    generateChartMutation.mutate(config);
  };

  const selectedChart = chartTypes.find(ct => ct.value === config.chart_type);

  return (
    <div className="space-y-6">
      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="mb-4"
          >
            {showRecommendations ? "Hide" : "Show"} Column Recommendations
          </Button>
          
          {showRecommendations && recommendations && (
            <div className="space-y-4">
              {/* Chart Combinations */}
              {recommendations.chart_combinations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    Recommended Chart Combinations
                  </h4>
                  <div className="space-y-2">
                    {recommendations.chart_combinations.map((rec: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium capitalize">{rec.chart_type} Chart</span>
                            <span className="text-xs px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded">
                              {rec.x_column} × {rec.y_column}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{rec.reason}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            setConfig({
                              ...config,
                              chart_type: rec.chart_type,
                              x_column: rec.x_column,
                              y_column: rec.y_column,
                              title: rec.reason
                            });
                          }}
                          className="h-7 text-xs"
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* X-Axis Recommendations */}
              {recommendations.x_axis_recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Best X-Axis Columns</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.x_axis_recommendations.slice(0, 6).map((rec: any, idx: number) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={config.x_column === rec.column ? "default" : "outline"}
                        onClick={() => setConfig({...config, x_column: rec.column})}
                        className="h-7 text-xs"
                        title={rec.reason}
                      >
                        {rec.column}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Y-Axis Recommendations */}
              {recommendations.y_axis_recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Best Y-Axis Columns</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.y_axis_recommendations.slice(0, 6).map((rec: any, idx: number) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={config.y_column === rec.column ? "default" : "outline"}
                        onClick={() => setConfig({...config, y_column: rec.column})}
                        className="h-7 text-xs"
                        title={rec.reason}
                      >
                        {rec.column}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Color Recommendations */}
              {recommendations.color_recommendations?.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Best Color Coding Columns</h4>
                  <div className="flex flex-wrap gap-1">
                    {recommendations.color_recommendations.slice(0, 4).map((rec: any, idx: number) => (
                      <Button
                        key={idx}
                        size="sm"
                        variant={config.color_column === rec.column ? "default" : "outline"}
                        onClick={() => setConfig({...config, color_column: rec.column})}
                        className="h-7 text-xs"
                        title={rec.reason}
                      >
                        {rec.column}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Chart Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chart Type */}
          <div>
            <Label>Chart Type</Label>
            <Select 
              value={config.chart_type} 
              onValueChange={(value: ChartType) => setConfig({...config, chart_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {chartTypes.map((chart) => {
                  const Icon = chart.icon;
                  return (
                    <SelectItem key={chart.value} value={chart.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {chart.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* X Column */}
          {(selectedChart?.requiresXY || config.chart_type === "histogram" || 
            config.chart_type === "pie" || config.chart_type === "box") && (
            <div>
              <Label>
                {config.chart_type === "histogram" ? "Column" : 
                 config.chart_type === "pie" ? "Category Column" :
                 config.chart_type === "box" ? "Value Column" : "X Column"}
              </Label>
              <Select 
                value={config.x_column || ""} 
                onValueChange={(value) => setConfig({...config, x_column: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Y Column */}
          {selectedChart?.requiresXY && (
            <div>
              <Label>Y Column</Label>
              <Select 
                value={config.y_column || ""} 
                onValueChange={(value) => setConfig({...config, y_column: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Additional Options */}
          {config.chart_type === "scatter" && (
            <div>
              <Label>Color Column (Optional)</Label>
              <Select 
                value={config.color_column || ""} 
                onValueChange={(value) => setConfig({...config, color_column: value === "none" ? undefined : value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {columns.map((col) => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {config.chart_type === "bar" && (
            <div>
              <Label>Orientation</Label>
              <Select 
                value={config.orientation} 
                onValueChange={(value) => setConfig({...config, orientation: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {config.chart_type === "histogram" && (
            <div>
              <Label>Number of Bins</Label>
              <Input
                type="number"
                value={config.bins}
                onChange={(e) => setConfig({...config, bins: parseInt(e.target.value) || 30})}
                min="5"
                max="100"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <Label>Chart Title (Optional)</Label>
            <Input
              value={config.title}
              onChange={(e) => setConfig({...config, title: e.target.value})}
              placeholder="Enter chart title"
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={generateChartMutation.isPending}
            className="w-full"
          >
            {generateChartMutation.isPending ? "Generating..." : "Generate Chart"}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Chart */}
      {generatedChart && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <img 
                src={generatedChart} 
                alt="Generated Chart" 
                className="max-w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}