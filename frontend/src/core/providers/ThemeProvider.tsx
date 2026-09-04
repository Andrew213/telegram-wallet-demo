import {useCallback, useEffect, useMemo, useState} from "react";

import {LS_THEME} from "@/constants";

import {Theme, ThemeContext, ThemeSetterContext} from "../context/useTheme";

const ThemeProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);

  const getSystemTheme = useCallback(() => {
    const telegramTheme = Telegram?.WebApp?.colorScheme;
    if (telegramTheme) return telegramTheme;

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return "light";
  }, []);

  const applyTheme = useCallback(
    (mode: Theme) => {
      const actualTheme = mode === "system" ? getSystemTheme() : mode;

      setIsDark(actualTheme === "dark");
      document.documentElement.classList.toggle("dark", actualTheme === "dark");
      localStorage.setItem(LS_THEME, mode);
      setTheme(mode);
    },
    [getSystemTheme],
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem(LS_THEME) || "system";
    applyTheme(savedTheme as Theme);
  }, [applyTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const telegramWebApp = Telegram?.WebApp;

    const handleSystemChange = () => {
      if (theme === "system") applyTheme("system");
    };

    if (telegramWebApp) {
      telegramWebApp.onEvent("themeChanged", handleSystemChange);
    } else {
      mediaQuery.addEventListener("change", handleSystemChange);
    }

    return () => {
      if (telegramWebApp) {
        telegramWebApp.offEvent("themeChanged", handleSystemChange);
      } else {
        mediaQuery.removeEventListener("change", handleSystemChange);
      }
    };
  }, [theme, applyTheme]);

  const changeTheme = (theme: Theme) => {
    applyTheme(theme);
  };
  const value = useMemo(
    () => ({
      theme,
      isDark,
    }),
    [isDark, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeSetterContext.Provider value={changeTheme}>
        {children}
      </ThemeSetterContext.Provider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
