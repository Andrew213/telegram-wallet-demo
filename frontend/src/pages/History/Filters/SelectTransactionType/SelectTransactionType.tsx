import {useTranslation} from "react-i18next";
import {twJoin} from "tailwind-merge";

import {TransactionType, transactionTypes} from "../utils";

interface Props {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

const SelectTransactionType: React.FC<Props> = ({value, onChange}) => {
  const {t} = useTranslation();

  const typeToNameMap: Record<TransactionType, string> = {
    DEPOSIT: t`transaction_type_deposit`,
    PAYMENT: t`transaction_type_transfer`,
    BILL: t`transaction_type_bill`,
    STATEMENT: t`transaction_type_statements`,
  } as const;

  return (
    <div
      className="flex gap-2 overflow-x-auto"
      data-testid="history-transaction-types-container">
      {transactionTypes.map(type => {
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            data-testid={`history-transaction-${type.toLowerCase()}-filter-button`}
            className={twJoin(
              "flex cursor-pointer items-center gap-1 rounded-4 px-3 py-2 first:ml-4 last:mr-4",
              value === type
                ? "bg-blue-300 text-white dark:text-dark-bg"
                : "bg-white text-grey-600 dark:bg-dark-bg dark:text-dark-text-primary",
            )}>
            <div
              className="text-p3 font-p3"
              data-testid={`history-transaction-${type.toLowerCase()}-filter-text`}>
              {typeToNameMap[type]}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SelectTransactionType;
