import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {twJoin} from "tailwind-merge";

interface Props {
  message: string;
  testId: string;
}

const SystemMessage: React.FC<Props> = ({message, testId}) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (message) {
      setVisible(true);
    }
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return createPortal(
    <div
      style={{top: "calc(min(var(--tg-viewport-height), 100vh) - 45px)"}}
      className={twJoin(
        "absolute left-[50px] right-[50px] translate-y-[-100%] whitespace-pre text-wrap break-words rounded-6 bg-modalBG bg-opacity-90 px-6 py-4 text-center text-p3 font-p3 text-white transition-opacity dark:bg-dark-text-secondary dark:text-dark-bg",
        visible ? "opacity-1 z-50" : "-z-10 opacity-0",
      )}
      data-testid={`${testId}-system-message-item`}>
      {message}
    </div>,
    document.body,
  );
};

export default SystemMessage;
