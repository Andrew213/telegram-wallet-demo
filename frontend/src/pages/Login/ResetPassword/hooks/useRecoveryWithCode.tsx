import AuthQueryMethods from "@api/services/AuthService/query";
import {recoveryWithCodeRequest} from "@api/services/AuthService/types";
import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {Response, ResponseError} from "@/api/types";

export const useRecoveryWithCode = (): UseMutationResult<
  Response,
  ResponseError,
  recoveryWithCodeRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.recoveryWithCode(
        {
          code: data.code,
          guid: data.guid,
          password: data.password,
        },
        data.t,
      );
    },
  });
};
