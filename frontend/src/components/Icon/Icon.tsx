import {twJoin} from "tailwind-merge";

import * as icons from "@/assets/icons";

export interface IconProps {
  icon: keyof typeof icons;
  size: "lg" | "sm";
  bgColor: string;
  testId: string;
  color?: string;
}

const Icon: React.FC<IconProps> = props => {
  const {icon, size, bgColor, testId, color} = props;

  const Icon = icons[icon];
  const iconSize = {sm: 24, lg: 48}[size];
  const sizeTw = {sm: 10, lg: 20}[size];
  const roundedTw = {sm: 4, lg: 8}[size];

  return (
    <div
      className={twJoin(
        `bg-${bgColor} flex size-${sizeTw} items-center justify-center rounded-${roundedTw}`,
        color && `text-${color}`,
      )}
      data-testid={testId}>
      <Icon height={iconSize} width={iconSize} />
    </div>
  );
};

export default Icon;
