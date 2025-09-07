'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Brain, BarChart3, Sparkles, CheckCircle } from 'lucide-react';

interface OneClickPresetsProps {
  sessionId: string;
  onPresetApplied: (presetId: string) => void;
  isLoading?: boolean;
}

const PRESETS = [
  {
    id: 'ml_ready',
    title: 'Prepare for ML',
    description: 'Optimize data for machine learning',
    icon: Brain,
    color: 'bg-purple-100 text-purple-700',
    actions: [
      'Handle missing values (median/mode)',
      'Remove duplicates',
      'Encode categorical variables',
      'Normalize numeric columns',
      'Remove outliers (IQR method)'
    ],
    estimatedTime: '30-60s'
  },
  {
    id: 'viz_ready',
    title: 'Prepare for Visualization',
    description: 'Clean data for better charts',
    icon: BarChart3,
    color: 'bg-blue-100 text-blue-700',
    actions: [
      'Handle missing values (forward fill)',
      'Remove duplicates',
      'Format date columns',
      'Clean text columns',
      'Detect outliers (keep for viz)'
    ],
    estimatedTime: '15-30s'
  },
  {
    id: 'quick_clean',
    title: 'Quick Clean',
    description: 'Basic cleaning operations',
    icon: Sparkles,
    color: 'bg-green-100 text-green-700',
    actions: [
      'Remove duplicates',
      'Drop empty rows/columns',
      'Basic type conversion',
      'Trim whitespace'
    ],
    estimatedTime: '10-15s'
  }
];

export default function OneClickPresets({ sessionId, onPresetApplied, isLoading = false }: OneClickPresetsProps) {
  const [appliedPresets, setAppliedPresets] = useState<string[]>([]);
  const [processingPreset, setProcessingPreset] = useState<string | null>(null);

  const applyPreset = async (presetId: string) => {
    setProcessingPreset(presetId);
    
    try {
      // Simulate API call for preset application
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAppliedPresets([...appliedPresets, presetId]);
      onPresetApplied(presetId);
    } catch (error) {
      console.error('Failed to apply preset:', error);
    } finally {
      setProcessingPreset(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4" />
          One-Click Presets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isApplied = appliedPresets.includes(preset.id);
            const isProcessing = processingPreset === preset.id;
            
            return (
              <div key={preset.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${preset.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{preset.title}</h4>
                      <p className="text-xs text-gray-600">{preset.description}</p>
                    </div>
                  </div>
                  {isApplied && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Applied
                    </Badge>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Operations:</div>
                  <ul className="text-xs space-y-1">
                    {preset.actions.map((action, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Est. time: {preset.estimatedTime}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => applyPreset(preset.id)}
                    disabled={isLoading || isProcessing || isApplied}
                    className="text-xs"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                        Processing...
                      </>
                    ) : isApplied ? (
                      'Applied'
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-700 font-medium mb-1">💡 Pro Tip</div>
          <div className="text-xs text-blue-600">
            Use "Prepare for ML" if you plan to train models, or "Prepare for Visualization" for better charts.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}