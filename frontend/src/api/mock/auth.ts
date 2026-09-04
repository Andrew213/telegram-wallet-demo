import {TFunction} from "i18next";

import {Response} from "@/api/types";
import {LS_TOKEN_KEY} from "@/constants";
import {
  DEMO_ACCESS_TOKEN,
  DEMO_CODE_TOKEN,
  DEMO_EMAIL,
  DEMO_NOTIFICATION_TOKEN,
  DEMO_OTP,
  DEMO_PASSWORD,
  DEMO_REFRESH_TOKEN,
} from "@/mocks/user";
import {getCloudStorage} from "@/utils/cloudStorage";

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
} from "../services/AuthService/types";
import {
  createDemoError,
  demoDelay,
  demoEmptyResponse,
  demoResponse,
} from "./utils";

function ensureDemoOtp(code: string, t: TFunction) {
  if (code !== DEMO_OTP) {
    throw createDemoError<number>(
      t("initialization_errors.code_is_invalid"),
      1020,
      2,
    );
  }
}

export async function login(
  data: loginRequest,
  t: TFunction,
): Promise<loginResponse> {
  await demoDelay();

  if (
    data.email.trim().toLowerCase() !== DEMO_EMAIL ||
    data.password !== DEMO_PASSWORD
  ) {
    throw createDemoError(t("invalid_email_or_password"), 13);
  }

  return demoResponse({
    code_token: DEMO_CODE_TOKEN,
    notification_token: DEMO_NOTIFICATION_TOKEN,
  });
}

export async function logout(): Promise<Response> {
  await demoDelay(250);

  return demoEmptyResponse();
}

export async function signup(_data: signupRequest): Promise<signupResponse> {
  await demoDelay();

  return demoResponse(DEMO_CODE_TOKEN);
}

export async function sendSignupCode(
  data: signupWithCodeRequest,
  t: TFunction,
): Promise<signupWithCodeResponse> {
  await demoDelay();
  ensureDemoOtp(data.code, t);

  return {
    data: null,
    error_code: 0,
    message: "OK",
    result: true,
  };
}

export async function retrySignupCode(): Promise<Response> {
  await demoDelay(250);

  return demoEmptyResponse();
}

export async function retryLoginCode(): Promise<Response> {
  await demoDelay(250);

  return demoEmptyResponse();
}

export async function sendLoginCode(
  data: loginWithCodeRequest,
  t: TFunction,
): Promise<loginWithCodeResponse> {
  await demoDelay();
  ensureDemoOtp(data.code, t);

  return demoResponse({
    refresh_token: DEMO_REFRESH_TOKEN,
    token: DEMO_ACCESS_TOKEN,
  });
}

export async function checkAuth(): Promise<Response> {
  await demoDelay(150);

  return demoEmptyResponse();
}

export async function checkAuthGet(): Promise<Response<boolean>> {
  await demoDelay(150);
  const token = await getCloudStorage(LS_TOKEN_KEY);

  return demoResponse(Boolean(token));
}

export async function recoveryCode(
  _data: recoveryCodeRequest,
): Promise<recoveryCodeResponse> {
  await demoDelay();

  return demoResponse({code: DEMO_CODE_TOKEN});
}

export async function recoveryWithCode(
  data: recoveryWithCodeRequest,
  t: TFunction,
): Promise<Response> {
  await demoDelay();
  ensureDemoOtp(data.code, t);

  return demoEmptyResponse();
}

export async function auth2fa(
  data: auth2faRequest,
  t: TFunction,
): Promise<auth2faResponse> {
  await demoDelay();
  ensureDemoOtp(data.gcode, t);

  return demoResponse({
    refresh_token: DEMO_REFRESH_TOKEN,
    token: DEMO_ACCESS_TOKEN,
  });
}

export async function retryRecoveryWithCode(): Promise<Response> {
  await demoDelay(250);

  return demoEmptyResponse();
}
