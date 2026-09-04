import {
  Currency,
  GetInputPaymethods,
  GetOutputPaymethods,
} from "@/api/requests";

import {localized} from "./localized";

const paymentCurrencyCodes = [
  Currency.nameToCodeMap.USADollar,
  Currency.nameToCodeMap.Euro,
  Currency.nameToCodeMap.Usdt,
];

const paymentCurrencyAliases = ["USD", "EUR", "USDT"] as const;

export const demoInputPaymethods: GetInputPaymethods.Paymethod[] = [
  {
    id: 101,
    name: "Bank Card",
    verify_required: false,
    payways: paymentCurrencyCodes.map((code, index) => ({
      id: 1001 + index,
      code,
      currency: paymentCurrencyAliases[index],
      config: {},
      min_amount: 10,
      max_amount: 5000,
      info_id: 1,
      warning_id: null,
    })),
  },
  {
    id: 102,
    name: "Bank Transfer",
    verify_required: false,
    payways: paymentCurrencyCodes.map((code, index) => ({
      id: 1101 + index,
      code,
      currency: paymentCurrencyAliases[index],
      config: {},
      min_amount: 25,
      max_amount: 10000,
      info_id: 1,
      warning_id: null,
    })),
  },
  {
    id: 103,
    name: "Digital Wallet",
    verify_required: false,
    payways: paymentCurrencyCodes.map((code, index) => ({
      id: 1201 + index,
      code,
      currency: paymentCurrencyAliases[index],
      config: {
        email: {
          label: localized("Wallet email"),
          example: "wallet@example.com",
          regex: "^.+@.+\\..+$",
        },
      },
      min_amount: 5,
      max_amount: 3000,
      info_id: 1,
      warning_id: null,
    })),
  },
];

export const demoOutputPaymethods: GetOutputPaymethods.Paymethod[] = [
  {
    id: 201,
    name: "Bank Card",
    is_transfer_paymethod: false,
    payways: paymentCurrencyCodes.map((code, index) => ({
      id: 2001 + index,
      code,
      currency: paymentCurrencyAliases[index],
      config: {
        card_number: {
          label: localized("Card number"),
          example: "4242 4242 4242 4242",
          regex: "^\\d{12,19}$",
        },
      },
      fix: 1,
      percent: 1.5,
      min: 1,
      min_amount: 10,
      max_amount: 5000,
      info_id: 2,
    })),
  },
  {
    id: 202,
    name: "Wallet Transfer",
    is_transfer_paymethod: true,
    payways: paymentCurrencyCodes.map((code, index) => ({
      id: 2101 + index,
      code,
      currency: paymentCurrencyAliases[index],
      config: {
        payee_account: {
          label: localized("Recipient wallet"),
          example: "700000002",
          regex: "^\\d{6,12}$",
        },
      },
      fix: 0,
      percent: 0,
      min: 0,
      min_amount: 1,
      max_amount: 10000,
      info_id: null,
    })),
  },
  {
    id: 203,
    name: "Crypto Wallet",
    is_transfer_paymethod: false,
    payways: [
      {
        id: 2201,
        code: Currency.nameToCodeMap.Usdt,
        currency: "USDT",
        config: {
          wallet_address: {
            label: localized("Wallet address"),
            example: "TQDemoWalletAddress123",
            regex: "^.{8,}$",
          },
          network: {
            type: "select",
            title: "Network",
            titles: localized("Network"),
            options: [
              {
                value: "trc20",
                label: localized("TRC20 demo network"),
              },
              {
                value: "erc20",
                label: localized("ERC20 demo network"),
              },
            ],
          },
        },
        fix: 1,
        percent: 0,
        min: 1,
        min_amount: 10,
        max_amount: 5000,
        info_id: 2,
      },
    ],
  },
];
