import {twJoin, twMerge} from "tailwind-merge";

type NativeButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export interface ButtonProps extends Omit<NativeButtonProps, "prefix"> {
  children: React.ReactNode;
  prefix?: React.ReactNode;
  postfix?: React.ReactNode;
  size: "lg" | "sm";
  color: "primary" | "secondary" | "white" | "transparent";
  testId: string;
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  postfix,
  prefix,
  size,
  color,
  testId,
  className,
  loading,
  ...buttonProps
}) => {
  return (
    <button
      data-testid={testId}
      {...buttonProps}
      className={twMerge(
        loading && "pointer-events-none",
        "rounded-4 transition-all duration-200 ease-linear disabled:bg-grey-200 disabled:text-grey-400 dark:disabled:bg-dark-surface dark:disabled:text-dark-text-tertiary",
        {
          lg: "w-full py-4.5",
          sm: "px-4 py-[6px]",
        }[size],
        {
          primary:
            "bg-blue-300 text-white active:bg-blue-400 dark:text-dark-bg",
          secondary:
            "bg-grey-200 text-grey-600 active:bg-grey-400 dark:bg-dark-surface dark:text-dark-text-primary",
          white:
            "bg-white text-grey-600 active:bg-grey-100 dark:bg-dark-bg dark:text-dark-text-primary",
          transparent: "bg-transparent",
        }[color],
        className,
      )}
      disabled={buttonProps.disabled || loading}>
      <div
        className={twJoin(
          (prefix || postfix) && "flex items-center justify-center",
        )}>
        {prefix && <div className="mr-2">{prefix}</div>}
        <div className="flex items-center justify-center gap-[11px] text-p1 font-p1">
          {children}
        </div>

        {postfix && <div className="ml-2">{postfix}</div>}
      </div>
    </button>
  );
};

export default Button;
