import {TFunction} from "i18next";

import * as mockPayments from "@/api/mock/payments";
import * as mockTransactions from "@/api/mock/transactions";
import {
  GetPayment,
  GetPaymentDetails,
  GetPayments,
  PostPayment,
} from "@/api/requests";

export default class PaymentService {
  public static async getPayments(
    params?: GetPayments.Params,
  ): Promise<GetPayments.Response> {
    try {
      return await mockTransactions.getPayments(params);
    } catch (error) {
      console.log("Failed to get payments", {error});
      throw error;
    }
  }

  public static async getPayment(
    _t: TFunction,
    params: GetPayment.Params,
    silent?: boolean,
  ): Promise<GetPayment.Response> {
    try {
      return await mockPayments.getPayment(params);
    } catch (error) {
      if (!silent) {
        console.log("Failed to get payment", {error});
      }
      throw error;
    }
  }

  public static async getPaymentDetails(
    params: GetPaymentDetails.Params,
  ): Promise<GetPaymentDetails.Response> {
    try {
      return await mockTransactions.getPaymentDetails(params);
    } catch (error) {
      console.log("Failed to get payment details", {error});
      throw error;
    }
  }

  public static async postPayment(params: {
    data: PostPayment.BodyRequired;
    config: PostPayment.BodyOptional;
    t: TFunction;
  }): Promise<PostPayment.Response> {
    try {
      const {t: _t, ...mockParams} = params;
      return await mockPayments.postPayment(mockParams);
    } catch (error) {
      console.log("Failed to post payment", {error});
      throw error;
    }
  }
}
