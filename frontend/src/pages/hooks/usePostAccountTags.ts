import {useMutation} from "@tanstack/react-query";
import {useEffect, useState} from "react";

import {PostAccountTags} from "@/api/requests/PostAccountTags";
import AccountService from "@/api/services/AccountService";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {calculateTimeLeft} from "@/utils/calculateTimeLeft";

import useGetAccount from "./useGetAccount";

type Props = {
  operationType: PostAccountTags.OperationTypes;
};

export default function usePostAccountTags({operationType}: Props) {
  const [token] = useCloudStorage();

  const account = useGetAccount(token);

  const [expired, setExpired] = useState<boolean | null>(null);
  const [tagLimitExpires, setTagLimitExpires] = useState<Date | null>(null);
  const [remaining, setRemaining] = useState(calculateTimeLeft(new Date()));

  const {mutate} = useMutation({
    mutationKey: [PostAccountTags.MUTATION_KEY, operationType],
    mutationFn: (vars: {
      accountId: number;
      operationType: PostAccountTags.OperationTypes;
    }) =>
      AccountService.postAccountTags({
        account_id: vars.accountId,
        operation_type: vars.operationType,
      }),
    onSuccess: data => {
      if (data) {
        setExpired(data.expired);
        if (data.tag_limit_expires) {
          setTagLimitExpires(new Date(data.tag_limit_expires));
        }
      }
    },
  });

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (expired === false && tagLimitExpires !== null) {
      const updateRemainingTime = () => {
        const currentTime = new Date();
        if (currentTime >= tagLimitExpires) {
          setExpired(true);
          setTagLimitExpires(null);
        }
        setRemaining(calculateTimeLeft(tagLimitExpires));
      };

      updateRemainingTime();

      intervalId = setInterval(updateRemainingTime, 1000);
    } else {
      setRemaining(calculateTimeLeft(new Date()));
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [expired, tagLimitExpires]);

  useEffect(() => {
    if (account.data) {
      mutate({accountId: account.data.id, operationType});
    }
  }, [account.data, mutate, operationType]);

  return {
    expired,
    remaining,
  };
}
