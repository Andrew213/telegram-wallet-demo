import {TFunction} from "i18next";

import {
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";
import {IconProps} from "@/components/Icon/Icon";
import {formatThousands} from "@/utils";

export type Transaction =
  | ({type: "DEPOSIT"} & GetDeposits.Deposit)
  | ({type: "PAYMENT"} & GetPayments.Payment)
  | ({type: "BILL"} & GetBills.Bill)
  | ({type: "STATEMENT"} & GetStatements.Statement);

export function getTransactionIcon(
  transaction: Transaction,
): IconProps["icon"] {
  return (
    {
      DEPOSIT: "RegularWallet",
      PAYMENT: "RegularSend",
      BILL: "RegularReceipt",
      STATEMENT: "RegularFile",
    } as const
  )[transaction.type];
}

export function getTransactionTitle(transaction: Transaction, t: TFunction) {
  return {
    DEPOSIT: t("transaction_history_detail_deposit"),
    PAYMENT: t("transaction_history_detail_transfer"),
    BILL: transaction.id,
    STATEMENT: t("transaction_history_detail_statement"),
  }[transaction.type];
}

export function getTransactionAmount(transaction: Transaction) {
  switch (transaction.type) {
    case "DEPOSIT": {
      return `+${formatThousands(transaction.receive_amount)} ${transaction.receive_currency}`;
    }
    case "PAYMENT": {
      return `-${formatThousands(transaction.write_off_amount)} ${transaction.write_off_currency}`;
    }
    case "BILL": {
      return `-${formatThousands(transaction.write_off_amount)} ${transaction.write_off_currency}`;
    }
    case "STATEMENT": {
      return null;
    }
  }
}

const statusToColorMap: Record<
  GetDeposits.StatusName | GetPayments.StatusName | GetBills.StatusName,
  string
> = {
  Waiting: "yellow-300",
  Successful: "green-300",
  Rejected: "red-300",
  Blocked: "red-300",
  Refunded: "yellow-300",
  Held: "grey-600",
  Expired: "grey-500",
};

const statusToDarkColorMap: Record<
  GetDeposits.StatusName | GetPayments.StatusName | GetBills.StatusName,
  string
> = {
  Waiting: "dark-yellow-text",
  Successful: "dark-green-text",
  Rejected: "dark-red-text",
  Blocked: "dark-red-text",
  Refunded: "dark-yellow-text",
  Held: "dark-text-primary",
  Expired: "dark-text-secondary",
};

export function getTransactionStatus(transaction: Transaction, t: TFunction) {
  switch (transaction.type) {
    case "DEPOSIT": {
      return (
        <span
          className={`text-${statusToColorMap[GetDeposits.statusCodeToStatusNameMap[transaction.status]]} dark:text-${statusToDarkColorMap[GetDeposits.statusCodeToStatusNameMap[transaction.status]]}`}>
          {GetDeposits.statusCodeToStatusRuNameMap(t)[transaction.status]}
        </span>
      );
    }
    case "PAYMENT": {
      return (
        <span
          className={`text-${statusToColorMap[GetPayments.statusCodeToStatusNameMap[transaction.status]]} dark:text-${statusToDarkColorMap[GetPayments.statusCodeToStatusNameMap[transaction.status]]}`}>
          {GetPayments.statusCodeToStatusRuNameMap(t)[transaction.status]}
        </span>
      );
    }
    case "BILL": {
      return (
        <span
          className={`text-${statusToColorMap[GetBills.statusCodeToStatusNameMap[transaction.status]]} dark:text-${statusToDarkColorMap[GetBills.statusCodeToStatusNameMap[transaction.status]]}`}>
          {GetBills.statusCodeToStatusRuNameMap(t)[transaction.status]}
        </span>
      );
    }
    case "STATEMENT": {
      return null;
    }
  }
}
