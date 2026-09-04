import {useQuery} from "@tanstack/react-query";

import {GetInputPaymethods} from "@/api/requests";
import PaymethodService from "@/api/services/PaymethodService";

export default function useGetPaymethods() {
  return useQuery({
    queryKey: [GetInputPaymethods.QUERY_KEY],
    queryFn: () => PaymethodService.getInputPaymethods(),
    staleTime: 5 * 60_000,
  });
}
