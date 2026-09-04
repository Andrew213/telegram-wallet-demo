import {
  GetBillDetails,
  GetBills,
  GetDepositDetails,
  GetDeposits,
  GetPaymentDetails,
  GetPayments,
  GetStatementDetails,
  GetStatements,
  PutBillCancel,
  PutBillDetailed,
  PutBillPay,
} from "@/api/requests";
import {
  cancelDemoBill,
  getDemoBillDetailed,
  getDemoBillDetails,
  getDemoBills,
  getDemoDepositDetails,
  getDemoDeposits,
  getDemoPaymentDetails,
  getDemoPayments,
  getDemoStatementDetails,
  getDemoStatements,
  payDemoBill,
} from "@/mocks/transactions";

import {demoDelay} from "./utils";

export async function getDeposits(
  params?: GetDeposits.Params,
): Promise<GetDeposits.Response> {
  await demoDelay();

  return GetDeposits.Schema.parse(getDemoDeposits(params));
}

export async function getDepositDetails(
  params: GetDepositDetails.Params,
): Promise<GetDepositDetails.Response> {
  await demoDelay();

  return GetDepositDetails.Schema.parse(getDemoDepositDetails(params));
}

export async function getPayments(
  params?: GetPayments.Params,
): Promise<GetPayments.Response> {
  await demoDelay();

  return GetPayments.Schema.parse(getDemoPayments(params));
}

export async function getPaymentDetails(
  params: GetPaymentDetails.Params,
): Promise<GetPaymentDetails.Response> {
  await demoDelay();

  return GetPaymentDetails.Schema.parse(getDemoPaymentDetails(params));
}

export async function getBills(
  params?: GetBills.Params,
): Promise<GetBills.Response> {
  await demoDelay();

  return GetBills.Schema.parse(getDemoBills(params));
}

export async function putBillDetailed(
  encodedBillId: string,
): Promise<PutBillDetailed.Response> {
  await demoDelay();

  return PutBillDetailed.Schema.parse(getDemoBillDetailed(encodedBillId));
}

export async function putBillCancel(
  encodedBillId: string,
): Promise<PutBillCancel.Response> {
  await demoDelay();

  return PutBillCancel.Schema.parse(cancelDemoBill(encodedBillId));
}

export async function putBillPay(
  encodedBillId: string,
): Promise<PutBillPay.Response> {
  await demoDelay();

  return PutBillPay.Schema.parse(payDemoBill(encodedBillId));
}

export async function getBillDetails(
  params: GetBillDetails.Params,
): Promise<GetBillDetails.Response> {
  await demoDelay();

  return GetBillDetails.Schema.parse(getDemoBillDetails(params));
}

export async function getStatements(
  params: GetStatements.Params,
): Promise<GetStatements.Response> {
  await demoDelay();

  return GetStatements.Schema.parse(getDemoStatements(params));
}

export async function getStatementDetails(
  params: GetStatementDetails.Params,
): Promise<GetStatementDetails.Response> {
  await demoDelay();

  return GetStatementDetails.Schema.parse(getDemoStatementDetails(params));
}
