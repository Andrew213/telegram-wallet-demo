import * as mockTransactions from "@/api/mock/transactions";
import {GetStatementDetails, GetStatements} from "@/api/requests";

export default class StatementService {
  public static async getStatements(
    params: GetStatements.Params,
  ): Promise<GetStatements.Response> {
    try {
      return await mockTransactions.getStatements(params);
    } catch (error) {
      console.log("Failed to get statements", {error});
      throw error;
    }
  }

  public static async getStatementDetails(
    params: GetStatementDetails.Params,
  ): Promise<GetStatementDetails.Response> {
    try {
      return await mockTransactions.getStatementDetails(params);
    } catch (error) {
      console.log("Failed to get statement details", {error});
      throw error;
    }
  }
}
