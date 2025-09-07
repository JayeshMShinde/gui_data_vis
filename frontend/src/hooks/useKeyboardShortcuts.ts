import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (!(event.ctrlKey || event.metaKey)) return;

      switch (event.key) {
        case '1':
          event.preventDefault();
          router.push('/data');
          toast.success('Navigated to Data Management');
          break;
        case '2':
          event.preventDefault();
          router.push('/visualize');
          toast.success('Navigated to Visualizations');
          break;
        case '3':
          event.preventDefault();
          router.push('/ml');
          toast.success('Navigated to Machine Learning');
          break;
        case '4':
          event.preventDefault();
          router.push('/reports');
          toast.success('Navigated to Reports');
          break;
        case 'h':
          event.preventDefault();
          router.push('/');
          toast.success('Navigated to Home');
          break;
        case 's':
          event.preventDefault();
          router.push('/settings');
          toast.success('Navigated to Settings');
          break;
        case '/':
          event.preventDefault();
          showShortcutsHelp();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const showShortcutsHelp = () => {
    toast.info('Keyboard Shortcuts', {
      description: 'Ctrl+1: Data • Ctrl+2: Visualize • Ctrl+3: ML • Ctrl+4: Reports • Ctrl+H: Home • Ctrl+S: Settings',
      duration: 5000
    });
  };

  return { showShortcutsHelp };
}