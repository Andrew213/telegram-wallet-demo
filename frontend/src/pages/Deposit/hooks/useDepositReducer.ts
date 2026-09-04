import {GetAccount, GetInputPaymethods} from "@api/requests";
import {useReducer} from "react";

export type Dispatch = ReturnType<typeof useDepositReducer>[1];

export default function useDepositReducer(
  balances: GetAccount.Balance[],
  paymethods: GetInputPaymethods.Paymethod[],
) {
  return useReducer(reducer, {balances, paymethods}, getInitialState);
}

export type PaywayConfigFieldInputWithValues =
  GetInputPaymethods.PaywayConfigFieldInput & {
    value: string;
    touched: boolean;
    valid: boolean;
  };
export type PaywayConfigFieldSelectWithValues =
  GetInputPaymethods.PaywayConfigFieldSelect & {
    value: string;
  };

type PaywayConfigFieldWithValues =
  | PaywayConfigFieldInputWithValues
  | PaywayConfigFieldSelectWithValues;
type PaywayWithValues = GetInputPaymethods.Payway & {
  config: Record<string, PaywayConfigFieldWithValues>;
};

export type State = {
  balance: GetAccount.Balance;
  amount: bigint;

  paymethods: GetInputPaymethods.Paymethod[];
  paymethod: GetInputPaymethods.Paymethod;
  payway: PaywayWithValues;
};

type SelectTargetBalanceAction = {
  type: "SelectBalance";
  payload: GetAccount.Balance;
};

type ChangeAmountAction = {
  type: "ChangeAmount";
  payload: bigint;
};

type ChangePaymethodAction = {
  type: "ChangePaymethod";
  payload: GetInputPaymethods.Paymethod;
};

type ChangePaywayAction = {
  type: "ChangePayway";
  payload: PaywayWithValues;
};

type PatchPaywayConfigFieldAction = {
  type: "PatchPaywayConfigField";
  payload: {
    key: string;
    configFieldPatch: Partial<PaywayConfigFieldWithValues>;
  };
};

type Action =
  | SelectTargetBalanceAction
  | ChangeAmountAction
  | ChangePaymethodAction
  | ChangePaywayAction
  | PatchPaywayConfigFieldAction;

const getInitialState = (params: {
  balances: GetAccount.Balance[];
  paymethods: GetInputPaymethods.Paymethod[];
}): State => ({
  balance: params.balances[0],
  amount: BigInt("0"),

  paymethods: params.paymethods,
  paymethod: params.paymethods[0],
  payway: addValuesToConfig(params.paymethods[0].payways[0]),
});

export function addValuesToConfig(
  payway: GetInputPaymethods.Payway,
): PaywayWithValues {
  return {
    ...payway,
    config: Object.fromEntries(
      Object.entries(payway.config).map(([key, v]) => [
        key,
        GetInputPaymethods.isPaywayConfigFieldSelect(v)
          ? {
              ...v,
              value: v.options[0].value,
            }
          : {
              ...v,
              value: "",
              touched: false,
              valid: false,
            },
      ]),
    ),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SelectBalance": {
      return {
        ...state,
        balance: action.payload,
        amount: BigInt("0"),
      };
    }
    case "ChangeAmount": {
      return {
        ...state,
        amount: action.payload,
      };
    }
    case "ChangePaymethod": {
      return {
        ...state,
        paymethod: action.payload,
        payway: addValuesToConfig(action.payload.payways[0]),
      };
    }
    case "ChangePayway": {
      return {
        ...state,
        payway: action.payload,
      };
    }
    case "PatchPaywayConfigField": {
      return {
        ...state,
        payway: {
          ...state.payway,
          config: {
            ...state.payway.config,
            [action.payload.key]: {
              ...state.payway.config[action.payload.key],
              ...action.payload.configFieldPatch,
            } as PaywayConfigFieldWithValues,
          },
        },
      };
    }
  }
}
