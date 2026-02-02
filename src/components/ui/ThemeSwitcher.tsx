import { useState, useRef, useEffect } from "react";
import { useTheme, type Theme } from "../../hooks/useTheme";

const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: "light",
    label: "Light",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
  },
  {
    value: "dark",
    label: "Dark",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
  },
  {
    value: "system",
    label: "System",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: "high-contrast",
    label: "High Contrast",
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" />
      </svg>
    ),
  },
];

interface ThemeSwitcherProps {
  variant?: "dropdown" | "compact";
  className?: string;
}

export default function ThemeSwitcher({
  variant = "dropdown",
  className = "",
}: ThemeSwitcherProps) {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-lg bg-zinc-800/50 animate-pulse ${className}`}
      />
    );
  }

  const currentTheme = themes.find((t) => t.value === theme) || themes[2];

  if (variant === "compact") {
    const cycleTheme = () => {
      const currentIndex = themes.findIndex((t) => t.value === theme);
      const nextIndex = (currentIndex + 1) % themes.length;
      setTheme(themes[nextIndex].value);
    };

    return (
      <button
        onClick={cycleTheme}
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg
          text-zinc-500 hover:text-zinc-300
          hover:bg-zinc-800/60
          transition-colors duration-200
          ${className}
        `}
        aria-label={`Current theme: ${currentTheme.label}. Click to change.`}
        title={`Theme: ${currentTheme.label}`}
      >
        {currentTheme.icon}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          text-zinc-500 hover:text-zinc-300
          hover:bg-zinc-800/60
          transition-colors duration-200
          ${isOpen ? "bg-zinc-800/60 text-zinc-300" : ""}
        `}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Theme: ${currentTheme.label}`}
      >
        {currentTheme.icon}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 py-1.5 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl shadow-black/20 z-50"
          role="listbox"
          aria-label="Select theme"
        >
          {themes.map((themeOption) => {
            const isSelected = theme === themeOption.value;
            return (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors
                  ${
                    isSelected
                      ? "text-orange-400 bg-orange-500/10"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }
                `}
                role="option"
                aria-selected={isSelected}
              >
                <span
                  className={isSelected ? "text-orange-400" : "text-zinc-500"}
                >
                  {themeOption.icon}
                </span>
                <span className="flex-1 text-left">{themeOption.label}</span>
                {isSelected && (
                  <svg
                    className="w-4 h-4 text-orange-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
