import {twJoin} from "tailwind-merge";

interface Props {
  children: React.ReactNode | React.ReactNode[];
}

const Block: React.FC<Props> = ({children}) => {
  return (
    <div
      className={twJoin(
        "flex flex-col gap-6",
        "border-b-grey-200 dark:border-b-dark-surface [&:not(:last-child)]:border-b",
        "[&:not(:last-child)]:pb-8",
        "[&:not(:first-child)]:pt-8",
      )}>
      {children}
    </div>
  );
};

export default Block;
