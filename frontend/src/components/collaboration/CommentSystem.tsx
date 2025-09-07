'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Reply, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSystemProps {
  itemId: string;
  itemType: 'chart' | 'dashboard';
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    content: 'Great visualization! The trend is very clear. Could we add a forecast line?',
    timestamp: '2 hours ago',
    likes: 3,
    replies: [
      {
        id: '1-1',
        author: 'Mike Johnson',
        content: 'Good idea! I can add that in the next iteration.',
        timestamp: '1 hour ago',
        likes: 1
      }
    ]
  },
  {
    id: '2',
    author: 'Alex Rivera',
    content: 'The color scheme works well, but maybe we could use more contrast for accessibility?',
    timestamp: '4 hours ago',
    likes: 2
  }
];

export default function CommentSystem({ itemId, itemType }: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: newComment,
      timestamp: 'Just now',
      likes: 0
    };

    if (replyTo) {
      setComments(prev => prev.map(c => 
        c.id === replyTo 
          ? { ...c, replies: [...(c.replies || []), comment] }
          : c
      ));
      setReplyTo(null);
    } else {
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
    toast.success('Comment added!');
  };

  const likeComment = (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId 
        ? { ...c, likes: c.likes + 1 }
        : {
            ...c,
            replies: c.replies?.map(r => 
              r.id === commentId ? { ...r, likes: r.likes + 1 } : r
            )
          }
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment */}
        <div className="space-y-2">
          <Textarea
            placeholder={replyTo ? 'Write a reply...' : 'Add a comment...'}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-between items-center">
            {replyTo && (
              <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                Cancel Reply
              </Button>
            )}
            <Button onClick={addComment} size="sm" className="ml-auto bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Send className="h-4 w-4 mr-2" />
              {replyTo ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex gap-3 animate-in slide-in-from-left-4 duration-300" style={{animationDelay: `${comments.indexOf(comment) * 100}ms`}}>
                <Avatar className="h-8 w-8 ring-2 ring-violet-500/20">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white font-semibold">{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likeComment(comment.id)}
                      className="h-7 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(comment.id)}
                      className="h-7 px-3 text-xs text-gray-600 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200"
                    >
                      <Reply className="h-3 w-3 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-2">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 animate-in slide-in-from-left-2 duration-200">
                      <Avatar className="h-6 w-6 ring-1 ring-gray-300 dark:ring-gray-600">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-gray-500 to-gray-600 text-white font-medium">{reply.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-xs text-gray-900 dark:text-white">{reply.author}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{reply.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-700 dark:text-gray-300">{reply.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => likeComment(reply.id)}
                          className="h-6 px-2 text-xs mt-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          <Heart className="h-2 w-2 mr-1" />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}