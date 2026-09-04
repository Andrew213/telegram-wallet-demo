import {useRef} from "react";

export function useActual<T>(value: T) {
  const valueRef = useRef(value);
  valueRef.current = value;
  return valueRef as {readonly current: T};
}
