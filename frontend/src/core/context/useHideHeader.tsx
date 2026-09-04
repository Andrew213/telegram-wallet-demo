import {createContext, useContext} from "react";

type HideHeaderSetterContextType = (hide: boolean) => void;

export const HideHeaderContext = createContext<boolean | null>(null);
export const HideHeaderSetterContext =
  createContext<HideHeaderSetterContextType | null>(null);

export function useHideHeaderContext(): [boolean, HideHeaderSetterContextType] {
  const context = useContext(HideHeaderContext);
  const setterContext = useContext(HideHeaderSetterContext);
  if (context === null || setterContext === null) {
    throw new Error("useHideHeader должен использоваться с HideHeaderProvider");
  }
  return [context, setterContext];
}
