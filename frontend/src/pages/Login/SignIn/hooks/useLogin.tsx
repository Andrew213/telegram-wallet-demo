import AuthQueryMethods from "@api/services/AuthService/query";
import {loginRequest, loginResponse} from "@api/services/AuthService/types";
import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {ResponseError} from "@/api/types";

export const useLogin = (): UseMutationResult<
  loginResponse,
  ResponseError<{token: string; type: number}>,
  loginRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.auth(
        {
          device_id: data.device_id,
          email: data.email,
          password: data.password,
        },
        data.t,
      );
    },
  });
};
