import {useQuery} from "@tanstack/react-query";

import {GetPaywayInfo} from "@/api/requests";
import PaymethodService from "@/api/services/PaymethodService";

export default function useGetPaywayInfoAndWarning(
  params: Parameters<typeof PaymethodService.getPaywayInfoAndWarning>[0],
) {
  return useQuery({
    queryKey: [GetPaywayInfo.QUERY_KEY, params.info_id, params.warning_id],
    queryFn: () => PaymethodService.getPaywayInfoAndWarning(params),
  });
}
