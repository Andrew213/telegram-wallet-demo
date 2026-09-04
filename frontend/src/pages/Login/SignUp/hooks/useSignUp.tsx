import AuthQueryMethods from "@api/services/AuthService/query";
import {signupRequest, signupResponse} from "@api/services/AuthService/types";
import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import {ResponseError} from "@/api/types";

const useSignUp = (): UseMutationResult<
  signupResponse,
  ResponseError,
  signupRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.signup(
        {agreement: data.agreement, email: data.email, password: data.password},
        data.t,
      );
    },
    gcTime: 0,
  });
};

export default useSignUp;
