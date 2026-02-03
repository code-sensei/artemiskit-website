import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark" | "system" | "high-contrast";

const STORAGE_KEY = "artemiskit-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getResolvedTheme(theme: Theme): "light" | "dark" | "high-contrast" {
  if (theme === "system") {
    return getSystemTheme();
  }
  return theme;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<
    "light" | "dark" | "high-contrast"
  >("dark");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme = stored || "system";
    setThemeState(initialTheme);
    setResolvedTheme(getResolvedTheme(initialTheme));
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");

    // Add the resolved theme class
    root.classList.add(resolvedTheme);

    // Also set data-theme attribute for Starlight compatibility
    // Starlight only supports 'light' and 'dark', so map high-contrast to dark
    const starlightTheme =
      resolvedTheme === "high-contrast" ? "dark" : resolvedTheme;
    root.dataset.theme = starlightTheme;

    // Store in Starlight's localStorage key for persistence
    localStorage.setItem(
      "starlight-theme",
      resolvedTheme === "high-contrast" ? "dark" : resolvedTheme,
    );

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const colors = {
        light: "#fafaf9",
        dark: "#0c0a09",
        "high-contrast": "#000000",
      };
      metaThemeColor.setAttribute("content", colors[resolvedTheme]);
    }
  }, [resolvedTheme, mounted]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setResolvedTheme(getResolvedTheme(newTheme));
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    mounted,
  };
}
