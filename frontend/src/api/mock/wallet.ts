import {DeleteAccount, GetAccount} from "@/api/requests";
import {PutAccount} from "@/api/requests/Account/PutAccount";
import {PostAccountTags} from "@/api/requests/PostAccountTags";
import {getDemoAccount, setDemoLanguage} from "@/mocks/user";

import {demoDelay, demoEmptyResponse} from "./utils";

export async function getAccount(): Promise<GetAccount.Response> {
  await demoDelay();

  return GetAccount.Schema.parse(getDemoAccount());
}

export async function postAccountTags(
  _data: PostAccountTags.Params,
): Promise<PostAccountTags.Response> {
  await demoDelay(250);

  return {
    expired: true,
    tag_limit_expires: null,
  };
}

export async function putAccount(data: PutAccount.Params) {
  await demoDelay(250);
  setDemoLanguage(data.default_lang);

  return demoEmptyResponse();
}

export async function deleteAccount(_data: DeleteAccount.BodyRequired) {
  await demoDelay();

  return demoEmptyResponse();
}
