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
      <div className="flex h-16 items-center px-6 border-b border-slate-700 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">DataViz Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Secondary Navigation */}
      <div className="border-t border-slate-700 dark:border-gray-700 px-4 py-4 space-y-2">
        {secondaryNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                isActive
                  ? "bg-slate-700 text-white dark:bg-gray-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}