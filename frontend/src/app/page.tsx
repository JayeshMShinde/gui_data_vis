"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Database, 
  BarChart3, 
  Brain, 
  FileText,
  TrendingUp,
  Users,
  Activity,
  Zap
} from "lucide-react";

const features = [
  {
    title: "Data Management",
    description: "Upload, clean, and transform your datasets with powerful tools",
    icon: Database,
    href: "/data",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Visualizations",
    description: "Create stunning charts and graphs from your data",
    icon: BarChart3,
    href: "/visualize",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Machine Learning",
    description: "Train models and discover insights with AI",
    icon: Brain,
    href: "/ml",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Reports",
    description: "Generate comprehensive analysis reports",
    icon: FileText,
    href: "/reports",
    color: "from-orange-500 to-orange-600"
  }
];

const stats = [
  { name: "Datasets Processed", value: "2.4K", icon: Database },
  { name: "Charts Generated", value: "12.8K", icon: TrendingUp },
  { name: "Models Trained", value: "847", icon: Activity },
  { name: "Active Users", value: "1.2K", icon: Users },
];

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to DataViz Pro
          </h1>
          <p className="text-lg text-gray-600">
            Your complete data science platform for analysis, visualization, and machine learning
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                      <p className="text-gray-600 mt-1">{feature.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={feature.href}>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                      Get Started
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Quick Start Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-sm font-medium">Upload Data</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-sm font-medium">Clean & Process</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-sm font-medium">Visualize & Analyze</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">4</span>
                </div>
                <p className="text-sm font-medium">Generate Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}