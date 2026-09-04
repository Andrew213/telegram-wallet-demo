import {useEffect, useMemo, useState} from "react";

import {
  HideHeaderContext,
  HideHeaderSetterContext,
} from "../context/useHideHeader";

function useHideHeader(
  setHideHeader: React.Dispatch<React.SetStateAction<boolean>>,
  hide: boolean,
) {
  useEffect(() => {
    if (!hide) {
      return;
    }

    setHideHeader(true);
    return () => setHideHeader(false);
  }, [hide, setHideHeader]);
}

const HideHeaderProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [hideHeader, setHideHeader] = useState(false);

  return (
    <HideHeaderContext.Provider value={hideHeader}>
      <HideHeaderSetterContext.Provider
        value={useMemo(
          () => useHideHeader.bind(null, setHideHeader),
          [setHideHeader],
        )}>
        {children}
      </HideHeaderSetterContext.Provider>
    </HideHeaderContext.Provider>
  );
};

export default HideHeaderProvider;
