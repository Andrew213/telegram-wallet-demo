import {GetOutputPaymethods} from "@/api/requests";
import {Option} from "@/components/SelectWallet/SelectWallet";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

export function paymethodToOption(
  paymethod: GetOutputPaymethods.Paymethod,
): Option<number> {
  return {
    ...paymethod,
    value: paymethod.id,
    title: paymethod.name,
    icon: {
      icon: getGenericPaymethodIcon(paymethod.name),
      bgColor: "grey-200 dark:bg-dark-surface",
      color: "grey-600 dark:text-dark-text-primary",
      testId: `payment-paymethod-${paymethod.id}-icon`,
    },
  };
}
