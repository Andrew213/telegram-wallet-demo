import {
  Currency,
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";

export type FilterCommon = {
  date?: [Date, Date];
  id: number;
};
export type FilterDeposit = FilterCommon & {
  type: "DEPOSIT";
  status: GetDeposits.StatusName | "All";
  source_currency: Currency.Code | "All";
  target_currency: Currency.Code | "All";
  shop_order_id: number;
};
export type FilterPayment = FilterCommon & {
  type: "PAYMENT";
  status: GetPayments.StatusName | "All";
  source_currency: Currency.Code | "All";
  target_currency: Currency.Code | "All";
};
export type FilterBill = FilterCommon & {
  type: "BILL";
  status: GetBills.StatusName | "All";
  source_currency: Currency.Code | "All";
  target_currency: Currency.Code | "All";
  shop_order_id: number;
};
export type FilterStatement = FilterCommon & {
  type: "STATEMENT";
  statementType: GetStatements.OperationClassName | "All";
  currency: Currency.Code | "All";
};
export type Filter =
  | FilterDeposit
  | FilterPayment
  | FilterBill
  | FilterStatement;
const initialFilterDeposit: FilterDeposit = {
  type: "DEPOSIT",
  status: "All",
  source_currency: "All",
  target_currency: "All",
  id: 0,
  shop_order_id: 0,
};
const initialFilterPayment: FilterPayment = {
  type: "PAYMENT",
  status: "All",
  source_currency: "All",
  target_currency: "All",
  id: 0,
};
const initialFilterBill: FilterBill = {
  type: "BILL",
  status: "All",
  source_currency: "All",
  target_currency: "All",
  id: 0,
  shop_order_id: 0,
};
const initialFilterStatement: FilterStatement = {
  type: "STATEMENT",
  statementType: "All",
  currency: "All",
  id: 0,
};
export const initialFilter = {
  DEPOSIT: initialFilterDeposit,
  PAYMENT: initialFilterPayment,
  BILL: initialFilterBill,
  STATEMENT: initialFilterStatement,
};

export const transactionTypes = [
  "DEPOSIT",
  "PAYMENT",
  "BILL",
  "STATEMENT",
] as const;

export type TransactionType = (typeof transactionTypes)[number];

export function getFilterCount(filter: Filter) {
  return Object.keys(filter).filter(
    key =>
      filter[key as keyof typeof filter] !==
      initialFilter[filter.type][key as keyof typeof filter],
  ).length;
}
