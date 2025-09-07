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
  Settings,
  HelpCircle
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
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 dark:from-gray-900 dark:to-gray-800 shadow-xl">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-slate-700 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">DataViz Pro</span>
            <div className="text-xs text-violet-300">AI Analytics</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "" : "group-hover:scale-110"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-slate-700 dark:border-gray-700 px-4 py-4 space-y-1">
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
                  ? "bg-slate-700 text-white dark:bg-gray-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}