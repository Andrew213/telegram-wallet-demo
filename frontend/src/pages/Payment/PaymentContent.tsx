import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

import {GetAccount, GetOutputPaymethods, PostPayment} from "@/api/requests";
import {PostAccountTags} from "@/api/requests/PostAccountTags";
import Button from "@/components/Button/Button";
import Markup from "@/components/Markup/Markup";
import OperationRestriction from "@/components/OperationRestriction/OperationRestriction";
import Spiner from "@/components/Spiner/Spiner";
import SystemMessage from "@/components/SystemMessage/SystemMessage";
import {DEFAULT_LANGUAGE} from "@/constants";
import {formatThousands, userError} from "@/utils";

import usePostAccountTags from "../hooks/usePostAccountTags";
import Block from "../ui/Block";
import BalanceSelect from "./components/BalanceSelect/BalanceSelect";
import ConfigFields from "./components/ConfigFields/ConfigFields";
import ConfirmPaymentPlate from "./components/ConfirmPaymentPlate";
import DescriptionInput from "./components/DescriptionInput";
import Google2FAPlate from "./components/Google2FAPlate";
import PaymentMethodSelect from "./components/PaymentMethodSelect/PaymentMethodSelect";
import PaywaySelect from "./components/PaywaySelect";
import PostPaymentStatusPlate from "./components/PostPaymentStatusPlate";
import ReceiveAmountInput from "./components/ReceiveAmountInput/ReceiveAmountInput";
import WriteOffAmountInput from "./components/WriteOffAmountInput";
import useGetPayment from "./hooks/useGetPayment";
import useGetPaywayInfo from "./hooks/useGetPaywayInfo";
import usePaymentReducer from "./hooks/usePaymentReducer";
import usePostPayment from "./hooks/usePostPayment";
import {hideAmount, paymentDisabled} from "./utils";

interface Props {
  balances: GetAccount.Balance[];
  auth_operations: GetAccount.AuthOperations;
  paymethods: GetOutputPaymethods.Paymethod[];
}

const PaymentContent: React.FC<Props> = ({
  balances,
  auth_operations,
  paymethods,
}) => {
  const [showConfirmPlate, setShowConfirmPlate] = useState(false);
  const [show2faPlate, setShow2faPlate] = useState({
    show: false,
    errorCode: undefined as undefined | PostPayment.ErrorCode,
  });

  const [state, dispatch] = usePaymentReducer(balances, paymethods);

  const getPayment = useGetPayment(state);

  const {t, i18n} = useTranslation();

  const postPayment = usePostPayment(state);

  const {expired, remaining} = usePostAccountTags({
    operationType:
      PostAccountTags.OperationTypes[
        state.paymethod.is_transfer_paymethod ? "ACCOUNT_TRANSFER" : "PAYOUT"
      ],
  });

  const getPaywayInfo = useGetPaywayInfo(state);

  const {state: locationState} = useLocation();

  const payWayInfo = getPaywayInfo.data?.text;

  useEffect(() => {
    if (locationState?.selectedBalanceId) {
      dispatch({
        type: "ChangeBalance",
        payload: balances.find(
          ({id}) => id === locationState.selectedBalanceId,
        )!,
      });
    }
  }, [balances, dispatch, locationState]);

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex-grow overflow-y-auto py-4">
          <Block>
            <PaymentMethodSelect
              state={state}
              paymethods={paymethods}
              dispatch={dispatch}
            />
            <ConfigFields state={state} dispatch={dispatch} />
            <BalanceSelect
              state={state}
              balances={balances}
              dispatch={dispatch}
            />
            <WriteOffAmountInput
              state={state}
              getPayment={getPayment}
              dispatch={dispatch}
            />
          </Block>
          <Block>
            <PaywaySelect state={state} dispatch={dispatch} />
            <ReceiveAmountInput
              state={state}
              getPayment={getPayment}
              dispatch={dispatch}
            />
            <DescriptionInput state={state} dispatch={dispatch} />
            {payWayInfo && (
              <Markup
                data-testid="payment-payway-info"
                className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-yellow-100 p-4 text-p3 font-p3 text-grey-600 dark:bg-dark-yellow-bg dark:text-dark-text-primary [&_img]:mx-auto [&_p:not(:first-child)]:mt-3.5 [&_p:not(:last-child)]:mb-3.5">
                {payWayInfo[i18n.language] ?? payWayInfo[DEFAULT_LANGUAGE]}
              </Markup>
            )}
          </Block>
        </div>
        <div className="rounded-t-6 bg-white px-4 pb-4 pt-6 dark:bg-dark-bg">
          {expired === false && (
            <OperationRestriction
              hours={remaining.hours}
              minutes={remaining.minutes}
              seconds={remaining.seconds}
            />
          )}
          <Button
            color="primary"
            size="lg"
            onClick={() => setShowConfirmPlate(true)}
            testId="payment-pay-button"
            disabled={paymentDisabled(state, getPayment) || expired === false}>
            {`${t`proceed_to_payment_label`}: `}
            {getPayment.isStuck ? (
              <Spiner height={20} width={20} />
            ) : (
              `${hideAmount(state, getPayment) ? 0 : formatThousands(getPayment.data!.write_off_amount)} ${state.balance.alias}`
            )}
          </Button>
        </div>
      </div>
      {showConfirmPlate && getPayment.data && (
        <ConfirmPaymentPlate
          state={state}
          getPaymentData={getPayment.data}
          close={() => setShowConfirmPlate(false)}
          onConfirm={() => {
            if (
              auth_operations[GetAccount.TwoFactorAction.PAYMENTS] ===
              GetAccount.TwoFactorType.GCODE
            ) {
              setShow2faPlate({show: true, errorCode: undefined});
              return;
            }

            postPayment.mutate({t});
          }}
        />
      )}
      {show2faPlate.show && getPayment.data && (
        <Google2FAPlate
          errorCode={show2faPlate.errorCode}
          close={() => setShow2faPlate({show: false, errorCode: undefined})}
          submit={gcode => {
            setShow2faPlate({show: false, errorCode: undefined});
            postPayment.mutate(
              {t, gcode},
              {
                onSuccess: () =>
                  setShow2faPlate({show: false, errorCode: undefined}),
                onError: _error => {
                  const error = _error as PostPayment.ResponseError;
                  if (
                    error.error_code ===
                    PostPayment.errorNameToErrorCodeMap.invalidGcode
                  ) {
                    setShow2faPlate({
                      show: true,
                      errorCode:
                        PostPayment.errorNameToErrorCodeMap.invalidGcode,
                    });
                  } else {
                    setShow2faPlate({show: false, errorCode: undefined});
                  }
                },
              },
            );
          }}
        />
      )}
      <PostPaymentStatusPlate postPayment={postPayment} />
      {getPayment.error && (
        <SystemMessage testId="payment" message={userError(getPayment.error)} />
      )}
    </>
  );
};

export default PaymentContent;
