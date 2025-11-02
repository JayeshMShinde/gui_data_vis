'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { 
  BarChart3, 
  Brain, 
  Database, 
  FileText, 
  Zap, 
  CheckCircle,
  Users,
  Shield,
  Sparkles,
  Play,
  Star,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

// O(1) static feature data - no runtime computation needed
const FEATURES = [
  { icon: Database, title: 'Smart Data Management', description: 'Upload, clean, and transform your datasets with AI-powered tools' },
  { icon: BarChart3, title: 'Interactive Visualizations', description: 'Create stunning charts with intelligent recommendations' },
  { icon: Brain, title: 'Machine Learning', description: 'Train models and discover insights with automated ML' },
  { icon: FileText, title: 'Professional Reports', description: 'Generate branded reports with custom themes and logos' }
];

const benefits = [
  'No-code data analysis platform',
  'AI-powered insights and recommendations', 
  'Professional report generation',
  'Enterprise-grade security',
  'Real-time collaboration',
  'Export to 10+ formats'
];

const stats = [
  { number: '10K+', label: 'Active Users', icon: Users },
  { number: '2.4M+', label: 'Data Points', icon: Database },
  { number: '50K+', label: 'Charts Created', icon: BarChart3 },
  { number: '98.7%', label: 'Accuracy Rate', icon: Award }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900 overflow-x-hidden">


      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 animate-in slide-in-from-left-4 duration-500">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">DataViz Pro</span>
            </div>
            <div className="flex items-center space-x-4 animate-in slide-in-from-right-4 duration-500">
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 -z-10"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-full mb-8 shadow-soft">
              <Sparkles className="h-5 w-5 text-blue-600 mr-3 animate-pulse" />
              <span className="text-blue-700 font-semibold tracking-wide">Next-Gen AI Analytics Platform</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-gray-900 animate-slide-up tracking-tight">
            Transform Data Into
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              Beautiful Insights
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '200ms' }}>
            The premium no-code platform for data visualization and machine learning. 
            Create stunning charts and discover insights in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="gradient-primary text-white px-10 py-4 text-lg shadow-strong hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="mr-3 h-5 w-5" />
                Start Free Trial
              </Button>
            </SignUpButton>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-medium"
            >
              <Play className="mr-3 h-5 w-5" />
              View Demo
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-12 text-lg text-gray-500 animate-slide-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center">
              <div className="flex -space-x-3 mr-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-4 border-white shadow-medium animate-pulse"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-4 border-white shadow-medium animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full border-4 border-white shadow-medium animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
              <span className="font-semibold">10,000+ happy users</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="font-semibold">4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">2.4M+</div>
              <div className="text-gray-600 font-medium">Data Points Analyzed</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Charts Created</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 duration-700 delay-400">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">98.7%</div>
              <div className="text-gray-600 font-medium">AI Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed for modern data analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const gradients = [
                'from-indigo-500 to-purple-500',
                'from-purple-500 to-pink-500', 
                'from-pink-500 to-rose-500',
                'from-rose-500 to-orange-500'
              ];
              return (
                <Card key={index} className={`border border-gray-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-500 p-6 group hover:scale-105 animate-in slide-in-from-bottom-6 duration-700`} style={{animationDelay: `${index * 150}ms`}}>
                  <div className={`h-12 w-12 bg-gradient-to-br ${gradients[index]} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose DataViz Pro?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Get Started Today
                  </Button>
                </SignUpButton>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                    <div className="text-sm font-medium">Charts</div>
                    <div className="text-xs text-gray-500">7 Types</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Brain className="h-8 w-8 text-purple-500 mb-2" />
                    <div className="text-sm font-medium">ML Models</div>
                    <div className="text-xs text-gray-500">5 Algorithms</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Users className="h-8 w-8 text-green-500 mb-2" />
                    <div className="text-sm font-medium">Users</div>
                    <div className="text-xs text-gray-500">10K+ Active</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <Shield className="h-8 w-8 text-orange-500 mb-2" />
                    <div className="text-sm font-medium">Security</div>
                    <div className="text-xs text-gray-500">Enterprise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-in slide-in-from-bottom-6 duration-700">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Data Journey?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals creating beautiful insights with DataViz Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Free Trial
                </Button>
              </SignUpButton>
              <Button size="lg" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-10 py-4 transition-all duration-300 hover:scale-105">
                Schedule Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-gray-900">DataViz Pro</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Making data science accessible and beautiful for everyone.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200/50 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 DataViz Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}