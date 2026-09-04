import {TFunction} from "i18next";

import * as mockTransactions from "@/api/mock/transactions";
import {
  GetBillDetails,
  GetBills,
  PutBillCancel,
  PutBillDetailed,
  PutBillPay,
} from "@/api/requests";

export default class BillService {
  public static async getBills(
    params?: GetBills.Params,
  ): Promise<GetBills.Response> {
    try {
      return await mockTransactions.getBills(params);
    } catch (error) {
      console.log("Failed to get bills", {error});
      throw error;
    }
  }

  public static async putBillDetailed(
    encoded_bill_id: string,
  ): Promise<PutBillDetailed.Response> {
    try {
      return await mockTransactions.putBillDetailed(encoded_bill_id);
    } catch (error) {
      console.log("Failed to get detail of bill", {error});
      throw error;
    }
  }

  public static async putBillCancel(
    encoded_bill_id: string,
  ): Promise<PutBillCancel.Response> {
    try {
      return await mockTransactions.putBillCancel(encoded_bill_id);
    } catch (error) {
      console.log("Failed to cancel bill", {error});
      throw error;
    }
  }

  public static async putBillPay(
    params: PutBillPay.Params,
    _t: TFunction,
  ): Promise<PutBillPay.Response> {
    try {
      return await mockTransactions.putBillPay(params.encoded_bill_id);
    } catch (error) {
      console.log("Failed to pay bill", {error});
      throw error;
    }
  }

  public static async getBillDetails(
    params: GetBillDetails.Params,
  ): Promise<GetBillDetails.Response> {
    try {
      return await mockTransactions.getBillDetails(params);
    } catch (error) {
      console.log("Failed to get bill details", {error});
      throw error;
    }
  }
}
