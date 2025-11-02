"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Database, 
  BarChart3, 
  Brain, 
  FileText,
  Home,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, requiresSession: false },
  { name: "Data Management", href: "/data", icon: Database, requiresSession: false },
  { name: "Visualizations", href: "/visualize", icon: BarChart3, requiresSession: true },
  { name: "Machine Learning", href: "/ml", icon: Brain, requiresSession: true },
  { name: "Reports", href: "/reports", icon: FileText, requiresSession: false },
  { name: "Saved Sessions", href: "/sessions", icon: Database, requiresSession: false },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 shadow-strong border-r border-slate-700/50 dark:border-gray-700/50">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-slate-700/50 dark:border-gray-700/50 bg-slate-800/50">
        <div className="flex items-center gap-4 w-full">
          <div className="relative">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-fuchsia-600 flex items-center justify-center shadow-strong">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              DataViz Pro
            </div>
            <div className="text-xs text-slate-400 font-medium tracking-wide">
              AI Analytics Platform
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Main Menu
          </div>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white shadow-medium border border-blue-400/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/60 dark:text-gray-300 dark:hover:bg-gray-700/60"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl"></div>
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-200 relative z-10",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className="font-medium relative z-10">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm relative z-10"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-slate-700/50 dark:border-gray-700/50 px-3 py-4 bg-slate-800/30">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
          Settings
        </div>
        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-slate-700/80 text-white shadow-soft dark:bg-gray-700/80"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50"
                )}
              >
                <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700/30">
          <div className="text-xs text-slate-500 px-3">
            Version 2.1.0
          </div>
        </div>
      </div>
    </div>
  );
}