import {useEffect, useState} from "react";

import Spiner from "@/components/Spiner/Spiner";
import {LS_TOKEN_KEY} from "@/constants";
import {
  CloudStorageContext,
  CloudStorageSetterContext,
} from "@/core/context/useCloudStorage";
import {getCloudStorage} from "@/utils/cloudStorage";

const CloudStorageProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isTokenInStorage, setIsTokenInStorage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        try {
          const storedValue = await getCloudStorage(LS_TOKEN_KEY);
          if (storedValue) {
            setIsTokenInStorage(storedValue);
          }
        } catch (err) {
          console.error(err);
          setIsTokenInStorage("");
        }
      } catch (err) {
        setIsTokenInStorage("");
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-tg-viewport-height items-center justify-center dark:bg-dark-bg">
        <Spiner />
      </div>
    );
  }

  return (
    <CloudStorageContext.Provider value={isTokenInStorage}>
      <CloudStorageSetterContext.Provider value={setIsTokenInStorage}>
        {children}
      </CloudStorageSetterContext.Provider>
    </CloudStorageContext.Provider>
  );
};

export default CloudStorageProvider;
