import {ResponseError} from "@/api/types";

export async function demoDelay(ms = 450) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

export function createDemoError<T = undefined>(
  message: string,
  errorCode: number,
  data?: T,
): ResponseError<T> {
  return {
    code: errorCode,
    data,
    error_code: errorCode,
    message,
    result: false,
    translatedCodes: [errorCode],
  } as ResponseError<T>;
}

export function demoResponse<T>(data: T) {
  return {
    data,
    error_code: 0,
    message: "OK",
    result: true,
  };
}

export function demoEmptyResponse() {
  return {
    error_code: 0,
    message: "OK",
    result: true,
  };
}
