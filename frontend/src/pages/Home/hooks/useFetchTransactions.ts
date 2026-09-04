import {useInfiniteQuery} from "@tanstack/react-query";

import BillService from "@/api/services/BillService";
import DepositService from "@/api/services/DepositService";
import PaymentService from "@/api/services/PaymentService";

const TRANSACTIONS_PER_PAGE = 5;

export const useUploadDeposits = (token: string | null) => {
  return useInfiniteQuery({
    queryKey: ["uploadDeposits"],
    queryFn: ({pageParam}) => {
      return DepositService.getDeposits({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_to: pageParam?.created,
      });
    },
    gcTime: 0,
    staleTime: 0,
    initialPageParam: undefined as
      | {last_id: number; created: number}
      | undefined,
    getNextPageParam: lastPage => {
      const lastPayment = lastPage[TRANSACTIONS_PER_PAGE - 1];
      return lastPage.length < TRANSACTIONS_PER_PAGE
        ? undefined
        : {
            last_id: lastPayment.id,
            created: lastPayment.created,
          };
    },
    enabled: !!token,
  });
};

export const useUploadPayments = (token: string | null) => {
  return useInfiniteQuery({
    queryKey: ["uploadPayments"],
    queryFn: ({pageParam}) =>
      PaymentService.getPayments({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_to: pageParam?.created,
      }),
    gcTime: 0,
    staleTime: 0,
    initialPageParam: undefined as
      | {last_id: number; created: number}
      | undefined,
    getNextPageParam: lastPage => {
      const lastPayment = lastPage[TRANSACTIONS_PER_PAGE - 1];
      return lastPage.length < TRANSACTIONS_PER_PAGE
        ? undefined
        : {
            last_id: lastPayment.id,
            created: lastPayment.created,
          };
    },
    enabled: !!token,
  });
};

export const useUploadBills = (token: string | null) => {
  return useInfiniteQuery({
    queryKey: ["uploadBills"],
    queryFn: ({pageParam}) =>
      BillService.getBills({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_to: pageParam?.created,
      }),
    gcTime: 0,
    staleTime: 0,
    initialPageParam: undefined as
      | {last_id: number; created: number}
      | undefined,
    getNextPageParam: lastPage => {
      const lastPayment = lastPage[TRANSACTIONS_PER_PAGE - 1];
      return lastPage.length < TRANSACTIONS_PER_PAGE
        ? undefined
        : {
            last_id: lastPayment.id,
            created: lastPayment.created,
          };
    },
    enabled: !!token,
  });
};
