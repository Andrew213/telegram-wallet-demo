import {createContext, useContext} from "react";

type TimerSetterContextType = React.Dispatch<React.SetStateAction<number>>;

export const TimerContext = createContext<number | null>(null);
export const TimerSetterContext = createContext<TimerSetterContextType | null>(
  null,
);

export function useTimer(): [number, TimerSetterContextType] {
  const context = useContext(TimerContext);
  const setterContext = useContext(TimerSetterContext);
  if (context === null || setterContext === null) {
    throw new Error("useTimer должен использоваться с AuthProvider");
  }
  return [context, setterContext];
}
