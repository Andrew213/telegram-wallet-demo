import {useQuery} from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";

import DepositService from "@/api/services/DepositService";
import useDebouncedValue from "@/hooks/debouncedValue";
import {bigintToNumber, generateID} from "@/utils";

import {State} from "./useRefillReducer";

const STUCK_MS = Number(import.meta.env.VITE_REQUEST_STUCK_MS) || 0;
export default function useGetDeposit(state: State) {
  const [isStuck, setIsStuck] = useState(false);
  const params = useMemo(
    () => ({
      id: generateID(),
      amount: bigintToNumber(state.amount),
      currency: state.balance.code,
      paymethod_id: state.paymethod.id,
      payer_currency: state.payway.code,
    }),
    [state.amount, state.balance.code, state.paymethod.id, state.payway.code],
  );
  const debouncedParams = useDebouncedValue(params, 1_000);

  const query = useQuery({
    queryKey: ["getDeposit", debouncedParams],
    queryFn: () =>
      DepositService.getDeposit(debouncedParams, true).then(data => ({
        ...data,
        ...debouncedParams,
      })),
    enabled: debouncedParams.amount > 0,
    retry: false,
  });

  useEffect(() => {
    if (
      !params.amount ||
      query.data?.id === params.id ||
      query.error ||
      !STUCK_MS
    ) {
      return;
    }

    const timer = setTimeout(() => setIsStuck(true), STUCK_MS);
    return () => {
      clearTimeout(timer);
      setIsStuck(false);
    };
  }, [params, query.data, query.error]);

  return {...query, isStuck};
}

