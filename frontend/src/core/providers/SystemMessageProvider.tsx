import {useEffect, useState} from "react";

import SystemMessage from "@/components/SystemMessage/SystemMessage";

import {
  SystemMessageContext,
  SystemMessageSetterContext,
} from "../context/useSystemMessage";

interface Props {
  children: React.ReactNode;
}

export const SystemMessageProvider: React.FC<Props> = ({children}) => {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <SystemMessageContext.Provider value={message}>
      <SystemMessageSetterContext.Provider value={setMessage}>
        {children}
        <SystemMessage testId="system-message-item" message={message} />
      </SystemMessageSetterContext.Provider>
    </SystemMessageContext.Provider>
  );
};
