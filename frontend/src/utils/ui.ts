import {ResponseError} from "@/api/types";
import i18n from "@/i18";

import {Falsy} from "./typescript";

export function userError(error?: Error | ResponseError | Falsy) {
  if (error && isResponseError(error)) {
    return error.message;
  }

  return i18n.t("failed_screen_title");
}

function isResponseError(error: Error | ResponseError): error is ResponseError {
  return "code" in error || "error_code" in error;
}
