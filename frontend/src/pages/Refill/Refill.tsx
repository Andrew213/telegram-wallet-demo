import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

import {Currency, GetAccount, GetInputPaymethods} from "@/api/requests";
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

import useGetAccount from "../hooks/useGetAccount";
import Block from "../ui/Block";
import WithLabel from "../ui/WithLabel";
import NotVerifiedNotification from "./components/NotVerifiedNotification";
import useGetDeposit from "./hooks/useGetDeposit";
import useGetPaymethods from "./hooks/useGetPaymethods";
import useGetPaywayInfoAndWarning from "./hooks/useGetPaywayInfoAndWarning";
import usePostDeposit from "./hooks/usePostDeposit";
import useRefillReducer, {addValuesToConfig} from "./hooks/useRefillReducer";
import {
  balanceToOption,
  depositDisabled,
  filterPaymethods,
  hideAmount,
  paymethodToOption,
} from "./utils";

const RefillContainer: React.FC = () => {
  const getAccount = useGetAccount();
  const getPaymethods = useGetPaymethods();
  const openLink = useOpenLink();

  const filteredPaymethods = useMemo(() => {
    if (!getAccount.data || !getPaymethods.data) {
      return undefined;
    }

    return filterPaymethods(getPaymethods.data, getAccount.data);
  }, [getAccount.data, getPaymethods.data]);

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

  if (!getAccount.data || !filteredPaymethods) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <Refil
      status={getAccount.data.status}
      paymethods={filteredPaymethods}
      balances={getAccount.data.balances}
    />
  );
};

interface Props {
  status: GetAccount.AccountStatus;
  balances: GetAccount.Balance[];
  paymethods: GetInputPaymethods.Paymethod[];
}

const Refil: React.FC<Props> = props => {
  const {status, balances, paymethods} = props;
  const navigate = useNavigate();
  const openLink = useOpenLink();
  const [showConfim, setShowConfim] = useState(false);
  const {state: locationState} = useLocation();

  const [state, dispatch] = useRefillReducer(balances, paymethods);
  const postDeposit = usePostDeposit(openLink);
  const getDeposit = useGetDeposit(state);
  const getInfoAndWarning = useGetPaywayInfoAndWarning(state);

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
            <WithLabel label="Баланс пополнения">
              <SelectWallet
                value={balanceToOption(state.balance)}
                options={balances.map(balanceToOption)}
                onChange={v =>
                  dispatch({
                    type: "SelectBalance",
                    payload: balances.find(o => o.id === v)!,
                  })
                }
                activeType="OUTLINE"
                title="Выбор баланса"
              />
            </WithLabel>
            <WithLabel label="Сумма пополнения">
              <AmountInput
                value={state.amount}
                onChange={value =>
                  dispatch({
                    type: "ChangeAmount",
                    payload: value,
                  })
                }
                postfix={state.balance.alias}
                placeholder={`0 ${state.balance.alias}`}
                formater={formatThousands}
                bgColor="white"
                hint={[
                  // `Остаток лимита: ${formatThousands(state.balance.remainder ?? 0)} ${state.balance.alias}`,
                  `Пополнение от ${formatThousands(state.payway.min_amount)} до ${formatThousands(state.payway.max_amount)} ${state.payway.currency}`,
                  `Курс обмена: 1 ${state.balance.alias} = ${getDeposit.isSuccess && getDeposit.data ? getDeposit.data.rate : "*"} ${state.payway.currency}`,
                ].join("\n")}
              />
            </WithLabel>
          </Block>
          <Block>
            <WithLabel label="Метод оплаты">
              <SelectWallet
                value={paymethodToOption(state.paymethod)}
                options={state.paymethods.map(paymethodToOption)}
                onChange={v =>
                  dispatch({
                    type: "ChangePaymethod",
                    payload: state.paymethods.find(p => p.id === v)!,
                  })
                }
                activeType="CHECK"
                title="Метод оплаты"
              />
            </WithLabel>
            {Object.entries(state.payway.config).map(([key, configField]) => {
              if (GetInputPaymethods.isPaywayConfigFieldSelect(configField)) {
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
                  key={key}
                  label={configField.titles?.ru ?? configField.label?.ru ?? ""}>
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
                Валюта пополнения
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
              {getInfoAndWarning.data?.warning?.text?.ru && (
                <Markup className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-rose-100 p-4 text-p3 font-p3 text-grey-600">
                  {getInfoAndWarning.data?.warning?.text?.ru}
                </Markup>
              )}
              {getInfoAndWarning.data?.info?.text?.ru && (
                <Markup className="mx-4 whitespace-pre text-wrap break-words rounded-8 bg-yellow-100 p-4 text-p3 font-p3 text-grey-600">
                  {getInfoAndWarning.data?.info?.text?.ru}
                </Markup>
              )}
            </div>
          </Block>
        </div>
        <div className="rounded-t-6 bg-white px-4 pb-4 pt-6">
          <Button
            color="primary"
            size="lg"
            onClick={() => setShowConfim(true)}
            disabled={depositDisabled(state, getDeposit)}>
            {"Перейти к оплате: "}
            {getDeposit.isStuck ? (
              <Spiner height={20} width={20} />
            ) : (
              `${hideAmount(state, getDeposit) ? 0 : formatThousands(getDeposit.data!.amount)} ${state.payway.currency}`
            )}
          </Button>
        </div>
      </div>
      {getDeposit.error && <SystemMessage message={getDeposit.error.message} />}
      {showConfim && getDeposit.data && (
        <ConfirmPlate
          close={() => setShowConfim(false)}
          {...(Currency.getIcon(state.balance.alias) !== undefined
            ? {
                icon: Currency.getIcon(state.balance.alias)!,
              }
            : {
                iconNode: (
                  <div className="flex size-20 items-center justify-center rounded-8 bg-grey-400 text-h1 font-h1 text-white">
                    {state.balance.alias}
                  </div>
                ),
              })}
          title="Пополнение баланса"
          subTitle={
            Currency.getRuName(state.balance.code) ?? `${state.balance.alias}`
          }
          fields={[
            {
              label: "Метод пополнения",
              value: state.paymethod.name,
            },
            {
              label: "Сумма пополнения",
              value: `${formatThousands(state.amount)} ${state.balance.alias}`,
            },
            {
              label: "К оплате",
              value: `${formatThousands(getDeposit.data.amount)} ${getDeposit.data.currency}`,
            },
          ]}
          fieldSize="lg"
          confirmText={`Оплатить ${formatThousands(getDeposit.data.amount)} ${getDeposit.data.currency}`}
          onConfirm={() => {
            postDeposit.mutate({
              data: {
                amount: bigintToNumber(state.amount),
                currency: state.balance.code,
                paymethod_id: state.paymethod.id,
                payer_currency: state.payway.code,
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
      {postDeposit.isPending && (
        <StatusPlate
          status="PENDING"
          title="Пополнение в обработке..."
          subTitle={
            "Если выполнение запроса занимает слишком много времени, пожалуйста, обратитесь в службу поддержки"
          }
          onButtonClick={() => navigate("/")}
          buttonText="Вернуться на главную"
        />
      )}
      {postDeposit.isError && (
        <StatusPlate
          status="ERROR"
          title="Что-то пошло не так"
          subTitle={`По какой-то причине мы не смогли обработать ваше пополнение на ${formatThousands(state.amount)} ${state.balance.alias}, попробуйте снова. В случае возникновения вопросов обратитесь в службу поддержки`}
          onButtonClick={() => navigate("/")}
          buttonText="Вернуться на главную"
        />
      )}
    </>
  );
};

export default RefillContainer;


