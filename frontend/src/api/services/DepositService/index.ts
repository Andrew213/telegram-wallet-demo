import {
  GetDeposit,
  GetDepositDetails,
  GetDeposits,
  PostDeposit,
} from "@api/requests";
import {TFunction} from "i18next";

import * as mockPayments from "@/api/mock/payments";
import * as mockTransactions from "@/api/mock/transactions";

export default class DepositService {
  public static async getDeposits(
    params?: GetDeposits.Params,
  ): Promise<GetDeposits.Response> {
    try {
      return await mockTransactions.getDeposits(params);
    } catch (error) {
      console.log("Failed to get deposits", {error});
      throw error;
    }
  }

  public static async getDeposit(
    _t: TFunction,
    params?: GetDeposit.Params,
    silent?: boolean,
  ): Promise<GetDeposit.Response> {
    try {
      if (!params) {
        throw new Error("Demo deposit params are missing");
      }

      return await mockPayments.getDeposit(params);
    } catch (error) {
      if (!silent) {
        console.log("Failed to get deposit", {error});
      }
      throw error;
    }
  }

  public static async getDepositDetails(
    params: GetDepositDetails.Params,
  ): Promise<GetDepositDetails.Response> {
    try {
      return await mockTransactions.getDepositDetails(params);
    } catch (error) {
      console.log("Failed to get deposit details", {error});
      throw error;
    }
  }

  public static async postDeposit(params: {
    data: PostDeposit.BodyRequired;
    config: PostDeposit.BodyOptional;
  }): Promise<PostDeposit.Response> {
    try {
      return await mockPayments.postDeposit(params);
    } catch (error) {
      console.log("Failed to post deposit", {error});
      throw error;
    }
  }
}
