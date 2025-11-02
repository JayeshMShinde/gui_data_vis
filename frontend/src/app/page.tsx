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
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import Tooltip from "@/components/ui/Tooltip";
import { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';

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
  const { isSignedIn, isLoaded } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Redirect handled by middleware

  useEffect(() => {
    setMounted(true);
    if (isSignedIn) {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [isSignedIn]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  if (!mounted || !isLoaded) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to DataViz Pro</h1>
          <p className="text-lg mb-6">Please sign in to continue</p>
          <Link href="/landing">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <OnboardingWizard onComplete={handleOnboardingComplete} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="section-padding py-8 min-h-full animate-fade-in">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <div className="mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DataViz Pro
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl">
              Your complete AI-powered data science platform for analysis, visualization, and machine learning
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.name} 
                className="border-0 shadow-soft bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-medium transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="card-padding">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">
                        {stat.name}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 via-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-medium">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="border-0 shadow-soft bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:shadow-strong transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="card-padding pb-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-14 w-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-medium`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 dark:text-white mb-2 tracking-tight">
                        {feature.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="card-padding pt-0">
                  <Tooltip content={`Navigate to ${feature.title} (Ctrl+${features.indexOf(feature) + 1})`}>
                    <Link href={feature.href}>
                      <Button className="w-full gradient-primary hover:opacity-90 text-white border-0 shadow-medium hover:shadow-strong transition-all duration-300 py-3 text-base font-semibold">
                        Get Started
                        <Zap className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </Tooltip>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Start */}
        <Card className="border-0 shadow-medium bg-gradient-to-br from-blue-50 via-purple-50/80 to-fuchsia-50/60 dark:from-gray-800/50 dark:via-gray-800/40 dark:to-gray-700/40 backdrop-blur-sm">
          <CardHeader className="card-padding pb-4">
            <CardTitle className="text-2xl text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              Quick Start Guide
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Get up and running with DataViz Pro in just 4 simple steps
            </p>
          </CardHeader>
          <CardContent className="card-padding pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 1, title: "Upload Data", color: "from-blue-500 to-blue-600" },
                { step: 2, title: "Clean & Process", color: "from-emerald-500 to-emerald-600" },
                { step: 3, title: "Visualize & Analyze", color: "from-purple-500 to-purple-600" },
                { step: 4, title: "Generate Reports", color: "from-orange-500 to-orange-600" }
              ].map((item, index) => (
                <div 
                  key={item.step} 
                  className="text-center group animate-slide-up"
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <div className={`h-12 w-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}