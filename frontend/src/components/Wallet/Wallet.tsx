import {twJoin} from "tailwind-merge";

import {RegularSuccess} from "@/assets/icons";

import Icon, {IconProps} from "../Icon/Icon";
import Img, {ImgProps} from "../Img/Img";

type Props = {
  id: string | number;
  title: string;
  testId: string;
  subtitle?: string;
  active?: "OUTLINE" | "CHECK" | false;
  onClick?: () => void;
} & (
  | {icon?: Omit<IconProps, "size">}
  | {img?: Omit<ImgProps, "size">}
  | {iconNode?: React.ReactNode}
);

const Wallet: React.FC<Props> = props => {
  const {id, title, testId, subtitle, active, onClick, ...restProps} = props;

  return (
    <div
      className={twJoin(
        "flex items-center gap-2 rounded-8 bg-white p-4 text-grey-600 dark:bg-dark-bg dark:text-dark-text-primary",
        active === "OUTLINE" &&
          "outline outline-offset-[-1px] outline-currency-RUB",
        onClick &&
          "cursor-pointer active:bg-grey-200 dark:active:bg-dark-surface",
      )}
      data-testid={`${testId}-select-wallet-option-item-${id}`}
      onClick={onClick}>
      {"icon" in restProps && restProps.icon && (
        <Icon {...restProps.icon} size="sm" />
      )}
      {"img" in restProps && restProps.img && (
        <Img
          {...restProps.img}
          size="sm"
          data-testid={`${testId}-select-wallet-${id}-image`}
        />
      )}
      {"iconNode" in restProps && restProps.iconNode}
      <div className="flex min-h-6 flex-grow flex-col justify-center gap-1">
        <div
          className="text-p1 font-p1 text-grey-600 dark:text-dark-text-primary"
          data-testid={`${testId}-select-wallet-option-${id}-title`}>
          {title}
        </div>
        {subtitle && (
          <div
            className="text-p3 font-p3 text-grey-600 dark:text-dark-text-primary"
            data-testid={`${testId}-select-wallet-option-${id}-subtitle`}>
            {subtitle}
          </div>
        )}
      </div>
      {active === "CHECK" && (
        <div
          className="h-6 w-6 text-green-300"
          data-testid={`${testId}-select-wallet-option-${id}-success-icon`}>
          <RegularSuccess />
        </div>
      )}
    </div>
  );
};

export default Wallet;
