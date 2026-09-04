import {useMutation, UseMutationResult} from "@tanstack/react-query";

import AuthQueryMethods from "@/api/services/AuthService/query";
import {Response, ResponseError} from "@/api/types";

export const useRetryRecoveryWithCode = (): UseMutationResult<
  Response,
  ResponseError,
  {guid: string},
  void
> => {
  return useMutation({
    mutationFn: (data: {guid: string}) => {
      return AuthQueryMethods.retryRecoveryWithCode(data);
    },
  });
};
