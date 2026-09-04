import {createPortal} from "react-dom";
import {twMerge} from "tailwind-merge";

import {type TTransitionClasses, useFixPage, useTransition} from "@/hooks";
import useSafePaddingTop from "@/hooks/useSafePaddingTop";

import Header from "./Header";

interface Props {
  testId: string;
  close: () => void;
  bgColor?: string;
  darkBgColor?: string;
  children: (close: () => void) => React.ReactNode;
}
const overlayClasses: TTransitionClasses = {
  BEFORE_OPENING: "ease-out opacity-0",
  OPENING: "ease-out opacity-70",
  IDLE: "ease-in opacity-70",
  CLOSING: "ease-in opacity-0",
};
const plateClasses: TTransitionClasses = {
  BEFORE_OPENING: "ease-out translate-x-full",
  OPENING: "ease-out",
  IDLE: "ease-in",
  CLOSING: "ease-in translate-x-full",
};

type TSidePlate = React.FC<Props> & {
  Header: typeof Header;
};

const SidePlate: TSidePlate = props => {
  const {testId, bgColor = "grey-100", darkBgColor = "dark-underlay"} = props;
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

  const safePaddingTop = useSafePaddingTop();

  return createPortal(
    <div
      className="fixed left-0 right-0 top-0 z-30 h-tg-viewport-height"
      style={containerStyle}
      data-testid={`${testId}-side-plate-container`}>
      <div
        className={twMerge(
          "absolute top-0 h-full w-full bg-black",
          overlayClassName,
        )}
        data-testid={`${testId}-side-plate-overlay`}
      />
      <div
        className={twMerge(
          `absolute top-0 flex h-full w-full flex-col bg-${bgColor} dark:bg-${darkBgColor}`,
          plateClassName,
        )}
        style={{
          paddingTop: safePaddingTop,
        }}
        data-testid={`${testId}-side-plate`}>
        {props.children(close)}
      </div>
    </div>,
    document.body,
  );
};
SidePlate.Header = Header;

export default SidePlate;
