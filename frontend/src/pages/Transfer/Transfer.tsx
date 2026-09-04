import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {GetAccount, GetOutputPaymethods, PostPayment} from "@/api/requests";
import {parseMask} from "@/api/services/PaymethodService";
import AmountInput from "@/components/AmountInput/AmountInput";
import Button from "@/components/Button/Button";
import ConfirmPlate from "@/components/ConfirmPlate/ConfirmPlate";
import Input from "@/components/Input/Input";
import Markup from "@/components/Markup/Markup";
import SelectCurrency from "@/components/SelectCurrency/SelectCurrency";
import SelectWallet from "@/components/SelectWallet/SelectWallet";
import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import StatusPlate from "@/components/StatusPlate/StatusPlate";
import SystemMessage from "@/components/SystemMessage/SystemMessage";
import {useOpenLink} from "@/hooks";
import {bigintToNumber, formatThousands} from "@/utils";
import {getGenericPaymethodIcon} from "@/utils/paymethodIcon";

import useGetAccount from "../hooks/useGetAccount";
import Block from "../ui/Block";
import WithLabel from "../ui/WithLabel";
import Google2FAPlate from "./components/Google2FAPlate";
import useGetPayment from "./hooks/useGetPayment";
import useGetPaymethods from "./hooks/useGetPaymethods";
import useGetPaywayInfo from "./hooks/useGetPaywayInfo";
import usePostPayment from "./hooks/usePostPayment";
import useTransferReducer, {
  addValuesToConfig,
} from "./hooks/useTransferReducer";
import {
  balanceToOption,
  getReceiveInputHint,
  getReceiveInputPlaceholder,
  hideAmount,
  paymentDisabled,
  paymethodToOption,
} from "./utils";

