"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type ColorPalette = "blue" | "purple" | "green" | "orange" | "red" | "pink";

interface ThemeContextType {
  theme: Theme;
  colorPalette: ColorPalette;
  setTheme: (theme: Theme) => void;
  setColorPalette: (palette: ColorPalette) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [colorPalette, setColorPalette] = useState<ColorPalette>("blue");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedPalette = localStorage.getItem("colorPalette") as ColorPalette;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedPalette) setColorPalette(savedPalette);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("colorPalette", colorPalette);
    document.documentElement.setAttribute("data-color-palette", colorPalette);
  }, [colorPalette]);

  return (
    <ThemeContext.Provider value={{ theme, colorPalette, setTheme, setColorPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}