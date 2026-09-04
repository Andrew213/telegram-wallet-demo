import {useQuery} from "@tanstack/react-query";

import {GetPaywayInfo} from "@/api/requests";
import PaymethodService from "@/api/services/PaymethodService";

import {State} from "./usePaymentReducer";

export default function useGetPaywayInfo(state: State) {
  return useQuery({
    queryKey: [GetPaywayInfo.QUERY_KEY, state.payway.info_id],
    queryFn: () =>
      PaymethodService.getPaywayInfoAndWarning({
        info_id: state.payway.info_id,
        warning_id: null,
      }).then(r => r.info),
  });
}
