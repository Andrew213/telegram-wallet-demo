import {useQuery} from "@tanstack/react-query";

import {GetOutputPaymethods} from "@/api/requests";
import PaymethodService from "@/api/services/PaymethodService";

export default function useGetPaymethods() {
  return useQuery({
    queryKey: ["output_paymethods"],
    queryFn: () =>
      PaymethodService.getOutputPaymethods({
        param: [...GetOutputPaymethods.paramValues],
      }),
    staleTime: 5 * 60_000,
  });
}

