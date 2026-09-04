import {createPortal} from "react-dom";
import {twMerge} from "tailwind-merge";

import {RegularCross} from "@/assets/icons";
import {type TTransitionClasses, useFixPage, useTransition} from "@/hooks";

interface Props {
  children: (close: () => void) => React.ReactNode;
  title: string;
  close: () => void;
}

const overlayClasses: TTransitionClasses = {
  BEFORE_OPENING: "ease-out opacity-0",
  OPENING: "ease-out opacity-70",
  IDLE: "ease-in opacity-70",
  CLOSING: "ease-in opacity-0",
};
const plateClasses: TTransitionClasses = {
  BEFORE_OPENING: "ease-out translate-y-full",
  OPENING: "ease-out",
  IDLE: "ease-in",
  CLOSING: "ease-in translate-y-full",
};

const BottomPlate: React.FC<Props> = props => {
  useFixPage();
  const {
    close,
    containerStyle,
    classes: [overlayClassName, plateClassName],
  } = useTransition({
    openingMs: 300,
    closingMs: 200,
    close: props.close,
    classes: [overlayClasses, plateClasses],
  });

  return createPortal(
    <div
      className="fixed left-0 right-0 top-0 z-40 h-tg-viewport-height"
      style={containerStyle}>
      <div
        className={twMerge(
          "absolute left-0 right-0 top-0 h-tg-viewport-height bg-black dark:bg-dark-underlay",
          overlayClassName,
        )}
        onClick={close}
      />
      <div
        className={twMerge(
          "absolute bottom-0 flex max-h-[90%] w-full flex-col rounded-t-6 bg-white dark:bg-dark-bg",
          plateClassName,
        )}>
        <div className="flex gap-2 p-4">
          <div className="flex-grow align-middle text-h3 font-h3 text-grey-600 dark:text-dark-text-primary">
            {props.title}
          </div>
          <div
            className="cursor-pointer dark:text-dark-text-secondary"
            onClick={close}>
            <RegularCross />
          </div>
        </div>
        {props.children(close)}
      </div>
    </div>,
    document.body,
  );
};

export default BottomPlate;
