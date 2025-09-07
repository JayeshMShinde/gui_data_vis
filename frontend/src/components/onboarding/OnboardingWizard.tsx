'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Upload, Sparkles, BarChart3, FileText, Save } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  currentStep?: number;
}

const STEPS = [
  {
    id: 1,
    title: 'Upload Data',
    description: 'Start by uploading your CSV or Excel file',
    icon: Upload,
    action: 'Upload your first dataset to begin analysis'
  },
  {
    id: 2,
    title: 'Clean Data',
    description: 'Remove duplicates and handle missing values',
    icon: Sparkles,
    action: 'Use one-click presets or manual cleaning tools'
  },
  {
    id: 3,
    title: 'Visualize',
    description: 'Create charts and explore your data',
    icon: BarChart3,
    action: 'Generate charts with AI recommendations'
  },
  {
    id: 4,
    title: 'Generate Report',
    description: 'Create professional reports',
    icon: FileText,
    action: 'Export insights as PDF or PowerPoint'
  },
  {
    id: 5,
    title: 'Save Session',
    description: 'Save your work for later',
    icon: Save,
    action: 'Keep your analysis for future reference'
  }
];

export default function OnboardingWizard({ onComplete, currentStep = 1 }: OnboardingWizardProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
    if (stepId < STEPS.length) {
      setActiveStep(stepId + 1);
    } else {
      onComplete();
    }
  };

  const progress = (completedSteps.length / STEPS.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Welcome to DataViz Pro
        </CardTitle>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Let's get you started with a quick 5-step tour
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500">
            {completedSteps.length} of {STEPS.length} steps completed
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isActive = activeStep === step.id;
            const isAccessible = step.id <= activeStep || isCompleted;

            return (
              <div key={step.id} className="relative">
                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gray-200 z-0">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}

                <Card className={`relative z-10 transition-all duration-200 ${
                  isActive ? 'ring-2 ring-blue-500 shadow-lg' : 
                  isCompleted ? 'bg-green-50 border-green-200' : 
                  isAccessible ? 'hover:shadow-md cursor-pointer' : 'opacity-50'
                }`}>
                  <CardContent className="p-4 text-center">
                    <div className="relative mb-3">
                      <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isActive ? 'bg-blue-500 text-white' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {step.id}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{step.description}</p>
                    
                    {isActive && (
                      <div className="space-y-2">
                        <p className="text-xs text-blue-600 font-medium">
                          {step.action}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleStepComplete(step.id)}
                          className="w-full"
                        >
                          {step.id === STEPS.length ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    )}
                    
                    {isCompleted && (
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Completed
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">💡 Quick Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Upload CSV or Excel files up to 100MB</li>
            <li>• Use AI recommendations for best chart types</li>
            <li>• Save sessions to continue work later</li>
            <li>• Export reports as PDF or PowerPoint</li>
          </ul>
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="ghost" size="sm" onClick={onComplete}>
            Skip Tutorial
          </Button>
          <div className="text-xs text-gray-500">
            Need help? Check our documentation
          </div>
        </div>
      </CardContent>
    </Card>
  );
}