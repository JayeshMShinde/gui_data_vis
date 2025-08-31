"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { 
  Settings, 
  Palette, 
  Sun, 
  Moon, 
  Monitor,
  Check
} from "lucide-react";

const colorPalettes = [
  { value: "blue", label: "Ocean Blue", colors: ["#3B82F6", "#1D4ED8", "#1E40AF"] },
  { value: "purple", label: "Royal Purple", colors: ["#8B5CF6", "#7C3AED", "#6D28D9"] },
  { value: "green", label: "Forest Green", colors: ["#10B981", "#059669", "#047857"] },
  { value: "orange", label: "Sunset Orange", colors: ["#F59E0B", "#D97706", "#B45309"] },
  { value: "red", label: "Crimson Red", colors: ["#EF4444", "#DC2626", "#B91C1C"] },
  { value: "pink", label: "Rose Pink", colors: ["#EC4899", "#DB2777", "#BE185D"] },
];

export default function SettingsPage() {
  const { theme, colorPalette, setTheme, setColorPalette } = useTheme();
  const [tempTheme, setTempTheme] = useState(theme);
  const [tempPalette, setTempPalette] = useState(colorPalette);

  // Handle system theme
  const handleThemeChange = (newTheme: any) => {
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTempTheme(systemTheme as any);
    } else {
      setTempTheme(newTheme);
    }
  };

  const handleSaveSettings = () => {
    setTheme(tempTheme);
    setColorPalette(tempPalette);
    toast.success("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    setTempTheme("light");
    setTempPalette("blue");
    setTheme("light");
    setColorPalette("blue");
    toast.success("Settings reset to default!");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Customize your application appearance and preferences
          </p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Appearance Settings */}
          <Card className="border-0 shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Theme</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Choose between light and dark mode
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      tempTheme === "light"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Light</div>
                    {tempTheme === "light" && <Check className="h-4 w-4 text-blue-500 mx-auto mt-1" />}
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      tempTheme === "dark"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Moon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">Dark</div>
                    {tempTheme === "dark" && <Check className="h-4 w-4 text-blue-500 mx-auto mt-1" />}
                  </button>
                  
                  <button
                    onClick={() => handleThemeChange("system")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      tempTheme === "system"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <Monitor className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                    <div className="text-sm font-medium text-gray-900 dark:text-white">System</div>
                    {tempTheme === "system" && <Check className="h-4 w-4 text-blue-500 mx-auto mt-1" />}
                  </button>
                </div>
              </div>

              {/* Color Palette Selection */}
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Color Palette</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Select your preferred color scheme
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPalettes.map((palette) => (
                    <button
                      key={palette.value}
                      onClick={() => setTempPalette(palette.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        tempPalette === palette.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      <div className="flex gap-1 mb-2 justify-center">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {palette.label}
                      </div>
                      {tempPalette === palette.value && (
                        <Check className="h-4 w-4 text-blue-500 mx-auto mt-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div>
                <Label className="text-base font-medium text-gray-900 dark:text-white">Preview</Label>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  See how your settings will look
                </p>
                <div className={`p-4 rounded-lg border ${
                  tempTheme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      tempPalette === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600" :
                      tempPalette === "purple" ? "bg-gradient-to-br from-purple-500 to-purple-600" :
                      tempPalette === "green" ? "bg-gradient-to-br from-green-500 to-green-600" :
                      tempPalette === "orange" ? "bg-gradient-to-br from-orange-500 to-orange-600" :
                      tempPalette === "red" ? "bg-gradient-to-br from-red-500 to-red-600" :
                      "bg-gradient-to-br from-pink-500 to-pink-600"
                    }`}>
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    <span className={`font-bold ${
                      tempTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}>
                      DataViz Pro
                    </span>
                  </div>
                  <div className={`text-sm ${
                    tempTheme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    This is how your application will look with the selected theme and color palette.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSaveSettings}
              className={`${
                tempPalette === "blue" ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" :
                tempPalette === "purple" ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700" :
                tempPalette === "green" ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" :
                tempPalette === "orange" ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700" :
                tempPalette === "red" ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" :
                "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
              } text-white border-0`}
            >
              Save Settings
            </Button>
            <Button
              onClick={handleResetSettings}
              variant="outline"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}