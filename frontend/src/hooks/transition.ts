import {useCallback, useEffect, useState} from "react";
import {twMerge} from "tailwind-merge";

import {useActual} from "@/hooks";

type TState = "BEFORE_OPENING" | "OPENING" | "IDLE" | "CLOSING";
export type TTransitionClasses = Record<TState, string>;

interface Props {
  openingMs: number;
  closingMs: number;
  close: () => void;
  classes: TTransitionClasses[];
}

export function useTransition(props: Props) {
  const actualCloseFromProps = useActual(props.close);

  const [state, setState] = useState<TState>("BEFORE_OPENING");

  const close = useCallback(() => {
    setState("CLOSING");
    setTimeout(() => actualCloseFromProps.current(), props.closingMs);
  }, []);

  useEffect(() => {
    setState("OPENING");
    setTimeout(() => setState("IDLE"), props.openingMs);
  }, []);

  return {
    containerStyle: {
      "--opening-duration": `${props.openingMs}ms`,
      "--closing-duration": `${props.closingMs}ms`,
    } as React.CSSProperties,
    classes: props.classes.map(
      c =>
        ({
          BEFORE_OPENING: twMerge(
            "transition-all duration-[--opening-duration]",
            c.BEFORE_OPENING,
          ),
          OPENING: twMerge(
            "transition-all duration-[--opening-duration]",
            c.OPENING,
          ),
          IDLE: twMerge(
            "transition-transform duration-[--closing-duration]",
            c.IDLE,
          ),
          CLOSING: twMerge(
            "transition-all duration-[--closing-duration]",
            c.CLOSING,
          ),
        })[state],
    ),
    close,
  };
}
