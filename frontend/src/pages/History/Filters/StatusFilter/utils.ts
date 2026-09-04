import {
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";
import {Option} from "@/components/Select/Select";

export const statusToIconMap: Record<
  "All" | GetDeposits.StatusName | GetPayments.StatusName | GetBills.StatusName,
  Option<string>["icon"]
> = {
  All: {
    icon: "RegularLayers",
    bgColor: "grey-200 dark:bg-dark-surface",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-status-all-icon",
  },
  Waiting: {
    icon: "RegularClock",
    bgColor: "yellow-100 dark:bg-dark-yellow-bg",
    color: "yellow-300 dark:text-dark-yellow-text",
    testId: "history-filter-status-waiting-icon",
  },
  Successful: {
    icon: "RegularSuccess",
    bgColor: "green-100 dark:bg-dark-green-bg",
    color: "green-300 dark:text-dark-green-text",
    testId: "history-filter-status-successful-icon",
  },
  Rejected: {
    icon: "RegularCross",
    bgColor: "red-100 dark:bg-dark-red-bg",
    color: "red-300 dark:text-dark-red-text",
    testId: "history-filter-status-rejected-icon",
  },
  Blocked: {
    icon: "RegularLock",
    bgColor: "red-100 dark:bg-dark-red-bg",
    color: "red-300 dark:text-dark-red-text",
    testId: "history-filter-status-blocked-icon",
  },
  Refunded: {
    icon: "RegularBack",
    bgColor: "yellow-100 dark:bg-dark-yellow-bg",
    color: "yellow-300 dark:text-dark-yellow-text",
    testId: "history-filter-status-refunded-icon",
  },
  Held: {
    icon: "RegularLayers",
    bgColor: "grey-200 dark:bg-dark-surface",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-status-held-icon",
  },
  Expired: {
    icon: "RegularClock",
    bgColor: "grey-100 dark:bg-dark-underlay",
    color: "grey-500 dark:text-dark-text-secondary",
    testId: "history-filter-status-expired-icon",
  },
};

export const statementTypeToIconMap: Record<
  "All" | GetStatements.OperationClassName,
  Option<string>["icon"]
> = {
  All: {
    icon: "RegularLayers",
    bgColor: "grey-200 dark:bg-dark-surface",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-statement-all-icon",
  },
  Deposit: {
    icon: "RegularWallet",
    bgColor: "grey-100 dark:bg-dark-underlay",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-statement-deposit-icon",
  },
  Withdraw: {
    icon: "RegularSend",
    bgColor: "grey-100 dark:bg-dark-underlay",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-statement-withdraw-icon",
  },
  System: {
    icon: "RegularQuestionMark",
    bgColor: "grey-100 dark:bg-dark-underlay",
    color: "grey-600 dark:text-dark-text-primary",
    testId: "history-filter-statement-system-icon",
  },
};
