import {RegularArrowRight} from "@/assets/icons";

type Props = {
  title: string;
  testId: string;
  icon: React.ReactElement;
  onClick(): void;
  text?: string;
};

const ProfileOption: React.FC<Props> = ({
  title,
  testId,
  icon,
  onClick,
  text,
}) => {
  return (
    <button
      onClick={onClick}
      data-testid={`${testId}-option-button`}
      type="button"
      className="flex w-full items-center gap-4 py-4">
      <div
        className="rounded-4 bg-grey-200 p-2 dark:bg-dark-surface dark:text-dark-text-primary"
        data-testid={`${testId}-option-icon`}>
        {icon}
      </div>
      <div className="flex-grow">
        <p
          className="text-start text-p3 font-p3 dark:text-dark-text-primary"
          data-testid={`${testId}-option-title`}>
          {title}
        </p>
      </div>
      {text && (
        <div
          className="text-tertia text-start text-end text-p4 font-p4 text-dark-text-tertiary"
          data-testid={`${testId}-option-text`}>
          {text}
        </div>
      )}
      <RegularArrowRight
        className="ml-auto text-grey-400 dark:text-dark-text-tertiary"
        data-testid={`${testId}-option-arrow`}
      />
    </button>
  );
};

export default ProfileOption;
