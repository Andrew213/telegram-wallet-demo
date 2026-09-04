import {useQuery} from "@tanstack/react-query";

import {GetPayments} from "@/api/requests";
import PaymentService from "@/api/services/PaymentService";

const useGetPayments = (params?: GetPayments.Params) =>
  useQuery({
    queryKey: [GetPayments.QUERY_KEY],
    queryFn: () => PaymentService.getPayments(params),
  });

export default useGetPayments;
