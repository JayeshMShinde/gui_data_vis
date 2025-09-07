'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const CHART_TEMPLATES = {
  sales_dashboard: {
    name: 'Sales Dashboard',
    description: 'Track sales performance with key metrics',
    charts: ['bar', 'line', 'pie'],
    layout: 'grid',
    icon: BarChart3,
    color: 'from-blue-500 to-cyan-500'
  },
  financial_report: {
    name: 'Financial Report',
    description: 'Comprehensive financial analysis',
    charts: ['line', 'area', 'table'],
    layout: 'vertical',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  marketing_analytics: {
    name: 'Marketing Analytics',
    description: 'Campaign performance and ROI tracking',
    charts: ['pie', 'bar', 'scatter'],
    layout: 'mixed',
    icon: PieChart,
    color: 'from-purple-500 to-violet-500'
  },
  operational_metrics: {
    name: 'Operational Metrics',
    description: 'Monitor KPIs and operational efficiency',
    charts: ['gauge', 'line', 'heatmap'],
    layout: 'dashboard',
    icon: Activity,
    color: 'from-orange-500 to-red-500'
  }
};

interface ChartTemplatesProps {
  onSelectTemplate: (template: string) => void;
}

export default function ChartTemplates({ onSelectTemplate }: ChartTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(CHART_TEMPLATES).map(([key, template]) => {
        const Icon = template.icon;
        return (
          <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="pb-3">
              <div className={`h-12 w-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.charts.map((chart) => (
                  <span key={chart} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                    {chart}
                  </span>
                ))}
              </div>
              <Button 
                onClick={() => onSelectTemplate(key)}
                className="w-full"
                size="sm"
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}