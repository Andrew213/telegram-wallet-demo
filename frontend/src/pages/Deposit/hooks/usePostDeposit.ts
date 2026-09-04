import {useMutation} from "@tanstack/react-query";

import DepositService from "@/api/services/DepositService";
import globalRouter from "@/globalRouter";

export default function usePostDeposit(openLink: (url: string) => void) {
  return useMutation({
    mutationFn: (...params: Parameters<typeof DepositService.postDeposit>) =>
      DepositService.postDeposit(...params),
    onSuccess: ({url}) => {
      openLink(url);
      globalRouter.navigate?.("/history");
    },
  });
}
