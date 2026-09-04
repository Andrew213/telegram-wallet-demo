import "./index.css";

import {twMerge} from "tailwind-merge";
interface Props {
  inputProps: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  testId: string;
  error?: string | null;
  className?: string | null;
  size?: "lg" | "sm";
  radio?: boolean;
}

const Checkbox: React.FC<Props> = ({
  inputProps,
  testId,
  className,
  size,
  radio,
}) => {
  return (
    <div className="flex items-center justify-center py-0.5">
      <input
        type="checkbox"
        data-testid={testId}
        className={twMerge(
          "bg darkBg",
          "border-[1.5px] border-grey-400 bg-grey-100 before:absolute before:left-[50%] before:top-[50%] before:block before:translate-x-[-50%] before:translate-y-[-50%] checked:border-none checked:bg-blue-300 checked:before:bg-cover checked:before:bg-center checked:before:bg-no-repeat dark:border-dark-text-tertiary dark:bg-dark-bg dark:checked:bg-blue-300",
          size &&
            {
              lg: "size-6 before:size-5",
              sm: "size-4 before:size-3",
            }[size],
          // TODO: сделать радио кнопку при необходимости
          !radio && size === "sm" && "rounded",
          !radio && size === "lg" && "rounded-[6px]",
          radio &&
            "checked: rounded-full bg-blue-300 before:text-white dark:bg-blue-300 dark:before:text-dark-bg",
          className,
        )}
        {...inputProps}
      />
    </div>
  );
};

export default Checkbox;
