import {useCallback, useEffect, useState} from "react";
import {twMerge} from "tailwind-merge";

type TState = "BEFORE_OPENING" | "OPENING" | "IDLE" | "CLOSING";
export type TTransitionClasses = Record<TState, string>;

interface Props {
  openingMs: number;
  closingMs: number;
  classes: TTransitionClasses[];
  close: () => void;
}

export function useTransition(props: Props) {
  const {openingMs, closingMs, classes, close: closeFromProps} = props;

  const [state, setState] = useState<TState>("BEFORE_OPENING");

  const close = useCallback(() => {
    setState("CLOSING");
    setTimeout(closeFromProps, closingMs);
  }, [closingMs, closeFromProps]);

  useEffect(() => {
    if (state !== "BEFORE_OPENING") {
      return;
    }

    setState("OPENING");
    setTimeout(() => setState("IDLE"), openingMs);
  }, [state, openingMs]);

  return {
    containerStyle: {
      "--opening-duration": `${openingMs}ms`,
      "--closing-duration": `${closingMs}ms`,
    } as React.CSSProperties,
    classes: classes.map(
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
