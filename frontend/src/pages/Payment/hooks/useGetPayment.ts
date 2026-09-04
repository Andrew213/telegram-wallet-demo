import {useQuery} from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import {GetPayment} from "@/api/requests";
import PaymentService from "@/api/services/PaymentService";
import {useDebouncedValue} from "@/hooks";
import {bigintToNumber, generateID, omit} from "@/utils";

import {State} from "./usePaymentReducer";

const STUCK_MS = Number(import.meta.env.VITE_REQUEST_STUCK_MS) || 0;
export default function useGetPayment(state: State) {
  const [isStuck, setIsStuck] = useState(false);

  const {t} = useTranslation();

  const params = useMemo(
    () => ({
      id: generateID(),
      amount: bigintToNumber(state.amount.value),
      amount_type: state.amount.type,
      source_currency: state.balance.code,
      target_currency: state.payway.code,
      paymethod_type: (state.paymethod.is_transfer_paymethod
        ? "account_transfer"
        : "payout") as "account_transfer" | "payout",
      paymethod_id: state.paymethod.id,
    }),
    [
      state.amount.value,
      state.amount.type,
      state.balance.code,
      state.payway.code,
      state.paymethod.is_transfer_paymethod,
      state.paymethod.id,
    ],
  );
  const debouncedParams = useDebouncedValue(params, 1_000);

  const query = useQuery({
    queryKey: [GetPayment.QUERY_KEY, debouncedParams],
    queryFn: () =>
      PaymentService.getPayment(t, omit(debouncedParams, ["id"]), true).then(
        data => ({
          ...data,
          debouncedParams,
        }),
      ),
    enabled: debouncedParams.amount > 0,
    retry: false,
  });

  useEffect(() => {
    if (
      !params.amount ||
      query.data?.debouncedParams?.id === params.id ||
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
