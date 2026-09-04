import {useQuery} from "@tanstack/react-query";

import PaymethodService from "@/api/services/PaymethodService";

export default function useGetPaymethods() {
  return useQuery({
    queryKey: ["input_paymethods"],
    queryFn: () => PaymethodService.getInputPaymethods(),
    staleTime: 5 * 60_000,
  });
}

