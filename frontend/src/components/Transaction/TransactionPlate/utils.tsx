import {TFunction} from "i18next";

import {
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";
import {DEFAULT_LANGUAGE} from "@/constants";
import {Falsy, formateDate, formatThousands} from "@/utils";

import {Transaction} from "../utils";
import {TransactionDetails} from "./useFetchTransactionDetails";

export type Field = {
  isId?: boolean;
  canBeCopied?: boolean;
  label: string;
  value: string;
};

export function getPlateHeader(transaction: Transaction, t: TFunction) {
  return {
    DEPOSIT: t`transaction_history_detail_deposit`,
    PAYMENT: t`transaction_history_detail_transfer`,
    BILL: t`transaction_history_detail_bill`,
    STATEMENT: t`transaction_history_detail_statement`,
  }[transaction.type];
}

export function getAmountTitle(transaction: Transaction): string {
  switch (transaction.type) {
    case "DEPOSIT": {
      return `${formatThousands(transaction.receive_amount, {decimals: true})} ${transaction.receive_currency}`;
    }
    case "PAYMENT": {
      return `${formatThousands(transaction.write_off_amount, {decimals: true})} ${transaction.write_off_currency}`;
    }
    case "BILL": {
      return `${formatThousands(transaction.receive_amount, {decimals: true})} ${transaction.receive_currency}`;
    }
    case "STATEMENT": {
      return `${formatThousands(transaction.amount, {decimals: true})} ${transaction.currency}`;
    }
  }
}

export function getTransactionAmountTitle(
  transaction: Transaction,
  t: TFunction,
): string {
  switch (transaction.type) {
    case "DEPOSIT": {
      return t`transaction_history_detail_field_deposit_amount`;
    }
    case "PAYMENT": {
      return t`transaction_history_detail_field_transfer_amount`;
    }
    case "BILL": {
      return t`transaction_history_detail_field_bill_amount`;
    }
    case "STATEMENT": {
      return t`transaction_history_detail_field_transfer_amount`;
    }
  }
}

export function getFields(
  transaction: TransactionDetails,
  locale: string,
  t: TFunction,
): (Field | Falsy)[] {
  switch (transaction.type) {
    case "DEPOSIT": {
      return [
        {
          label: t`transaction_history_detail_field_status`,
          value: GetDeposits.statusCodeToStatusRuNameMap(t)[transaction.status],
        },
        {
          label: t`transaction_history_detail_field_deposit_amount`,
          value: `${formatThousands(transaction.receive_amount, {decimals: true})} ${transaction.receive_currency.alias}`,
        },
        {
          label: t`transaction_history_detail_field_transfer_amount`,
          value: `${formatThousands(transaction.write_off_amount, {decimals: true})} ${transaction.write_off_currency.alias}`,
        },
        transaction.status ===
          GetDeposits.statusNameToStatusCodeMap.Successful &&
          transaction.account && {
            isId: true,
            canBeCopied: true,
            label: t`transaction_history_detail_field_sender`,
            value: transaction.account,
          },
        {
          isId: true,
          canBeCopied: true,
          label: t`transaction_history_detail_field_id_transaction`,
          value: String(transaction.id),
        },
        transaction.additional_data?.bank && {
          label: t`payment_method_title`,
          value: String(transaction.additional_data.bank),
        },
        transaction.config?.bank && {
          label: t`transaction_history_detail_field_bank`,
          value: String(transaction.config.bank),
        },
        transaction.additional_data?.requisites && {
          label: t`transaction_history_detail_field_requisites`,
          value: String(transaction.additional_data.requisites),
        },
        {
          label: t`transaction_history_detail_field_creation_date`,
          value: formateDate(transaction.created, locale, {time: true}),
        },
        transaction.processed !== null && {
          label: t`transaction_history_detail_field_completion_date`,
          value: formateDate(transaction.processed, locale, {
            time: true,
          }),
        },
        transaction.config &&
          transaction.config.email && {
            canBeCopied: true,
            label: t`email_placeholder`,
            value: String(transaction.config.email),
          },
      ];
    }
    case "PAYMENT": {
      return [
        {
          label: t`transaction_history_detail_field_status`,
          value: GetPayments.statusCodeToStatusRuNameMap(t)[transaction.status],
        },
        transaction.rejected_reason && {
          label: t`transaction_history_detail_field_reason_for_cancellation`,
          value: ((text: string) =>
            text.length > 230 ? `${text.slice(0, 230)}...` : text)(
            transaction.rejected_reason[locale] ||
              transaction.rejected_reason[DEFAULT_LANGUAGE],
          ),
        },
        {
          label: t`write_off_amount_title`,
          value: `${formatThousands(transaction.write_off_amount, {decimals: true})} ${transaction.write_off_currency.alias}`,
        },
        {
          label: t`transaction_history_detail_field_credit_amount`,
          value: `${formatThousands(transaction.receive_amount, {decimals: true})} ${transaction.receive_currency.alias}`,
        },
        {
          isId: true,
          canBeCopied: true,
          label: t`transaction_history_detail_field_id_transaction`,
          value: String(transaction.id),
        },
        {
          label: t`transaction_history_detail_field_creation_date`,
          value: formateDate(transaction.created, locale, {time: true}),
        },
        transaction.processed !== null && {
          label: t`transaction_history_detail_field_completion_date`,
          value: formateDate(transaction.processed, locale, {time: true}),
        },
        transaction.config &&
          transaction.config.email && {
            canBeCopied: true,
            label: t`email_placeholder`,
            value: String(transaction.config.email),
          },
      ];
    }
    case "BILL": {
      return [
        {
          label: t`transaction_history_detail_field_status`,
          value: GetBills.statusCodeToStatusRuNameMap(t)[transaction.status],
        },
        {
          isId: true,
          canBeCopied: true,
          label: t`transaction_history_detail_field_shop`,
          value: String(transaction.shop.id),
        },
        {
          label: t`transaction_history_detail_field_for_the_amount`,
          value: `${formatThousands(transaction.write_off_amount, {decimals: true})} ${transaction.write_off_currency.alias}`,
        },
        {
          label: t`transaction_history_detail_field_bill_amount`,
          value: `${formatThousands(transaction.receive_amount, {decimals: true})} ${transaction.receive_currency.alias}`,
        },
        {
          isId: true,
          canBeCopied: true,
          label: t`history_bill_tab_filters_bill_id_field_title`,
          value: String(transaction.id),
        },
        transaction.shop_order_id && {
          isId: true,
          canBeCopied: true,
          label: t`transaction_history_detail_field_transaction_number`,
          value: transaction.shop_order_id,
        },
        {
          label: t`transaction_history_detail_field_creation_date`,
          value: formateDate(transaction.created, locale, {time: true}),
        },
        transaction.expired !== null && {
          label: t`transaction_history_detail_field_valid_until`,
          value: formateDate(transaction.expired, locale, {time: true}),
        },
        transaction.processed !== null && {
          label: t`transaction_history_detail_field_completion_date`,
          value: formateDate(transaction.processed, locale, {time: true}),
        },
      ];
    }
    case "STATEMENT": {
      return [
        {
          label:
            transaction.operation_class ===
            GetStatements.operationClassNameToOperationClassCodeMap.Deposit
              ? t`transaction_history_detail_field_credited`
              : t`transaction_history_detail_field_written_off`,
          value: `${formatThousands(transaction.amount, {decimals: true})} ${transaction.currency.alias}`,
        },
        {
          label: t`transaction_history_detail_field_balance`,
          value: `${formatThousands(transaction.balance_amount, {decimals: true})} ${transaction.currency.alias}`,
        },
        {
          isId: true,
          canBeCopied: true,
          label: t`history_payment_tab_filters_payment_id_field_title`,
          value: String(transaction.id),
        },
        {
          label: t`transaction_history_detail_field_creation_date`,
          value: formateDate(transaction.created, locale, {time: true}),
        },
      ];
    }
  }
}
