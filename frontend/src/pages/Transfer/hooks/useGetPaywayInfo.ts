import {useQuery} from "@tanstack/react-query";

import PaymethodService from "@/api/services/PaymethodService";

import {State} from "./useTransferReducer";

export default function useGetPaywayInfo(state: State) {
  return useQuery({
    queryKey: [state.payway.info_id],
    queryFn: () =>
      PaymethodService.getPaywayInfoAndWarning({
        info_id: state.payway.info_id,
        warning_id: null,
      }).then(r => r.info),
  });
}

