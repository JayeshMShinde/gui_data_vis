"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { UserButton } from '@clerk/nextjs';
import { Keyboard } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { showShortcutsHelp } = useKeyboardShortcuts();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900/80">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200/60 dark:border-gray-700/50 shadow-soft">
          <div className="container-padding py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 gradient-primary rounded-lg flex items-center justify-center shadow-medium">
                    <span className="text-white font-bold text-sm">D</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                      DataViz Pro
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">AI Analytics Platform</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={showShortcutsHelp}
                  className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 focus-ring"
                  title="Keyboard shortcuts (Ctrl+/)"
                >
                  <Keyboard className="h-4 w-4" />
                </button>
                <ThemeToggle />
                <div className="ml-2">
                  <UserButton 
                    afterSignOutUrl="/landing"
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}