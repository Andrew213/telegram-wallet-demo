import {ResponseError} from "./types";

export const translateError = (
  data: ResponseError,
  translate?: Record<number, string>,
  nativeErrors?: number[],
): ResponseError => {
  if (nativeErrors && nativeErrors.includes(data.error_code)) {
    return {
      ...data,
      translatedCodes: nativeErrors,
    };
  }

  if (translate && translate[data.error_code]) {
    return {
      ...data,
      message: translate[data.error_code],
      translatedCodes: Object.keys(translate).map(Number),
    };
  }

  return data;
};
