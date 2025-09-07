'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

interface LoadingToastProps {
  isLoading: boolean;
  loadingMessage: string;
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}

export function useLoadingToast({
  isLoading,
  loadingMessage,
  successMessage,
  errorMessage,
  duration = 0
}: LoadingToastProps) {
  useEffect(() => {
    let toastId: string | number;

    if (isLoading) {
      toastId = toast.loading(loadingMessage, {
        duration: duration || Infinity
      });
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading, loadingMessage, duration]);
}

export function showProgressToast(message: string, progress: number) {
  toast.loading(`${message} (${progress}%)`, {
    description: `Progress: ${progress}%`,
    duration: Infinity
  });
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000
  });
}

export function showErrorToast(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 5000
  });
}