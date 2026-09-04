import {
  GetInputPaymethods,
  GetOutputPaymethods,
  GetPaywayInfo,
} from "@api/requests";

import * as mockPayments from "@/api/mock/payments";

export {parseMask} from "./utils";

export default class PaymethodService {
  public static async getInputPaymethods(): Promise<GetInputPaymethods.Response> {
    try {
      return await mockPayments.getInputPaymethods();
    } catch (error) {
      console.log("Failed to get input paymethods", {error});
      throw error;
    }
  }

  public static async getOutputPaymethods(
    _params: GetOutputPaymethods.Params,
  ): Promise<GetOutputPaymethods.Response> {
    try {
      return await mockPayments.getOutputPaymethods();
    } catch (error) {
      console.log("Failed to get output paymethods", {error});
      throw error;
    }
  }

  public static async getPaywayInfoAndWarning(props: {
    info_id: number | null;
    warning_id: number | null;
  }): Promise<{
    info: GetPaywayInfo.Response | null;
    warning: GetPaywayInfo.Response | null;
  }> {
    try {
      return await mockPayments.getPaywayInfoAndWarning(props);
    } catch (error) {
      console.log("Failed to get payway info and warning", {error});
      throw error;
    }
  }
}
