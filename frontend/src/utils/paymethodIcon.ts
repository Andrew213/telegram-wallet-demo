import {IconProps} from "@/components/Icon/Icon";

export function getGenericPaymethodIcon(name: string): IconProps["icon"] {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("card")) {
    return "RegularCard";
  }

  if (normalizedName.includes("bank")) {
    return "RegularBank";
  }

  if (normalizedName.includes("crypto")) {
    return "RegularCoin";
  }

  return "RegularWallet";
}
