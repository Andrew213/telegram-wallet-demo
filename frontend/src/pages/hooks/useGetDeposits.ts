import {useQuery} from "@tanstack/react-query";

import {GetDeposits} from "@/api/requests";
import DepositService from "@/api/services/DepositService";

const useGetDeposits = (params?: GetDeposits.Params) =>
  useQuery({
    queryKey: [GetDeposits.QUERY_KEY, params?.last_id, params?.limit],
    queryFn: () => DepositService.getDeposits(params),
  });

export default useGetDeposits;
