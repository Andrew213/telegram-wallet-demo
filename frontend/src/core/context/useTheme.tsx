import {createContext, useContext} from "react";

export type Theme = "system" | "dark" | "light";

type ThemeProps = {
  theme: Theme;
  isDark: boolean;
};

type ThemeSetterProps = (theme: Theme) => void;

export const ThemeContext = createContext<ThemeProps | null>(null);
export const ThemeSetterContext = createContext<ThemeSetterProps | null>(null);

export const useTheme = (): [ThemeProps, ThemeSetterProps] => {
  const context = useContext(ThemeContext);
  const setterContext = useContext(ThemeSetterContext);

  if (context === null || setterContext === null) {
    throw new Error("useThemeContext должен использоваться с ThemeProvider");
  }
  return [context, setterContext];
};
