"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAllSessions, saveSession, deleteSession } from "@/lib/api";
import { useSession } from "@/contexts/SessionContext";
import Link from "next/link";
import { 
  Database, 
  Calendar, 
  FileText, 
  Trash2, 
  Eye,
  Save
} from "lucide-react";

interface SavedSession {
  session_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  file_name: string;
  data_shape: [number, number];
  columns: string[];
}

export default function SessionsPage() {
  const [sessionName, setSessionName] = useState("");
  const { currentSessionId } = useSession();
  const queryClient = useQueryClient();

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: getAllSessions
  });

  const saveSessionMutation = useMutation({
    mutationFn: saveSession,
    onSuccess: () => {
      toast.success("Session saved successfully!", {
        description: "You can now access this session anytime"
      });
      setSessionName("");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error: any) => {
      toast.error("Failed to save session", {
        description: error.message
      });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      toast.success("Session deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
    onError: (error: any) => {
      toast.error("Failed to delete session", {
        description: error.message
      });
    }
  });

  const handleSaveSession = () => {
    if (!currentSessionId) {
      toast.error("No active session to save");
      return;
    }
    if (!sessionName.trim()) {
      toast.error("Please enter a session name");
      return;
    }
    saveSessionMutation.mutate({
      session_id: currentSessionId,
      name: sessionName.trim()
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate(sessionId);
    }
  };

  const sessions = sessionsData?.sessions || [];

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Database className="h-8 w-8" />
            Saved Sessions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your saved data analysis sessions
          </p>
        </div>

        {/* Save Current Session */}
        {currentSessionId && (
          <Card className="mb-8 border-0 shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Save className="h-5 w-5" />
                Save Current Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label>Session Name</Label>
                  <Input
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Enter a name for this session"
                    className="dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <Button
                  onClick={handleSaveSession}
                  disabled={saveSessionMutation.isPending}
                  className="dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  {saveSessionMutation.isPending ? "Saving..." : "Save Session"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Loading sessions...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No saved sessions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Upload some data and save your first session to get started
              </p>
            </div>
          ) : (
            sessions.map((session: SavedSession) => (
              <Card key={session.session_id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {session.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4" />
                    {new Date(session.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Rows:</span>
                      <span className="font-medium">{session.data_shape[0].toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Columns:</span>
                      <span className="font-medium">{session.data_shape[1]}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link href={`/reports?session=${session.session_id}`} className="flex-1">
                      <Button size="sm" className="w-full dark:bg-blue-600 dark:hover:bg-blue-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Reports
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteSession(session.session_id)}
                      disabled={deleteSessionMutation.isPending}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}