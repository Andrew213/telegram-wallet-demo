import {useQuery} from "@tanstack/react-query";

import {
  GetBillDetails,
  GetDepositDetails,
  GetPaymentDetails,
} from "@/api/requests";
import BillService from "@/api/services/BillService";
import DepositService from "@/api/services/DepositService";
import PaymentService from "@/api/services/PaymentService";
import StatementService from "@/api/services/StatementService";

import {Transaction} from "../utils";

export default function useFetchTransactionDetails(transaction: Transaction) {
  return useQuery({
    queryKey: [
      "fetchTransactionDetails",
      GetDepositDetails.QUERY_KEY,
      GetPaymentDetails.QUERY_KEY,
      GetBillDetails.QUERY_KEY,
      transaction.type,
      transaction.id,
    ],
    queryFn: () => getTransactionDetails(transaction),
  });
}

async function getTransactionDetails(transaction: Transaction) {
  switch (transaction.type) {
    case "DEPOSIT": {
      return DepositService.getDepositDetails(transaction).then(d => ({
        ...d,
        type: transaction.type,
      }));
    }
    case "PAYMENT": {
      return PaymentService.getPaymentDetails({
        id: transaction.id,
        paymethod_type: transaction.is_account_transfer
          ? "account_transfer"
          : undefined,
      }).then(d => ({...d, type: transaction.type}));
    }
    case "BILL": {
      return BillService.getBillDetails({
        id: transaction.id,
      }).then(d => ({...d, type: transaction.type}));
    }
    case "STATEMENT": {
      return StatementService.getStatementDetails({
        id: transaction.id,
        operation_type: transaction.operation_type,
      }).then(d => ({...d, type: transaction.type}));
    }
  }
}

export type TransactionDetails = Awaited<
  ReturnType<typeof getTransactionDetails>
>;
