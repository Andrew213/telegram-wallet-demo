import {useEffect} from "react";

interface Props {
  testId: string;
  title?: string;
  color?: string;
  darkColor?: string;
  bgColor?: string;
  darkBgColor?: string;
  close: () => void;
}

const Header: React.FC<Props> = props => {
  const {
    testId,
    title,
    bgColor = "white",
    darkBgColor = "dark-bg",
    color = "grey-600",
    darkColor = "dark-text-primary",
    close,
  } = props;

  useEffect(() => {
    const handleBackClick = () => {
      close();
    };

    Telegram.WebApp.BackButton.onClick(handleBackClick);
    return () => {
      Telegram.WebApp.BackButton.offClick(handleBackClick);
    };
  }, [close]);

  return (
    <div
      className={`flex items-center gap-4 rounded-b-8 bg-${bgColor} dark:bg-${darkBgColor} text-${color} dark:text-${darkColor} sticky top-0 px-4 py-3`}
      data-testid={`${testId}-side-plate-header`}>
      <div
        className="flex-grow text-center text-h4 font-h4"
        data-testid={`${testId}-side-plate-header-title`}>
        {title}
      </div>
    </div>
  );
};

export default Header;
