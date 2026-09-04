import {DeleteAccount, GetAccount} from "@api/requests";

import * as mockWallet from "@/api/mock/wallet";
import {PutAccount} from "@/api/requests/Account/PutAccount";
import {PostAccountTags} from "@/api/requests/PostAccountTags";

export default class AccountService {
  public static async getAccount(): Promise<GetAccount.Response> {
    try {
      return await mockWallet.getAccount();
    } catch (error) {
      console.log("Failed to get account", {error});
      throw error;
    }
  }

  public static async postAccountTags(
    data: PostAccountTags.Params,
  ): Promise<PostAccountTags.Response> {
    try {
      return await mockWallet.postAccountTags(data);
    } catch (error) {
      console.log("Failed to get account tags", {error});
      throw error;
    }
  }

  public static async putAccount(data: PutAccount.Params) {
    try {
      return await mockWallet.putAccount(data);
    } catch (err) {
      console.log("Failed to put account ", {err});
      throw err;
    }
  }

  public static async deleteAccount(data: DeleteAccount.BodyRequired) {
    try {
      return await mockWallet.deleteAccount(data);
    } catch (error) {
      console.log("Failed to delete account", {error});
      throw error;
    }
  }
}
