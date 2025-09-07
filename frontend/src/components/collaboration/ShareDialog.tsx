'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Share2, Copy, Mail, Link } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  children: React.ReactNode;
  itemType: 'chart' | 'dashboard' | 'dataset';
  itemId: string;
}

export default function ShareDialog({ children, itemType, itemId }: ShareDialogProps) {
  const [permission, setPermission] = useState('view');
  const [requireAuth, setRequireAuth] = useState(true);
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const token = Math.random().toString(36).substring(7);
    const link = `${baseUrl}/shared/${itemType}/${itemId}?token=${token}&permission=${permission}`;
    setShareLink(link);
    return link;
  };

  const copyToClipboard = () => {
    const link = shareLink || generateShareLink();
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const shareViaEmail = () => {
    const link = shareLink || generateShareLink();
    const subject = `Shared ${itemType}: DataViz Pro`;
    const body = `I've shared a ${itemType} with you on DataViz Pro. View it here: ${link}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share {itemType}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View Only</SelectItem>
                <SelectItem value="comment">Can Comment</SelectItem>
                <SelectItem value="edit">Can Edit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label>Require Authentication</Label>
            <Switch checked={requireAuth} onCheckedChange={setRequireAuth} />
          </div>

          <div>
            <Label>Share Link</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={shareLink || 'Click generate to create link'} 
                readOnly 
                className="flex-1"
              />
              <Button onClick={generateShareLink} variant="outline" size="sm">
                <Link className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={copyToClipboard} className="flex-1" variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={shareViaEmail} className="flex-1" variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}