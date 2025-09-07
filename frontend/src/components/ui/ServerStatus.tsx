"use client";

import { useState, useEffect } from "react";
import { checkServerHealth } from "@/lib/api";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ServerStatus() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsChecking(true);
      const healthy = await checkServerHealth();
      setIsHealthy(healthy);
      setIsChecking(false);
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isChecking && isHealthy === null) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking server connection...</AlertDescription>
      </Alert>
    );
  }

  if (isHealthy === false) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Server Offline:</strong> Cannot connect to backend server. 
          Please ensure the backend is running on http://localhost:8000
        </AlertDescription>
      </Alert>
    );
  }

  if (isHealthy === true) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>Server connected successfully</AlertDescription>
      </Alert>
    );
  }

  return null;
}