import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {twJoin} from "tailwind-merge";

import {queryClient} from "@/api/queryClient";
import {Currency, GetBills, PutBillDetailed} from "@/api/requests";
import {PostAccountTags} from "@/api/requests/PostAccountTags";
import BottomPlate from "@/components/BottomPlate/BottomPlate";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import OperationRestriction from "@/components/OperationRestriction/OperationRestriction";
import SidePlate from "@/components/SidePlate/SidePlate";
import Spiner from "@/components/Spiner/Spiner";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import {useSystemMessage} from "@/core/context/useSystemMessage";
import usePostAccountTags from "@/pages/hooks/usePostAccountTags";
import {userError} from "@/utils";

import {
  usePutBillCancel,
  usePutBillDetailed,
  usePutBillPay,
} from "../hooks/useMutate";

interface Props {
  encoded_id: string;
  onClose: () => void;
}

const BillDetailed: React.FC<Props> = props => {
  const {encoded_id, onClose} = props;

  const {mutateAsync: putBillDetailed, isPending} = usePutBillDetailed();

  const [isCancelPlateOpen, setIsCancelPlateOpen] = useState(false);

  const {mutate: putBillCancel} = usePutBillCancel();

  const {mutate: putBillPay, isPending: PendingPay} = usePutBillPay();

  const {expired, remaining} = usePostAccountTags({
    operationType: PostAccountTags.OperationTypes.BILL,
  });

  const [, setMessage] = useSystemMessage();

  const [success, setSuccess] = useState(false);

  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    if (canceled) {
      setSuccess(false);
      setCanceled(false);
      onClose();
      queryClient.invalidateQueries({
        queryKey: [GetBills.QUERY_KEY],
      });
    }
  }, [canceled]);

  const [bill, setBill] = useState<PutBillDetailed.Response>();

  const {t} = useTranslation();

  useEffect(() => {
    putBillDetailed(encoded_id).then(response => {
      setBill(response);
      if (response.allowed_balances) {
        setSelectedBalance(response.allowed_balances[0]);
      }
    });
  }, [encoded_id, putBillDetailed]);

  const [selectedBalance, setSelectedBalance] = useState<
    PutBillDetailed.BillBalance | undefined
  >();

  const handleOnCancel = () => {
    putBillCancel(encoded_id, {
      onError(error) {
        setMessage(userError(error));
        setIsCancelPlateOpen(false);
      },
      onSuccess() {
        setCanceled(true);
      },
    });
  };
  const handleOnPay = () => {
    putBillPay(
      {
        encoded_bill_id: encoded_id,
        currency: selectedBalance?.write_off_currency.code,
        t,
      },
      {
        onError(error) {
          setMessage(userError(error));
          setIsCancelPlateOpen(false);
        },
        onSuccess() {
          setSuccess(true);
        },
      },
    );
  };

  return (
    <SidePlate
      close={() => {
        onClose();
      }}
      testId="bill-detailed"
      bgColor={isPending ? "white dark:bg-dark-underlay" : "blue-300"}>
      {close => {
        return isPending ? (
          <div className="flex h-tg-viewport-height items-center justify-center">
            <Spiner />
          </div>
        ) : (
          <>
            <SidePlate.Header
              close={close}
              bgColor={"blue-300"}
              testId="bill-detailed"
              color="white dark:text-dark-text-primary"
              title={t`bill_details_title`}
            />
            {bill && (
              <>
                <div className="flex flex-grow flex-col gap-6 overflow-y-auto">
                  <div className="mt-12 flex flex-col items-center justify-center text-white dark:text-dark-text-primary">
                    <p
                      data-testid="bill-detailed-to-pay"
                      className="text-numbers font-numbers dark:text-dark-text-primary">
                      {t("bill_detail_to_pay", {
                        amount: bill.receive_amount,
                        currency: bill.receive_currency,
                      })}
                    </p>
                  </div>
                  <div className="flex flex-grow flex-col overflow-y-auto rounded-t-8 bg-white p-4 dark:bg-dark-bg">
                    <div className="mb-8">
                      <div className="py-4">
                        <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                          {t`transaction_history_detail_field_status`}
                        </p>
                        <p
                          data-testid="bill-detailed-status"
                          className="text-p3 font-p3 dark:text-dark-text-primary">
                          {PutBillDetailed.statuses(t)[bill.status]}
                        </p>
                      </div>
                      <div className="border-t border-grey-200 py-4 dark:border-dark-surface">
                        <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                          {t`transaction_history_detail_field_id_bill`}
                        </p>
                        <p
                          data-testid="bill-detailed-id"
                          className="flex cursor-pointer items-center justify-between text-p3 font-p3 dark:text-dark-text-primary"
                          onClick={() => {
                            navigator.clipboard.writeText("#" + bill.id);
                            setMessage(t`transaction_history_detail_clipboard`);
                          }}>
                          {"#" + bill.id}
                          <Icon
                            icon="RegularCopy"
                            size="sm"
                            testId="bill-detailed-copy-icon"
                            bgColor="white dark:bg-dark-bg"
                            color="grey-400 dark:text-dark-text-tertiary"
                          />
                        </p>
                      </div>
                      <div className="border-t border-grey-200 py-4 dark:border-dark-surface">
                        <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                          {t`transaction_history_detail_field_bill_amount`}
                        </p>
                        <p
                          data-testid="bill-detailed-amount"
                          className="text-p3 font-p3 dark:text-dark-text-primary">
                          {`${bill.receive_amount} ${bill.receive_currency}`}
                        </p>
                      </div>
                      {!bill.allowed_balances && (
                        <div className="border-t border-grey-200 py-4 dark:border-dark-surface">
                          <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                            {t`to_pay_title`}
                          </p>
                          <p
                            data-testid="bill-detailed-allowed-balances"
                            className="text-p3 font-p3 dark:text-dark-text-primary">
                            {`${bill.write_off_amount} ${bill.write_off_currency}`}
                          </p>
                        </div>
                      )}
                      {bill.description && (
                        <div className="border-t border-grey-200 py-4 dark:border-dark-surface">
                          <p className="mb-1 text-p4 font-p4 text-grey-400 dark:text-dark-text-tertiary">
                            {t`confirm_transfer_screen_comment`}
                          </p>
                          <p
                            data-testid="bill-detailed-description"
                            className="text-p3 font-p3 dark:text-dark-text-primary">{`${bill.description}`}</p>
                        </div>
                      )}
                      {!!bill.allowed_balances?.length && (
                        <div className="mt-4 flex flex-col gap-4">
                          <p className="text-h4 font-h4 dark:text-dark-text-primary">
                            {t`bill_detail_choose_balance`}
                          </p>
                          <p className="text-p3 font-p3 dark:text-dark-text-primary">
                            {t`bill_detail_choose_description`}
                          </p>
                          {bill.allowed_balances.map(
                            ({write_off_amount, write_off_currency}, i) => {
                              return (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setSelectedBalance({
                                      write_off_amount,
                                      write_off_currency,
                                    });
                                  }}
                                  data-testid={`bill-detailed-${i}-allowed-balance`}
                                  className={twJoin(
                                    "flex items-center gap-2 rounded-8 border-[2px] bg-grey-100 p-4 text-start dark:bg-dark-underlay",
                                    selectedBalance?.write_off_currency
                                      .alias === write_off_currency.alias
                                      ? "border-blue-300"
                                      : "border-transparent",
                                  )}>
                                  {Currency.getIcon(
                                    write_off_currency.alias,
                                  ) ? (
                                    <Icon
                                      icon={
                                        Currency.getIcon(
                                          write_off_currency.alias,
                                        )!
                                      }
                                      bgColor={
                                        Currency.getColor(
                                          write_off_currency.alias,
                                        ) ??
                                        "grey-400 dark:bg-dark-text-tertiary"
                                      }
                                      testId={`bill-detailed-${i}-allowed-balance-icon`}
                                      color="white dark:bg-dark-bg"
                                      size="sm"
                                    />
                                  ) : (
                                    <div
                                      data-testid={`bill-detailed-${i}-allowed-balance-icon`}
                                      className="flex size-10 items-center justify-center rounded-4 bg-grey-400 text-white dark:bg-dark-text-tertiary dark:text-dark-text-primary">
                                      {write_off_currency.alias}
                                    </div>
                                  )}
                                  <div className="flex flex-col gap-1">
                                    <div
                                      data-testid={`bill-detailed-${i}-allowed-balance-currency`}
                                      className="text-p1 font-p1 dark:text-dark-text-primary">
                                      {Currency.getRuName(
                                        write_off_currency.code,
                                        t,
                                      ) ?? write_off_currency.alias}
                                    </div>
                                    <div
                                      className="text-p3 font-p3 dark:text-dark-text-primary"
                                      data-testid={`bill-detailed-${i}-allowed-balance-amount`}>
                                      {`${write_off_amount} ${write_off_currency.alias}`}
                                    </div>
                                  </div>
                                </button>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto flex flex-col gap-4">
                      {expired === false && (
                        <OperationRestriction
                          hours={remaining.hours}
                          minutes={remaining.minutes}
                          seconds={remaining.seconds}
                        />
                      )}
                      <Button
                        color="primary"
                        onClick={handleOnPay}
                        loading={PendingPay}
                        disabled={expired === false}
                        testId="bill-detailed-pay-button"
                        size="lg">
                        {t("bill_detail_to_pay", {
                          amount:
                            selectedBalance?.write_off_amount ||
                            bill.write_off_amount,
                          currency:
                            selectedBalance?.write_off_currency.alias ||
                            bill.write_off_currency,
                        })}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsCancelPlateOpen(true);
                        }}
                        testId="bill-detailed-decline-button"
                        color="secondary"
                        size="lg">
                        {t`bill_detail_pay_decline`}
                      </Button>
                    </div>
                  </div>
                  {isCancelPlateOpen && (
                    <BottomPlate
                      title={t`bill_detail_cancel_confirmation_modal_title`}
                      close={() => setIsCancelPlateOpen(false)}>
                      {close => (
                        <div className="flex flex-col gap-4 p-4 pt-0">
                          <p className="text-p2 font-p2 text-grey-600 dark:text-dark-text-primary">
                            {t`bill_detail_cancel_confirmation_modal_subtitle`}
                          </p>
                          <Button
                            testId="bill-detailed-not-cancel-button"
                            onClick={close}
                            size="lg"
                            color="primary">
                            {t`bill_detail_cancel_confirmation_modal_button_no`}
                          </Button>
                          <Button
                            onClick={handleOnCancel}
                            color="secondary"
                            testId="bill-detailed-cancel-button"
                            size="lg">
                            {t`bill_detail_cancel_confirmation_modal_button_yes`}
                          </Button>
                        </div>
                      )}
                    </BottomPlate>
                  )}
                  {success && (
                    <StatusPlate
                      status="SUCCESS"
                      title={t`bill_success_screen_title`}
                      subTitle={t`bill_success_screen_subtitle`}
                      buttonText={t`tab_bar_receipts_screen_title`}
                      testId="bill-detailed-success"
                      onButtonClick={() => {
                        setSuccess(false);
                        setCanceled(false);
                        onClose();
                        queryClient.invalidateQueries({
                          queryKey: [GetBills.QUERY_KEY],
                        });
                      }}
                    />
                  )}
                </div>
              </>
            )}
          </>
        );
      }}
    </SidePlate>
  );
};

export default BillDetailed;
