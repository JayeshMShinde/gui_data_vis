'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function AuthToasts() {
  const { isSignedIn, isLoaded } = useAuth();
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (prevSignedIn.current === false && isSignedIn) {
      toast.success('Login successful!', {
        description: 'Welcome back to DataViz Pro'
      });
    }

    if (prevSignedIn.current === true && !isSignedIn) {
      toast.success('Logged out successfully', {
        description: 'See you next time!'
      });
    }

    prevSignedIn.current = isSignedIn;
  }, [isSignedIn, isLoaded]);

  return null;
}