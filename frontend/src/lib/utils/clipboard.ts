/**
 * Utility for clipboard operations with fallback support
 */
export class ClipboardUtil {
  /**
   * Copy text to clipboard with fallback for older browsers
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      // Modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }

      // Fallback for older browsers
      return this.fallbackCopyToClipboard(text);
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Fallback clipboard copy using document.execCommand
   */
  private static fallbackCopyToClipboard(text: string): boolean {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      return successful;
    } catch (error) {
      console.error('Fallback clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Check if clipboard API is supported
   */
  static isSupported(): boolean {
    return !!(navigator.clipboard && navigator.clipboard.writeText);
  }
}