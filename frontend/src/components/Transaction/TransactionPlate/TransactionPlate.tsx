import {useTranslation} from "react-i18next";

import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import SidePlate from "@/components/SidePlate/SidePlate";
import Spiner from "@/components/Spiner/Spiner";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import {useOpenLink} from "@/hooks";
import {notFalsy, userError} from "@/utils";

import {Transaction} from "../utils";
import useFetchTransactionDetails from "./useFetchTransactionDetails";
import {
  getAmountTitle,
  getFields,
  getPlateHeader,
  getTransactionAmountTitle,
} from "./utils";

interface Props {
  transaction: Transaction;
  close: () => void;
}

const TransactionPlate: React.FC<Props> = props => {
  const {transaction, close: closeFromProps} = props;

  const transactionDetails = useFetchTransactionDetails(transaction);

  const {i18n, t} = useTranslation();

  const openLink = useOpenLink();

  const [, setMessage] = useSystemMessage();

  const renderCheckButton = () => {
    if (
      transactionDetails.data?.type === "DEPOSIT" &&
      transactionDetails.data.additional_data &&
      transactionDetails.data.status !== 4
    ) {
      const url = transactionDetails.data.additional_data.receipt_url;
      if (url) {
        return (
          <Button
            type="button"
            size="lg"
            color="primary"
            testId={`transaction-plate-${transaction.id}-check-button`}
            onClick={() => openLink(url)}>
            {t`upload_cheque_label`}
          </Button>
        );
      }
    }
    return null;
  };

  if (transactionDetails.error) {
    return (
      <StatusPlate
        status="ERROR"
        title={userError(transactionDetails.error)}
        testId="transaction-plate-error"
        onButtonClick={() => {
          openLink("mailto:support@example.com");
        }}
        onBackButtonClick={closeFromProps}
      />
    );
  }

  return (
    <SidePlate
      testId={`transaction-plate-${transaction.id}`}
      close={closeFromProps}
      bgColor="blue-300 dark:bg-dark-underlay">
      {close => (
        <>
          <SidePlate.Header
            close={close}
            bgColor="blue-300 dark:bg-dark-bg"
            color="white dark:text-dark-text-primary"
            testId={`transaction-plate-${transaction.id}`}
            title={getPlateHeader(transaction, t)}
          />
          <p
            data-testid={`transaction-plate-${transaction.id}-tx-amount-title`}
            className="mt-12 text-center text-p4 font-p4 text-white dark:text-dark-text-primary">
            {getTransactionAmountTitle(transaction, t)}
          </p>
          <p
            data-testid={`transaction-plate-${transaction.id}-amount-title`}
            className="mt-1 text-center text-numbers font-numbers text-white dark:text-dark-text-primary">
            {getAmountTitle(transaction)}
          </p>
          <div
            data-testid={`transaction-plate-${transaction.id}-body`}
            className="mt-6 flex flex-grow flex-col justify-between overflow-y-auto rounded-t-8 bg-white px-4 pt-2 dark:bg-dark-bg">
            {transactionDetails.isLoading || !transactionDetails.data ? (
              <div className="flex h-full w-full items-center justify-center">
                <Spiner style={{height: "30px", width: "30px"}} />
              </div>
            ) : (
              <div>
                {getFields(transactionDetails.data, i18n.language, t)
                  .filter(notFalsy)
                  .map((field, i) => (
                    <div
                      key={field.label}
                      data-testid={`transaction-plate-${transaction.id}-field-${i}`}
                      className="flex border-grey-200 py-4 dark:border-dark-surface [&:not(:first-child)]:border-t">
                      <div className="flex-grow">
                        <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                          {field.label}
                        </p>
                        <p
                          data-testid={`transaction-plate-${transaction.id}-field-${i}-text`}
                          className="min-h-4.5 whitespace-pre text-wrap break-all text-p3 font-p3 text-grey-600 dark:text-dark-text-primary">
                          {field.isId && field.value && "#"}
                          {field.value}
                        </p>
                      </div>
                      {field.canBeCopied && field.value && (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(field.value);
                            setMessage(t`transaction_history_detail_clipboard`);
                          }}>
                          <Icon
                            icon="RegularCopy"
                            size="sm"
                            testId={`transaction-plate-${transaction.id}-field-${i}-copy-icon`}
                            bgColor="white dark:bg-dark-bg"
                            color="grey-400 dark:text-dark-text-tertiary"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            <div className="flex flex-col gap-3 py-4">
              {renderCheckButton()}
              {transactionDetails.data?.type === "DEPOSIT" &&
                transactionDetails.data.status !== 4 && (
                  <Button
                    type="button"
                    size="lg"
                    color="secondary"
                    loading={transactionDetails.isFetching}
                    testId={`transaction-plate-${transaction.id}-update-button`}
                    onClick={() => transactionDetails.refetch()}>
                    {t`update_status_label`}
                  </Button>
                )}
            </div>
          </div>
        </>
      )}
    </SidePlate>
  );
};

export default TransactionPlate;
