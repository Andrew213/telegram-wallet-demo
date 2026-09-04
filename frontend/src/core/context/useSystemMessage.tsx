import {createContext, useContext} from "react";

type SetterProps = React.Dispatch<React.SetStateAction<string>>;

export const SystemMessageContext = createContext<string | null>(null);
export const SystemMessageSetterContext = createContext<SetterProps | null>(
  null,
);

export const useSystemMessage = (): [string, SetterProps] => {
  const context = useContext(SystemMessageContext);
  const setterContext = useContext(SystemMessageSetterContext);

  if (context === null || setterContext === null) {
    throw new Error(
      "useSystemMessage должен использоваться с SystemMessageProvider",
    );
  }
  return [context, setterContext];
};
