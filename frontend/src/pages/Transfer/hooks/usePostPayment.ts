import {useMutation, useQueryClient} from "@tanstack/react-query";

import {GetAccount} from "@/api/requests";
import PaymentService from "@/api/services/PaymentService";

export default function usePostPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (...args: Parameters<typeof PaymentService.postPayment>) =>
      PaymentService.postPayment(...args).then(async r => {
        await queryClient.invalidateQueries({queryKey: [GetAccount.QUERY_KEY]});
        return r;
      }),
  });
}

