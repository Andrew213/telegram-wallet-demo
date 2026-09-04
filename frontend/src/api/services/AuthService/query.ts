import {TFunction} from "i18next";

import * as mockAuth from "@/api/mock/auth";
import {Response} from "@/api/types";

import {
  auth2faRequest,
  auth2faResponse,
  loginRequest,
  loginResponse,
  loginWithCodeRequest,
  loginWithCodeResponse,
  recoveryCodeRequest,
  recoveryCodeResponse,
  recoveryWithCodeRequest,
  signupRequest,
  signupResponse,
  signupWithCodeRequest,
  signupWithCodeResponse,
} from "./types";

export default class AuthQueryMethods {
  public static readonly authErrors = {
    INVALID_CREDITS: 13,
    SYSTEM_NOT_AVAILABLE: 1032,
    AUTH_2FA: 1009,
  };

  public static readonly auth = async (
    data: loginRequest,
    t: TFunction,
  ): Promise<loginResponse> => {
    return mockAuth.login(data, t);
  };

  public static readonly logout = async (): Promise<Response> => {
    return mockAuth.logout();
  };

  public static readonly signup = async (
    data: signupRequest,
    _t: TFunction,
  ): Promise<signupResponse> => {
    return mockAuth.signup(data);
  };

  public static readonly sendSignupCode = async (
    data: signupWithCodeRequest,
    t: TFunction,
  ): Promise<signupWithCodeResponse> => {
    return mockAuth.sendSignupCode(data, t);
  };

  public static readonly retrySignupCode = async (
    _guid: string,
  ): Promise<Response> => {
    return mockAuth.retrySignupCode();
  };

  public static readonly retryLoginCode = async (
    _guid: string,
    _noticeGuid: string,
  ): Promise<Response> => {
    return mockAuth.retryLoginCode();
  };

  public static readonly sendLoginCode = async (
    data: loginWithCodeRequest,
    t: TFunction,
  ): Promise<loginWithCodeResponse> => {
    return mockAuth.sendLoginCode(data, t);
  };

  public static readonly checkAuth = async (): Promise<Response> => {
    return mockAuth.checkAuth();
  };

  public static readonly checkAuthGet = async (): Promise<
    Response<boolean>
  > => {
    return mockAuth.checkAuthGet();
  };

  public static readonly recoveryCode = async (
    data: recoveryCodeRequest,
    _t: TFunction,
  ): Promise<recoveryCodeResponse> => {
    return mockAuth.recoveryCode(data);
  };

  public static readonly recoveryWithCode = async (
    data: recoveryWithCodeRequest,
    t: TFunction,
  ): Promise<Response> => {
    return mockAuth.recoveryWithCode(data, t);
  };

  public static readonly auth2fa = async (
    data: auth2faRequest,
    t: TFunction,
  ): Promise<auth2faResponse> => {
    return mockAuth.auth2fa(data, t);
  };

  public static readonly retryRecoveryWithCode = async (_data: {
    guid: string;
  }): Promise<Response> => {
    return mockAuth.retryRecoveryWithCode();
  };
}
