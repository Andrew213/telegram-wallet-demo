import {Response} from "@/api/types";

export interface loginRequest {
  device_id: string;
  password: string;
  email: string;
}
export type loginResponse = Response<{
  code_token: string;
  notification_token: string;
}>;
export interface signupRequest {
  agreement: boolean;
  password: string;
  email: string;
}

export type signupResponse = Response<string>;

export interface signupWithCodeRequest {
  code: string;
  guid: string;
}

export interface signupWithCodeResponse {
  data: null;
  error_code: number;
  message: string;
  result: boolean;
}
export interface loginWithCodeRequest {
  guid: string;
  code: string;
  device_id: string;
  email: string;
  password: string;
}

type loginWithCodeResponse0 = Response<{
  refresh_token: string;
  token: string;
}>;

export type loginWithCodeResponse = loginWithCodeResponse0;

export interface recoveryCodeRequest {
  email: string;
}

export type recoveryCodeResponse = Response<{
  code: string;
}>;

export interface recoveryWithCodeRequest {
  guid: string;
  code: string;
  password: string;
}

export interface auth2faRequest {
  device_id: string;
  email: string;
  gcode: string;
  password: string;
  guid: string;
}

export type auth2faResponse = Response<
  | {
      refresh_token: string;
      token: string;
    }
  | string
>;
