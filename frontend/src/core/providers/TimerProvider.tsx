import {useEffect, useState} from "react";

import {SS_TIMER_KEY} from "@/constants";

import {TimerContext, TimerSetterContext} from "../context/useTimer";

const TimerProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const savedTimer = sessionStorage.getItem(SS_TIMER_KEY) ?? 0;
  const [timer, setTimer] = useState(Number(savedTimer));

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer <= 0) {
        sessionStorage.removeItem(SS_TIMER_KEY);
      } else {
        const delta = timer - 1;
        setTimer(delta);
        sessionStorage.setItem(SS_TIMER_KEY, delta.toString());
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  return (
    <TimerContext.Provider value={timer}>
      <TimerSetterContext.Provider value={setTimer}>
        {children}
      </TimerSetterContext.Provider>
    </TimerContext.Provider>
  );
};

export default TimerProvider;
