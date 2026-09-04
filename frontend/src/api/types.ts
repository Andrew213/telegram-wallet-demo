export type ResponseError<T = undefined> = T extends undefined
  ? {
      message: string;
      code: number | string;
      result: boolean;
      error_code: number;
      translatedCodes?: number[];
      response?: {
        status: number;
      };
    }
  : {
      data: T;
      message: string;
      code: number | string;
      result: boolean;
      error_code: number;
      translatedCodes?: number[];
      response?: {
        status: number;
      };
    };

export type Response<T = undefined> = T extends undefined
  ? {error_code: number; message: string; result?: boolean}
  : {
      data: T;
      error_code: number;
      message: string;
      result?: boolean;
    };