const TransferContainer: React.FC = () => {
  const openLink = useOpenLink();
  const getAccount = useGetAccount();
  const getPaymethods = useGetPaymethods();

  if (getAccount.data?.status === GetAccount.AccountStatus.blocked) {
    return (
      <StatusPage
        status="ERROR"
        title="Ваш аккаунт заблокирован"
        subTitle="Для восстановления доступа к фунциям приложения обратитесь в службу поддержки"
        button={{
          size: "lg",
          color: "primary",
          children: "Обратиться в поддержку",
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (getAccount.data?.status !== GetAccount.AccountStatus.verified) {
    return (
      <StatusPage
        status="LOCKED"
        title="Перевод пока недоступен"
        subTitle="Для вывода или перевода средств пройдите верификацию"
        button={{
          size: "lg",
          color: "primary",
          children: "Пройти верификацию",
          onClick: () => {
            openLink("#demo-verification");
          },
        }}
      />
    );
  }

  if (getAccount.isError || getPaymethods.isError) {
    return (
      <StatusPage
        status="ERROR"
        title="Что-то пошло не так"
        subTitle="Перезапустите приложение или обратитесь в службу поддержки"
        button={{
          size: "lg",
          color: "primary",
          children: "Обратиться в поддержку",
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (!getAccount.data || !getPaymethods.data) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <Transfer
      balances={getAccount.data.balances}
      auth_operations={getAccount.data.auth_operations}
      paymethods={getPaymethods.data}
    />
  );
};

interface Props {
  balances: GetAccount.Balance[];
  auth_operations: GetAccount.AuthOperations;
  paymethods: GetOutputPaymethods.Paymethod[];
}

const Transfer: React.FC<Props> = ({balances, auth_operations, paymethods}) => {
  const navigate = useNavigate();
  const [showConfirmPlate, setShowConfirmPlate] = useState(false);
  const [show2faPlate, setShow2faPlate] = useState({
    show: false,
    errorCode: undefined as undefined | PostPayment.ErrorCode,
  });

  const [state, dispatch] = useTransferReducer(balances, paymethods);
  const getPayment = useGetPayment(state);
  const postPayment = usePostPayment();
  const getPaywayInfo = useGetPaywayInfo(state);

  const {state: locationState} = useLocation();

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
            <WithLabel label="Платёжный метод получателя">
              <SelectWallet
                value={paymethodToOption(state.paymethod)}
                options={paymethods.map(paymethodToOption)}
                onChange={v =>
                  dispatch({
                    type: "ChangePaymethod",
                    payload: paymethods.find(o => o.id === v)!,
                  })
                }
                activeType="CHECK"
                title="Платёжный метод получателя"
              />
            </WithLabel>
            {Object.entries(state.payway.config).map(([key, configField]) => {
              if (GetOutputPaymethods.isPaywayConfigFieldSelect(configField)) {
                return (
                  <WithLabel
                    key={`${state.paymethod.id}-${state.payway.id}-${key}`}
                    label={configField.titles?.ru ?? configField.title}>
                    <SelectWallet
                      options={configField.options.map(({value, label}) => ({
                        value,
                        title: label.ru,
                      }))}
                      value={{
                        value: configField.value,
                        title: configField.options.find(
                          option => option.value === configField.value,
                        )!.label.ru,
                      }}
                      activeType="CHECK"
                      title={configField.titles?.ru ?? configField.title}
                      hint={configField.comment?.ru}
                      onChange={value =>
                        dispatch({
                          type: "PatchPaywayConfigField",
                          payload: {
                            key,
                            configFieldPatch: {
                              value,
                            },
                          },
                        })
                      }
                    />
                  </WithLabel>
                );
              }
              return (
                <WithLabel
                  key={`${state.paymethod.id}-${state.payway.id || state.payway.currency}-${key}`}
                  label={
                    configField.titles?.ru ??
                    configField.title ??
                    configField.label?.ru ??
                    ""
                  }>
                  <Input
                    value={configField.value}
                    onChange={value =>
                      dispatch({
                        type: "PatchPaywayConfigField",
                        payload: {
                          key,
                          configFieldPatch: {
                            value,
                            valid:
                              (Boolean(value) &&
                                RegExp(configField.regex ?? "").test(value)) ||
                              configField.valid,
                          },
                        },
                      })
                    }
                    placeholder={configField.example}
                    type="text"
                    bgColor="white"
                    hint={configField.comment?.ru}
                    mask={parseMask(configField.mask)}
                    error={
                      !configField.touched
                        ? undefined
                        : !configField.value
                          ? "Обязательное поле"
                          : !configField.valid
                            ? "Невалидный формат"
                            : undefined
                    }
                    onBlur={() =>
                      dispatch({
                        type: "PatchPaywayConfigField",
                        payload: {
                          key,
                          configFieldPatch: {
                            touched: true,
                            valid:
                              Boolean(configField.value) &&
                              RegExp(configField.regex ?? "").test(
                                configField.value,
                              ),
                          },
                        },
                      })
                    }
                  />
                </WithLabel>
              );
            })}
            <div className={"flex flex-col gap-4"}>
              <p className="px-4 text-p1 font-p1 text-grey-600">
                Валюта получения
              </p>
              <SelectCurrency
                currency={state.payway.code}
                currencies={state.paymethod.payways.map(p => ({
                  code: p.code,
                  alias: p.currency,
                }))}
                onChange={c =>
                  dispatch({
                    type: "ChangePayway",
                    payload: addValuesToConfig(
                      state.paymethod.payways.find(p => p.code === c)!,
                    ),
                  })
                }
              />
            </div>
            <WithLabel label="Сумма получения">
              <AmountInput
                value={
                  state.amount.type === "receive"
                    ? state.amount.value
                    : BigInt(0)
                }
                onChange={v =>
                  dispatch({
                    type: "ChangeAmount",
                    payload: {
                      type: "receive",
                      value: v,
                    },
                  })
                }
                postfix={state.payway.currency}
                placeholder={
                  state.amount.type !== "receive" &&
                  state.amount.value &&
                  !hideAmount(state, getPayment)
                    ? `${getPayment.data!.receive_amount} ${state.payway.currency}`
                    : getReceiveInputPlaceholder(state.payway)
                }
                formater={formatThousands}
                bgColor="white"
                hint={getReceiveInputHint(state.payway)}
                disabled={
                  state.amount.type !== "receive" && getPayment.isFetching
                }
                onFocus={() => {
                  if (state.amount.type === "receive") {
                    return;
                  }

                  dispatch({
                    type: "ChangeAmount",
                    payload: {
                      type: "receive",
                      value: BigInt(
                        !getPayment.data
                          ? 0
                          : Math.floor(getPayment.data.receive_amount),
                      ),
                    },
                  });
                }}
              />
            </WithLabel>
          </Block>
          <Block>
            <WithLabel label="Баланс списания">
              <SelectWallet
                value={balanceToOption(state.balance)}
                options={balances.map(balanceToOption)}
                onChange={v =>
                  dispatch({
                    type: "ChangeBalance",
                    payload: balances.find(o => o.id === v)!,
                  })
                }
                activeType="CHECK"
                title="Баланс списания"
              />
            </WithLabel>
            <WithLabel label="Сумма списания">
              <AmountInput
                value={
                  state.amount.type === "write_off"
                    ? state.amount.value
                    : BigInt(0)
                }
                onChange={v =>
                  dispatch({
                    type: "ChangeAmount",
                    payload: {
                      type: "write_off",
                      value: v,
                    },
                  })
                }
                postfix={state.balance.alias}
                placeholder={
                  state.amount.type !== "write_off" &&
                  state.amount.value &&
                  !hideAmount(state, getPayment)
                    ? `${getPayment.data!.write_off_amount} ${state.balance.alias}`
                    : "Введите сумму списания"
                }
                formater={formatThousands}
                bgColor="white"
                disabled={
                  state.amount.type !== "write_off" && getPayment.isFetching
                }
                onFocus={() => {
                  if (state.amount.type === "write_off") {
                    return;
                  }

                  dispatch({
                    type: "ChangeAmount",
                    payload: {
                      type: "write_off",
                      value: BigInt(
                        !getPayment.data
                          ? 0
                          : Math.floor(getPayment.data.write_off_amount),
                      ),
                    },
                  });
                }}
              />
            </WithLabel>
            <WithLabel label="Коментарий">
              <Input
                value={state.description}
                onChange={v =>
                  dispatch({
                    type: "ChangeDescription",
                    payload: v,
                  })
                }
                placeholder="Введите комментарий к платежу"
                type="text"
                bgColor="white"
              />
            </WithLabel>
            {getPaywayInfo.data?.text?.ru && (
              <Markup className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-yellow-100 p-4 text-p3 font-p3 text-grey-600 [&_img]:mx-auto [&_p:not(:first-child)]:mt-3.5 [&_p:not(:last-child)]:mb-3.5">
                {getPaywayInfo.data?.text?.ru}
              </Markup>
            )}
          </Block>
        </div>
        <div className="rounded-t-6 bg-white px-4 pb-4 pt-6">
          <Button
            color="primary"
            size="lg"
            onClick={() => setShowConfirmPlate(true)}
            disabled={paymentDisabled(state, getPayment)}>
            {"Перейти к оплате: "}
            {getPayment.isStuck ? (
              <Spiner height={20} width={20} />
            ) : (
              `${hideAmount(state, getPayment) ? 0 : formatThousands(getPayment.data!.write_off_amount)} ${state.balance.alias}`
            )}
          </Button>
        </div>
      </div>
      {getPayment.error && <SystemMessage message={getPayment.error.message} />}
      {showConfirmPlate && getPayment.data && (
        <ConfirmPlate
          close={() => setShowConfirmPlate(false)}
          icon={getGenericPaymethodIcon(state.paymethod.name)}
          title={state.paymethod.name}
          fields={[
            ...Object.values(state.payway.config).map(configField => ({
              label: GetOutputPaymethods.isPaywayConfigFieldSelect(configField)
                ? (configField.titles?.ru ?? configField.title ?? "")
                : (configField.titles?.ru ??
                  configField.title ??
                  configField.label?.ru ??
                  ""),
              value: GetOutputPaymethods.isPaywayConfigFieldSelect(configField)
                ? configField.options.find(
                    option => option.value === configField.value,
                  )!.label.ru
                : configField.value,
            })),
            {
              label: "Сумма получения",
              value: `${formatThousands(getPayment.data.receive_amount)} ${state.payway.currency}`,
            },
            {
              label: "Сумма списания",
              value: `${formatThousands(getPayment.data.write_off_amount)} ${state.balance.alias}`,
            },
            {
              label: "Комментарий",
              value: state.description,
            },
          ]}
          fieldSize="sm"
          confirmText={`Перевести ${formatThousands(getPayment.data.receive_amount)} ${state.payway.currency}`}
          onConfirm={() => {
            if (
              auth_operations[GetAccount.TwoFactorAction.PAYMENTS] ===
              GetAccount.TwoFactorType.GCODE
            ) {
              setShow2faPlate({show: true, errorCode: undefined});
              return;
            }

            postPayment.mutate({
              data: {
                amount: bigintToNumber(state.amount.value),
                amount_type: state.amount.type,
                source_currency: state.balance.code,
                target_currency: state.payway.code,
                paymethod_type: state.paymethod.is_transfer_paymethod
                  ? "account_transfer"
                  : "payout",
                paymethod_id: state.paymethod.id,
                description: state.description,
              },
              config: Object.fromEntries(
                Object.entries(state.payway.config).map(
                  ([key, configFeild]) => [key, configFeild.value],
                ),
              ),
            });
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
              {
                data: {
                  amount: bigintToNumber(state.amount.value),
                  amount_type: state.amount.type,
                  source_currency: state.balance.code,
                  target_currency: state.payway.code,
                  paymethod_type: state.paymethod.is_transfer_paymethod
                    ? "account_transfer"
                    : "payout",
                  paymethod_id: state.paymethod.id,
                  description: state.description,
                  gcode: gcode,
                },
                config: Object.fromEntries(
                  Object.entries(state.payway.config).map(
                    ([key, configFeild]) => [key, configFeild.value],
                  ),
                ),
              },
              {
                onSuccess: () =>
                  setShow2faPlate({show: false, errorCode: undefined}),
                onError: error => {
                  if (
                    (error as PostPayment.ResponseError).error_code ===
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
      {postPayment.isPending && (
        <StatusPlate
          status="PENDING"
          title="Платёж в обработке..."
          subTitle={
            "Если выполнение запроса занимает слишком много времени, пожалуйста, обратитесь в службу поддержки"
          }
          onButtonClick={() => navigate("/")}
          buttonText="Вернуться на главную"
        />
      )}
      {postPayment.isError &&
        (postPayment.error as PostPayment.ResponseError).error_code !==
          PostPayment.errorNameToErrorCodeMap.invalidGcode && (
          <StatusPlate
            status="ERROR"
            title="Что-то пошло не так"
            subTitle={
              "По какой-то причине мы не смогли обработать ваше пополнение, попробуйте снова. В случае возникновения вопросов обратитесь в службу поддержки"
            }
            onButtonClick={() => navigate("/")}
            buttonText="Вернуться на главную"
          />
        )}
      {postPayment.isSuccess && (
        <StatusPlate
          status="SUCCESS"
          title="Перевод прошёл успешно!"
          subTitle={""}
          onButtonClick={() => navigate("/")}
          buttonText="Вернуться на главную"
        />
      )}
    </>
  );
};

export default TransferContainer;



