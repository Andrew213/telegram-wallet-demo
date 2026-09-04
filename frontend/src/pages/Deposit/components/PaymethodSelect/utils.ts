import {GetInputPaymethods} from "@/api/requests";
import {Option} from "@/components/SelectWallet/SelectWallet";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

export function paymethodToOption(
  method: GetInputPaymethods.Paymethod,
): Option<number> {
  return {
    ...method,
    value: method.id,
    title: method.name,
    icon: {
      icon: getGenericPaymethodIcon(method.name),
      bgColor: "grey-200 dark:bg-dark-surface",
      color: "grey-600 dark:text-dark-text-primary",
      testId: `deposit-paymethod-${method.id}-icon`,
    },
  };
}
