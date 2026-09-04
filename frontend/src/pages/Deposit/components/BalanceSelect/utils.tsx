import {TFunction} from "i18next";

import {Currency, GetAccount} from "@/api/requests";
import {Option} from "@/components/SelectWallet/SelectWallet";

export function balanceToOption(
  balance: GetAccount.Balance,
  t: TFunction,
): Option<number> {
  return {
    ...balance,
    value: balance.id,
    title:
      Currency.getRuName(balance.code, t) ||
      balance.alias ||
      `[${balance.code}]`,
    subtitle: `${balance.available} ${balance.alias || ""}`,
    icon: Currency.getIcon(balance.alias)
      ? {
          icon: Currency.getIcon(balance.alias)!,
          bgColor:
            Currency.getColor(balance.alias) ??
            "grey-400 dark:bg-dark-text-tertiary",
          color: "white dark:text-dark-bg",
          testId: `deposit-balance-${balance.id}-select-wallet-icon`,
        }
      : undefined,
    iconNode: !Currency.getIcon(balance.alias) ? (
      <div
        data-testid={`deposit-balance-${balance.id}-select-wallet-icon`}
        className="flex size-10 items-center justify-center rounded-4 bg-grey-400 text-white dark:bg-dark-text-tertiary dark:text-dark-text-primary">
        {balance.alias || balance.code}
      </div>
    ) : undefined,
  };
}
