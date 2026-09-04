import {useQuery} from "@tanstack/react-query";

import {GetAccount} from "@/api/requests";
import AccountService from "@/api/services/AccountService";

export default function useGetAccount(token: string | null) {
  return useQuery<GetAccount.Response, Error & {code: string}>({
    queryKey: [GetAccount.QUERY_KEY],
    queryFn: () => AccountService.getAccount(),
    enabled: !!token,
  });
}
