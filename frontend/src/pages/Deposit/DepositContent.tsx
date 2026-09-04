import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

import {GetAccount, GetInputPaymethods} from "@/api/requests";
import {PostAccountTags} from "@/api/requests/PostAccountTags";
import Button from "@/components/Button/Button";
import OperationRestriction from "@/components/OperationRestriction/OperationRestriction";
import Spiner from "@/components/Spiner/Spiner";
import SystemMessage from "@/components/SystemMessage/SystemMessage";
import {useOpenLink} from "@/hooks";
import {formatThousands, userError} from "@/utils";

import usePostAccountTags from "../hooks/usePostAccountTags";
import Block from "../ui/Block";
import BalanceSelect from "./components/BalanceSelect/BalanceSelect";
import ConfigFields from "./components/ConfigFields/ConfigFields";
import ConfirmDepositPlate from "./components/ConfirmDepositPlate";
import NotVerifiedNotification from "./components/NotVerifiedNotification";
import PaymethodSelect from "./components/PaymethodSelect/PaymethodSelect";
import PaywaySelect from "./components/PaywaySelect/PaywaySelect";
import PostDepositStatusPlate from "./components/PostDepositStatusPlate";
import ReceiveAmountInput from "./components/ReceiveAmountInput";
import useDepositReducer from "./hooks/useDepositReducer";
import useGetDeposit from "./hooks/useGetDeposit";
import usePostDeposit from "./hooks/usePostDeposit";
import {depositDisabled, hideAmount} from "./utils";

interface Props {
  status: GetAccount.AccountStatus;
  balances: GetAccount.Balance[];
  paymethods: GetInputPaymethods.Paymethod[];
}

const DepositContent: React.FC<Props> = props => {
  const {status, balances, paymethods} = props;

  const openLink = useOpenLink();

  const [showConfim, setShowConfim] = useState(false);

  const {state: locationState} = useLocation();

  const [state, dispatch] = useDepositReducer(balances, paymethods);

  const postDeposit = usePostDeposit(openLink);

  const {expired, remaining} = usePostAccountTags({
    operationType: PostAccountTags.OperationTypes.DEPOSIT,
  });

  const getDeposit = useGetDeposit(state);

  const {t} = useTranslation();

  useEffect(() => {
    if (locationState?.selectedBalanceId) {
      dispatch({
        type: "SelectBalance",
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
            {status !== GetAccount.AccountStatus.verified &&
              status !== GetAccount.AccountStatus.verifying && (
                <NotVerifiedNotification />
              )}
            <BalanceSelect
              state={state}
              balances={balances}
              dispatch={dispatch}
            />
            <ReceiveAmountInput
              state={state}
              getDeposit={getDeposit}
              dispatch={dispatch}
            />
          </Block>
          <Block>
            <PaymethodSelect state={state} dispatch={dispatch} />
            <ConfigFields state={state} dispatch={dispatch} />
            <PaywaySelect state={state} dispatch={dispatch} />
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
            testId="deposit-pay-button"
            onClick={() => setShowConfim(true)}
            disabled={depositDisabled(state, getDeposit) || expired === false}>
            {`${t`proceed_to_payment_label`}: `}
            {getDeposit.isStuck ? (
              <Spiner height={20} width={20} />
            ) : (
              `${hideAmount(state, getDeposit) ? 0 : formatThousands(getDeposit.data!.amount)} ${state.payway.currency}`
            )}
          </Button>
        </div>
      </div>
      {getDeposit.error && (
        <SystemMessage testId="deposit" message={userError(getDeposit.error)} />
      )}
      {showConfim && getDeposit.data && (
        <ConfirmDepositPlate
          state={state}
          getDepositData={getDeposit.data}
          close={() => setShowConfim(false)}
          postDeposit={postDeposit.mutate}
        />
      )}
      <PostDepositStatusPlate state={state} postDeposit={postDeposit} />
    </>
  );
};

export default DepositContent;
