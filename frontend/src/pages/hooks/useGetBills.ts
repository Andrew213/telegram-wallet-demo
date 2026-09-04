import {useQuery} from "@tanstack/react-query";

import {GetBills} from "@/api/requests";
import BillService from "@/api/services/BillService";

const useGetBills = (token: string | null = null, params?: GetBills.Params) =>
  useQuery({
    queryKey: [GetBills.QUERY_KEY, {...params}],
    queryFn: () => BillService.getBills(params),
    enabled: !!token,
  });

export default useGetBills;
