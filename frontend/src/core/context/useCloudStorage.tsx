import {createContext, useContext} from "react";

type CloudStorageContextType = React.Dispatch<React.SetStateAction<string>>;

export const CloudStorageContext = createContext<string | null>(null);
export const CloudStorageSetterContext =
  createContext<CloudStorageContextType | null>(null);

export function useCloudStorage(): [string, CloudStorageContextType] {
  const context = useContext(CloudStorageContext);
  const setterContext = useContext(CloudStorageSetterContext);
  if (context === null || setterContext === null) {
    throw new Error("useAuth должен использоваться с AuthProvider");
  }
  return [context, setterContext];
}
