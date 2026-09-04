import {useMutation} from "@tanstack/react-query";

import {DeleteAccount} from "@/api/requests";
import AccountService from "@/api/services/AccountService";
import globalRouter from "@/globalRouter";

export default function usePostDeleteAccount() {
  return useMutation({
    mutationKey: [DeleteAccount.QUERY_KEY],
    mutationFn: (data: DeleteAccount.BodyRequired) =>
      AccountService.deleteAccount(data),
    onSuccess: () => {
      globalRouter.navigate?.("/");
    },
  });
}
