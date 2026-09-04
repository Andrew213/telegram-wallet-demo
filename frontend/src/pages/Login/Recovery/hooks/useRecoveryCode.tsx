import AuthQueryMethods from "@api/services/AuthService/query";
import {
  recoveryCodeRequest,
  recoveryCodeResponse,
} from "@api/services/AuthService/types";
import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {ResponseError} from "@/api/types";

export const useRecoveryCode = (): UseMutationResult<
  recoveryCodeResponse,
  ResponseError,
  recoveryCodeRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.recoveryCode(
        {
          email: data.email,
        },
        data.t,
      );
    },
  });
};
