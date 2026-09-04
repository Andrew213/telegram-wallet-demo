import {useQuery} from "@tanstack/react-query";

import PaymethodService from "@/api/services/PaymethodService";

import {State} from "./useRefillReducer";

export default function useGetPaywayInfoAndWarning(state: State) {
  return useQuery({
    queryKey: [state.payway.info_id, state.payway.warning_id],
    queryFn: () =>
      PaymethodService.getPaywayInfoAndWarning({
        info_id: state.payway.info_id,
        warning_id: state.payway.warning_id,
      }),
  });
}

