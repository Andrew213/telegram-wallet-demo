import React from "react";

type Props = {
  title: string;
  testId: string;
  leadIcon: React.ReactElement;
  sideIcon: React.ReactElement | undefined;
  onClick(): void;
};

const ThemeOption: React.FC<Props> = ({
  title,
  testId,
  leadIcon,
  sideIcon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      data-testid={testId}
      className="flex w-full items-center gap-4 py-4">
      <div className="rounded-4 bg-grey-200 p-2 dark:bg-dark-surface dark:text-dark-text-primary">
        {leadIcon}
      </div>
      <div className="text-start">
        <p className="text-p3 font-p3 dark:text-dark-text-primary">{title}</p>
      </div>
      {sideIcon &&
        React.cloneElement(sideIcon, {
          "data-testid": "theme-option-selected-icon",
          className: "ml-auto text-green-200",
        })}
    </button>
  );
};

export default ThemeOption;
