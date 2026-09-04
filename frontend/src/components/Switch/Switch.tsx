import {twJoin} from "tailwind-merge";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  testId: string;
  disabled?: boolean;
}

const Switch: React.FC<Props> = ({disabled, testId, ...rest}) => {
  return (
    <label
      data-testid={`${testId}-switch-label`}
      className="relative inline-block h-[31px] w-[51px]">
      <input
        {...rest}
        type="checkbox"
        data-testid={`${testId}-switch-input`}
        disabled={disabled}
        className="peer hidden"
      />
      <span
        data-testid={`${testId}-switch-item`}
        className={twJoin(
          "absolute inset-0 cursor-pointer rounded-6 bg-[#E6E6E6] transition-colors before:absolute before:left-[2px] before:top-[2px] before:size-[27px] before:rounded-[50%] before:bg-white before:transition-transform peer-checked:bg-blue-300 peer-checked:before:translate-x-[20px] dark:before:bg-dark-bg",
        )}
      />
    </label>
  );
};

export default Switch;
