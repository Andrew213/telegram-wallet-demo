import {useEffect, useRef, useState} from "react";

interface Props {
  dependencies: unknown[];
}

export function useHeight<T extends HTMLElement>({dependencies}: Props) {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) {
      setHeight(0);
      return;
    }

    const observer = new ResizeObserver(
      () => ref.current && setHeight(ref.current.scrollHeight),
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [dependencies]);

  return [ref, height] as const;
}
