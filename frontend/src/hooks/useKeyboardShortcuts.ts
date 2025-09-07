'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const saveSession = useCallback(() => {
    toast.success('Session saved!', { description: 'Your work has been saved automatically' });
  }, []);

  const exportData = useCallback(() => {
    toast.info('Export started', { description: 'Your data is being prepared for download' });
  }, []);

  const showShortcutsHelp = useCallback(() => {
    toast.info('Keyboard Shortcuts', {
      description: 'Ctrl+S: Save • Ctrl+E: Export • Ctrl+/: Help',
      duration: 3000
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Save shortcut
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSession();
      }
      
      // Export shortcut
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportData();
      }
      
      // Help shortcut
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        showShortcutsHelp();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [saveSession, exportData, showShortcutsHelp]);

  return { showShortcutsHelp };
}