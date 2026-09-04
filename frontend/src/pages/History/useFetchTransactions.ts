import {useInfiniteQuery, useQueryClient} from "@tanstack/react-query";
import {useCallback} from "react";

import {
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";
import BillService from "@/api/services/BillService";
import DepositService from "@/api/services/DepositService";
import PaymentService from "@/api/services/PaymentService";
import StatementService from "@/api/services/StatementService";
import {replace} from "@/utils";

import {Filter} from "./Filters/utils";

const TRANSACTIONS_PER_PAGE = 20;
type PageParam = {last_id: number; created_to: number};
export default function useFetchTransactions(filter: Filter, token: string) {
  const queryClient = useQueryClient();

  return {
    resetQuery: useCallback(() => {
      queryClient.resetQueries({
        queryKey: [
          GetDeposits.QUERY_KEY,
          GetPayments.QUERY_KEY,
          GetBills.QUERY_KEY,
          GetStatements.QUERY_KEY,
        ],
      });
    }, [queryClient]),
    ...useInfiniteQuery({
      queryKey: [
        GetDeposits.QUERY_KEY,
        GetPayments.QUERY_KEY,
        GetBills.QUERY_KEY,
        GetStatements.QUERY_KEY,
      ],
      queryFn: ({pageParam}) => fetch(filter, pageParam),
      initialPageParam: undefined as PageParam | undefined,
      getNextPageParam: lastPage => {
        const lastTransaction = lastPage[TRANSACTIONS_PER_PAGE - 1];
        if (!lastTransaction) {
          return undefined;
        }

        return {
          last_id: lastTransaction.id,
          created_to: lastTransaction.created,
        };
      },
      enabled: !!token,
    }),
  };
}

async function fetch(filter: Filter, pageParam?: PageParam) {
  switch (filter.type) {
    case "DEPOSIT": {
      const [created_from, created_to_from_filter] = !filter.date
        ? []
        : [+filter.date[0], +filter.date[1]];
      const created_to =
        created_to_from_filter && pageParam?.created_to
          ? Math.min(created_to_from_filter, pageParam?.created_to)
          : (created_to_from_filter ?? pageParam?.created_to);
      return DepositService.getDeposits({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_from,
        created_to,
        id: replace(filter.id, 0, undefined),
        shop_order_id: replace(filter.shop_order_id, 0, undefined),
        source_currency: replace(filter.source_currency, "All", undefined),
        target_currency: replace(filter.target_currency, "All", undefined),
        status:
          filter.status === "All"
            ? undefined
            : GetDeposits.statusNameToStatusCodeMap[filter.status],
      }).then(transactions =>
        transactions.map(transaction => ({...transaction, type: filter.type})),
      );
    }
    case "PAYMENT": {
      const [created_from, created_to_from_filter] = !filter.date
        ? []
        : [+filter.date[0], +filter.date[1]];
      const created_to =
        created_to_from_filter && pageParam?.created_to
          ? Math.min(created_to_from_filter, pageParam?.created_to)
          : (created_to_from_filter ?? pageParam?.created_to);
      return PaymentService.getPayments({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_from,
        created_to,
        id: replace(filter.id, 0, undefined),
        source_currency: replace(filter.source_currency, "All", undefined),
        target_currency: replace(filter.target_currency, "All", undefined),
        status:
          filter.status === "All"
            ? undefined
            : GetPayments.statusNameToStatusCodeMap[filter.status],
      }).then(transactions =>
        transactions.map(transaction => ({...transaction, type: filter.type})),
      );
    }
    case "BILL": {
      const [created_from, created_to_from_filter] = !filter.date
        ? []
        : [+filter.date[0], +filter.date[1]];
      const created_to =
        created_to_from_filter && pageParam?.created_to
          ? Math.min(created_to_from_filter, pageParam?.created_to)
          : (created_to_from_filter ?? pageParam?.created_to);
      return BillService.getBills({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_from,
        created_to,
        id: replace(filter.id, 0, undefined),
        shop_order_id: replace(filter.shop_order_id, 0, undefined),
        source_currency: replace(filter.source_currency, "All", undefined),
        target_currency: replace(filter.target_currency, "All", undefined),
        status:
          filter.status === "All"
            ? undefined
            : GetBills.statusNameToStatusCodeMap[filter.status],
      }).then(transactions =>
        transactions.map(transaction => ({...transaction, type: filter.type})),
      );
    }
    case "STATEMENT": {
      const [created_from, created_to_from_filter] = !filter.date
        ? []
        : [+filter.date[0], +filter.date[1]];
      const created_to =
        created_to_from_filter && pageParam?.created_to
          ? Math.min(created_to_from_filter, pageParam?.created_to)
          : (created_to_from_filter ?? pageParam?.created_to);
      return StatementService.getStatements({
        limit: TRANSACTIONS_PER_PAGE,
        last_id: pageParam?.last_id,
        created_from,
        created_to,
        id: replace(filter.id, 0, undefined),
        currency: replace(filter.currency, "All", undefined),
        operation_class:
          filter.statementType === "All"
            ? undefined
            : GetStatements.operationClassNameToOperationClassCodeMap[
                filter.statementType
              ],
      }).then(transactions =>
        transactions.map(transaction => ({...transaction, type: filter.type})),
      );
    }
  }
}
