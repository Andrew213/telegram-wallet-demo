import {useMutation} from "@tanstack/react-query";

import {PutAccount} from "@/api/requests/Account/PutAccount";
import AccountService from "@/api/services/AccountService";

export default function usePutAccount() {
  return useMutation({
    mutationKey: [PutAccount.QUERY_KEY],
    mutationFn: (data: PutAccount.Params) => AccountService.putAccount(data),
  });
}
