import {useState} from "react";
import {useTranslation} from "react-i18next";

import Icon from "@/components/Icon/Icon";
import {formateDate} from "@/utils";

import TransactionPlate from "./TransactionPlate/TransactionPlate";
import {
  getTransactionAmount,
  getTransactionIcon,
  getTransactionStatus,
  getTransactionTitle,
  Transaction as TransactionType,
} from "./utils";

interface Props {
  transaction: TransactionType;
}

const Transaction: React.FC<Props> = props => {
  const {transaction} = props;

  const [showTransactionPlate, setShowTransactionPlate] = useState(false);

  const {t} = useTranslation();

  const {i18n} = useTranslation();

  return (
    <>
      <div
        onClick={() => setShowTransactionPlate(true)}
        className="flex cursor-pointer gap-4 p-4 active:bg-grey-200 dark:active:bg-dark-surface"
        data-testid={`transaction-${transaction.id}-item`}>
        <Icon
          icon={getTransactionIcon(transaction)}
          testId={`transaction-${transaction.id}-icon`}
          size="sm"
          color="grey-600 dark:text-dark-text-primary"
          bgColor="grey-200 dark:bg-dark-surface"
        />
        <div className="flex flex-grow justify-between">
          <div className="flex flex-col gap-1">
            <p
              className="text-p3 font-p3 dark:text-dark-text-primary"
              data-testid={`transaction-${transaction.id}-title`}>
              {getTransactionTitle(transaction, t)}
            </p>
            <p
              className="text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary"
              data-testid={`transaction-${transaction.id}-date`}>
              {formateDate(transaction.created, i18n.language, {
                long: true,
                time: true,
              })}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p
              className="text-right text-p3 font-p3 dark:text-dark-text-primary"
              data-testid={`transaction-${transaction.id}-amount`}>
              {getTransactionAmount(transaction)}
            </p>
            <p
              className="text-right text-p4 font-p4"
              data-testid={`transaction-${transaction.id}-status`}>
              {getTransactionStatus(transaction, t)}
            </p>
          </div>
        </div>
      </div>
      {showTransactionPlate && (
        <TransactionPlate
          transaction={transaction}
          close={() => setShowTransactionPlate(false)}
        />
      )}
    </>
  );
};

export default Transaction;
