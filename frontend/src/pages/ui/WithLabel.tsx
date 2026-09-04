import {twJoin} from "tailwind-merge";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const WithLabel: React.FC<Props> = ({children, label, className}) => {
  return (
    <div className={twJoin("flex flex-col gap-4 px-4", className)}>
      <p className="text-p1 font-p1 text-grey-600 dark:text-dark-text-primary">
        {label}
      </p>
      {children}
    </div>
  );
};

export default WithLabel;
