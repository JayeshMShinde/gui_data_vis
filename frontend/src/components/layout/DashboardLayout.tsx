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
    <div className="flex h-screen bg-slate-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                DataViz Pro
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={showShortcutsHelp}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Keyboard shortcuts (Ctrl+/)"
              >
                <Keyboard className="h-4 w-4" />
              </button>
              <ThemeToggle />
              <UserButton afterSignOutUrl="/landing" />
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}