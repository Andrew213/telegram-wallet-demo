import {useMutation, UseMutationResult} from "@tanstack/react-query";
import {TFunction} from "i18next";

import AuthQueryMethods from "@/api/services/AuthService/query";
import {
  auth2faRequest,
  auth2faResponse,
  loginWithCodeRequest,
  loginWithCodeResponse,
  signupWithCodeRequest,
  signupWithCodeResponse,
} from "@/api/services/AuthService/types";
import {Response, ResponseError} from "@/api/types";

export const useSendCode = (): UseMutationResult<
  signupWithCodeResponse,
  ResponseError<number>,
  signupWithCodeRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.sendSignupCode(
        {
          code: data.code,
          guid: data.guid,
        },
        data.t,
      );
    },

    gcTime: 0,
  });
};

export const useRetrySendCode = (): UseMutationResult<
  Response,
  ResponseError,
  string,
  void
> => {
  return useMutation({
    mutationFn: (guid: string) => {
      return AuthQueryMethods.retrySignupCode(guid);
    },
    gcTime: 0,
  });
};

export const useLoginWithCode = (): UseMutationResult<
  loginWithCodeResponse,
  ResponseError<number>,
  loginWithCodeRequest & {t: TFunction},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.sendLoginCode(
        {
          code: data.code,
          device_id: data.device_id,
          email: data.email,
          guid: data.guid,
          password: data.password,
        },
        data.t,
      );
    },
    gcTime: 0,
  });
};

export const useRetryLoginCode = (): UseMutationResult<
  Response,
  ResponseError,
  {guid: string; noticeGuid: string},
  void
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.retryLoginCode(data.guid, data.noticeGuid);
    },
    gcTime: 0,
  });
};

export const use2faAuth = (): UseMutationResult<
  auth2faResponse,
  ResponseError<number>,
  auth2faRequest & {t: TFunction}
> => {
  return useMutation({
    mutationFn: data => {
      return AuthQueryMethods.auth2fa(
        {
          device_id: data.device_id,
          email: data.email,
          gcode: data.gcode,
          guid: data.guid,
          password: data.password,
        },
        data.t,
      );
    },
    gcTime: 0,
  });
};
