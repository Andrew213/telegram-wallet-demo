export namespace DeleteAccount {
  export const METHOD = "POST";
  export const URL = "demo/account/delete";
  export const QUERY_KEY = "demo/account/delete";

  export type BodyRequired = {
    comment: string;
  };
}
