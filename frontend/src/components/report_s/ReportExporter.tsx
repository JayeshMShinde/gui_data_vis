'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';

interface ReportExporterProps {
  sessionId: string;
  reportData: any;
}

export default function ReportExporter({ sessionId, reportData }: ReportExporterProps) {
  const handleExport = () => {
    const content = `Report for Session: ${sessionId}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </CardContent>
    </Card>
  );
}