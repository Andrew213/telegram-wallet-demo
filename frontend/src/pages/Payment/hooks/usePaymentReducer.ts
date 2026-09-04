import {GetAccount, GetOutputPaymethods, PostPayment} from "@api/requests";
import {useReducer} from "react";

export type Dispatch = ReturnType<typeof usePaymentReducer>[1];

export default function usePaymentReducer(
  balances: GetAccount.Balance[],
  paymethods: GetOutputPaymethods.Paymethod[],
) {
  return useReducer(reducer, {balances, paymethods}, getInitialState);
}

export type PaywayConfigFieldInputWithValues =
  GetOutputPaymethods.PaywayConfigFieldInput & {
    value: string;
    valueMasked: string;
    touched: boolean;
    valid: boolean;
  };
export type PaywayConfigFieldSelectWithValues =
  GetOutputPaymethods.PaywayConfigFieldSelect & {
    value: string;
  };
type PaywayConfigFieldWithValues =
  | PaywayConfigFieldInputWithValues
  | PaywayConfigFieldSelectWithValues;
type PaywayWithValues = GetOutputPaymethods.Payway & {
  config: Record<string, PaywayConfigFieldWithValues>;
};
type Amount = {
  type: "receive" | "write_off";
  value: bigint;
};
export type State = {
  balance: GetAccount.Balance;
  amount: Amount;

  paymethods: GetOutputPaymethods.Paymethod[];
  paymethod: GetOutputPaymethods.Paymethod;
  payway: PaywayWithValues;

  description: string;
};

type ChangeBalanceAction = {
  type: "ChangeBalance";
  payload: GetAccount.Balance;
};
type ChangeAmountAction = {
  type: "ChangeAmount";
  payload: Amount;
};
type ChangePaymethodAction = {
  type: "ChangePaymethod";
  payload: GetOutputPaymethods.Paymethod;
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
type ChangeDescriptionAction = {
  type: "ChangeDescription";
  payload: string;
};

type Action =
  | ChangeBalanceAction
  | ChangeAmountAction
  | ChangePaymethodAction
  | ChangePaywayAction
  | PatchPaywayConfigFieldAction
  | ChangeDescriptionAction;

const getInitialState = (params: {
  balances: GetAccount.Balance[];
  paymethods: GetOutputPaymethods.Paymethod[];
}): State => ({
  balance: params.balances[0],
  amount: {
    type: "receive",
    value: BigInt("0"),
  },

  paymethods: params.paymethods,
  paymethod: params.paymethods[0],
  payway: addValuesToConfig(params.paymethods[0].payways[0]),
  description: "",
});

export function addValuesToConfig(
  payway: GetOutputPaymethods.Payway,
): PaywayWithValues {
  return {
    ...payway,
    config: Object.fromEntries(
      Object.entries(payway.config).map(([key, v]) => [
        key,
        GetOutputPaymethods.isPaywayConfigFieldSelect(v)
          ? {
              ...v,
              value: v.options[0].value,
            }
          : {
              ...v,
              value: "",
              valueMasked: "",
              touched: false,
              valid: false,
            },
      ]),
    ),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ChangeBalance": {
      return {
        ...state,
        balance: action.payload,
        amount: {
          type: "receive",
          value: BigInt("0"),
        },
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
        amount: {
          type: "receive",
          value: BigInt("0"),
        },
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
    case "ChangeDescription": {
      if (action.payload.length > PostPayment.MAX_DESCRIPTION_LENGTH) {
        return {
          ...state,
        };
      }

      return {
        ...state,
        description: action.payload,
      };
    }
  }
}
