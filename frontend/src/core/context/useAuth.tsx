import {createContext, useContext} from "react";

type AuthSetterContextType = React.Dispatch<React.SetStateAction<boolean>>;

export const AuthContext = createContext<boolean | null>(null);
export const AuthSetterContext = createContext<AuthSetterContextType | null>(
  null,
);

export function useAuth(): [boolean, AuthSetterContextType] {
  const context = useContext(AuthContext);
  const setterContext = useContext(AuthSetterContext);
  if (context === null || setterContext === null) {
    throw new Error("useAuth должен использоваться с AuthProvider");
  }
  return [context, setterContext];
}
