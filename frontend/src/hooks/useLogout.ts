import {useMutation, UseMutationResult} from "@tanstack/react-query";

import AuthQueryMethods from "@/api/services/AuthService/query";
import {Response, ResponseError} from "@/api/types";

export const useLogout = (): UseMutationResult<
  Response,
  ResponseError,
  void,
  void
> => {
  return useMutation({
    mutationFn: () => {
      return AuthQueryMethods.logout();
    },

    gcTime: 0,
  });
};
