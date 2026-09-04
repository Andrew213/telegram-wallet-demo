import {
  Currency,
  GetBillDetails,
  GetBills,
  GetDeposit,
  GetDepositDetails,
  GetDeposits,
  GetPayment,
  GetPaymentDetails,
  GetPayments,
  GetStatements,
  PostDeposit,
  PostPayment,
  PutBillDetailed,
} from "@/api/requests";

import {adjustDemoBalance, getDemoBalances} from "./balances";
import {getDemoCurrencyAlias, matchesDemoCurrency} from "./currency";
import {localized} from "./localized";

type PageParams = {
  id?: number;
  last_id?: number;
  created_from?: number;
  created_to?: number;
  limit?: number;
};

const now = Math.floor(Date.now() / 1000);
const day = 24 * 60 * 60;

let nextDepositId = 9004;
let nextPaymentId = 9104;

const demoDeposits: GetDeposits.Deposit[] = [
  {
    id: 9001,
    created: now - day,
    shop_order_id: "DEP-DEMO-001",
    account: "Bank Card",
    paymethod_id: 101,
    paymethod_type: "deposit",
    receive_amount: 250,
    receive_currency: "USD",
    write_off_amount: 250,
    write_off_currency: "USD",
    status: GetDeposits.statusNameToStatusCodeMap.Successful,
  },
  {
    id: 9002,
    created: now - 2 * day,
    shop_order_id: "DEP-DEMO-002",
    account: "Digital Wallet",
    paymethod_id: 103,
    paymethod_type: "deposit",
    receive_amount: 100,
    receive_currency: "EUR",
    write_off_amount: 100,
    write_off_currency: "EUR",
    status: GetDeposits.statusNameToStatusCodeMap.Waiting,
  },
  {
    id: 9003,
    created: now - 3 * day,
    shop_order_id: "DEP-DEMO-003",
    account: "Bank Transfer",
    paymethod_id: 102,
    paymethod_type: "deposit",
    receive_amount: 75,
    receive_currency: "USDT",
    write_off_amount: 75,
    write_off_currency: "USDT",
    status: GetDeposits.statusNameToStatusCodeMap.Rejected,
  },
];

const demoPayments: GetPayments.Payment[] = [
  {
    id: 9101,
    created: now - 4 * day,
    receive_amount: 120,
    receive_currency: "USD",
    write_off_amount: 122.8,
    write_off_currency: "USD",
    account: "4242 4242 4242 4242",
    is_account_transfer: false,
    paymethod_id: 201,
    status: GetPayments.statusNameToStatusCodeMap.Successful,
  },
  {
    id: 9102,
    created: now - 5 * day,
    receive_amount: 50,
    receive_currency: "EUR",
    write_off_amount: 50,
    write_off_currency: "EUR",
    account: "700000002",
    is_account_transfer: true,
    paymethod_id: 202,
    status: GetPayments.statusNameToStatusCodeMap.Waiting,
  },
  {
    id: 9103,
    created: now - 6 * day,
    receive_amount: 25,
    receive_currency: "USDT",
    write_off_amount: 26,
    write_off_currency: "USDT",
    account: "TQDemoWalletAddress123",
    is_account_transfer: false,
    paymethod_id: 203,
    status: GetPayments.statusNameToStatusCodeMap.Rejected,
  },
];

const demoBills: GetBills.Bill[] = [
  {
    id: 9201,
    created: now - 7 * day,
    expired: now + 2 * day,
    shop_order_id: "INV-DEMO-001",
    account: "Demo Merchant",
    receive_amount: 60,
    receive_currency: "USD",
    write_off_amount: 60,
    write_off_currency: "USD",
    status: GetBills.statusNameToStatusCodeMap.Waiting,
    encoded_id: "demo-bill-9201",
  },
  {
    id: 9202,
    created: now - 8 * day,
    expired: now - 6 * day,
    shop_order_id: "INV-DEMO-002",
    account: "Demo Merchant",
    receive_amount: 35,
    receive_currency: "EUR",
    write_off_amount: 35,
    write_off_currency: "EUR",
    status: GetBills.statusNameToStatusCodeMap.Successful,
    encoded_id: "demo-bill-9202",
  },
  {
    id: 9203,
    created: now - 9 * day,
    expired: now - 7 * day,
    shop_order_id: "INV-DEMO-003",
    account: "Demo Merchant",
    receive_amount: 18,
    receive_currency: "USDT",
    write_off_amount: 18,
    write_off_currency: "USDT",
    status: GetBills.statusNameToStatusCodeMap.Rejected,
    encoded_id: "demo-bill-9203",
  },
];

const demoStatements: GetStatements.Statement[] = [
  {
    id: 9301,
    created: now - day,
    amount: 250,
    balance_amount: 1250.5,
    currency: "USD",
    is_deposit: true,
    operation_class:
      GetStatements.operationClassNameToOperationClassCodeMap.Deposit,
    operation_type: 1,
    shop_operation_id: "DEP-DEMO-001",
  },
  {
    id: 9302,
    created: now - 4 * day,
    amount: 122.8,
    balance_amount: 1000.5,
    currency: "USD",
    is_deposit: false,
    operation_class:
      GetStatements.operationClassNameToOperationClassCodeMap.Withdraw,
    operation_type: 2,
    shop_operation_id: "PAY-DEMO-001",
  },
];

function roundAmount(value: number) {
  return Number(value.toFixed(2));
}

function normalizeAlias(
  currency: Currency.Alias | {alias?: Currency.Alias | null} | null | undefined,
): NonNullable<Currency.Alias> {
  if (typeof currency === "string") {
    return currency;
  }

  if (currency && typeof currency === "object") {
    return currency.alias ?? "USD";
  }

  return "USD";
}

function paginate<T extends {id: number; created: number}>(
  items: T[],
  params?: PageParams,
) {
  let result = [...items]
    .filter(item => (params?.id ? item.id === params.id : true))
    .filter(item =>
      params?.created_from ? item.created >= params.created_from : true,
    )
    .filter(item =>
      params?.created_to ? item.created <= params.created_to : true,
    )
    .sort((a, b) => b.created - a.created);

  if (params?.last_id) {
    const lastIndex = result.findIndex(item => item.id === params.last_id);
    result = lastIndex >= 0 ? result.slice(lastIndex + 1) : result;
  }

  return result.slice(0, params?.limit ?? result.length);
}

export function getDemoDepositQuote(
  params: GetDeposit.Params,
): GetDeposit.Response {
  return {
    amount: roundAmount(params.amount),
    commission: 0,
    currency: getDemoCurrencyAlias(params.currency),
    rate: 1,
  };
}

export function createDemoDeposit(params: {
  data: PostDeposit.BodyRequired;
  config: PostDeposit.BodyOptional;
}): PostDeposit.Response {
  const quote = getDemoDepositQuote(params.data);
  const id = nextDepositId++;
  const currency = getDemoCurrencyAlias(params.data.currency);
  const payerCurrency = getDemoCurrencyAlias(params.data.payer_currency);

  demoDeposits.unshift({
    id,
    created: Math.floor(Date.now() / 1000),
    shop_order_id: `DEP-DEMO-${id}`,
    account: params.config.email || "Demo payer",
    paymethod_id: "paymethod_id" in params.data ? params.data.paymethod_id : 0,
    paymethod_type: "deposit",
    receive_amount: quote.amount,
    receive_currency: currency,
    write_off_amount: params.data.amount,
    write_off_currency: payerCurrency,
    status: GetDeposits.statusNameToStatusCodeMap.Successful,
  });
  adjustDemoBalance(params.data.currency, quote.amount);

  return {
    id,
    method: "GET",
    url: `#demo-deposit-${id}`,
    data: {},
  };
}

export function getDemoDeposits(params?: GetDeposits.Params) {
  return paginate(demoDeposits, params)
    .filter(item => (params?.status ? item.status === params.status : true))
    .filter(item =>
      params?.source_currency
        ? matchesDemoCurrency(
            item.write_off_currency ?? "USD",
            params.source_currency,
          )
        : true,
    )
    .filter(item =>
      params?.target_currency
        ? matchesDemoCurrency(
            item.receive_currency ?? "USD",
            params.target_currency,
          )
        : true,
    );
}

export function getDemoDepositDetails(
  params: GetDepositDetails.Params,
): GetDepositDetails.Response {
  const deposit = demoDeposits.find(item => item.id === params.id);
  const fallback = deposit ?? demoDeposits[0];

  return {
    id: fallback.id,
    status: fallback.status,
    created: fallback.created,
    processed:
      fallback.status === GetDeposits.statusNameToStatusCodeMap.Successful
        ? fallback.created + 90
        : null,
    shop_order_id: fallback.shop_order_id,
    account: fallback.account,
    receive_amount: fallback.receive_amount,
    receive_currency: {
      alias: fallback.receive_currency,
    },
    write_off_amount: fallback.write_off_amount,
    write_off_currency: {
      alias: fallback.write_off_currency,
    },
    config: {
      channel: "Demo payment rail",
    },
    additional_data: {
      bank: "Bank Card",
      receipt_url: null,
      requisites: "Demo requisites",
    },
  };
}

export function getDemoPaymentQuote(
  params: GetPayment.Params,
): GetPayment.Response {
  const feePercent = params.paymethod_type === "account_transfer" ? 0 : 0.015;
  const fee = params.paymethod_type === "account_transfer" ? 0 : 1;

  if (params.amount_type === "receive") {
    return {
      receive_amount: roundAmount(params.amount),
      write_off_amount: roundAmount(params.amount * (1 + feePercent) + fee),
    };
  }

  return {
    receive_amount: roundAmount(
      Math.max(0, params.amount - params.amount * feePercent - fee),
    ),
    write_off_amount: roundAmount(params.amount),
  };
}

export function createDemoPayment(params: {
  data: PostPayment.BodyRequired;
  config: PostPayment.BodyOptional;
}): PostPayment.Response {
  if (params.data.gcode && params.data.gcode !== "123456") {
    const error = new Error("Invalid demo verification code") as Error & {
      error_code: number;
      translatedCodes: number[];
    };
    error.error_code = PostPayment.errorNameToErrorCodeMap.invalidGcode;
    error.translatedCodes = [PostPayment.errorNameToErrorCodeMap.invalidGcode];
    throw error;
  }

  const quote = getDemoPaymentQuote(params.data);
  const id = nextPaymentId++;
  const sourceCurrency = getDemoCurrencyAlias(params.data.source_currency);
  const targetCurrency = getDemoCurrencyAlias(
    params.data.target_currency ?? params.data.source_currency,
  );

  demoPayments.unshift({
    id,
    created: Math.floor(Date.now() / 1000),
    receive_amount: quote.receive_amount,
    receive_currency: targetCurrency,
    write_off_amount: quote.write_off_amount,
    write_off_currency: sourceCurrency,
    account:
      params.config.payee_account ||
      params.config.card_number ||
      params.config.wallet_address ||
      "Demo recipient",
    is_account_transfer: params.data.paymethod_type === "account_transfer",
    paymethod_id: "paymethod_id" in params.data ? params.data.paymethod_id : 0,
    status: GetPayments.statusNameToStatusCodeMap.Successful,
  });
  adjustDemoBalance(params.data.source_currency, -quote.write_off_amount);

  return quote;
}

export function getDemoPayments(params?: GetPayments.Params) {
  return paginate(demoPayments, params)
    .filter(item => (params?.status ? item.status === params.status : true))
    .filter(item =>
      params?.source_currency
        ? matchesDemoCurrency(
            item.write_off_currency ?? "USD",
            params.source_currency,
          )
        : true,
    )
    .filter(item =>
      params?.target_currency
        ? matchesDemoCurrency(
            item.receive_currency ?? "USD",
            params.target_currency,
          )
        : true,
    );
}

export function getDemoPaymentDetails(
  params: GetPaymentDetails.Params,
): GetPaymentDetails.Response {
  const payment = demoPayments.find(item => item.id === params.id);
  const fallback = payment ?? demoPayments[0];

  return {
    id: fallback.id,
    status: fallback.status,
    created: fallback.created,
    processed:
      fallback.status === GetPayments.statusNameToStatusCodeMap.Successful
        ? fallback.created + 120
        : null,
    shop_order_id: `PAY-DEMO-${fallback.id}`,
    account: fallback.account,
    receive_amount: fallback.receive_amount,
    receive_currency: {
      alias: fallback.receive_currency,
    },
    write_off_amount: fallback.write_off_amount,
    write_off_currency: {
      alias: fallback.write_off_currency,
    },
    config: {
      account: fallback.account,
    },
    rejected_reason:
      fallback.status === GetPayments.statusNameToStatusCodeMap.Rejected
        ? localized("Demo transaction failed validation.")
        : null,
  };
}

export function getDemoBills(params?: GetBills.Params) {
  return paginate(demoBills, params)
    .filter(item => (params?.status ? item.status === params.status : true))
    .filter(item =>
      params?.source_currency
        ? matchesDemoCurrency(
            normalizeAlias(item.write_off_currency),
            params.source_currency,
          )
        : true,
    )
    .filter(item =>
      params?.target_currency
        ? matchesDemoCurrency(
            normalizeAlias(item.receive_currency),
            params.target_currency,
          )
        : true,
    );
}

export function getDemoBillDetails(
  params: GetBillDetails.Params,
): GetBillDetails.Response {
  const bill = demoBills.find(item => item.id === params.id);
  const fallback = bill ?? demoBills[0];
  const receiveAlias = normalizeAlias(fallback.receive_currency);
  const writeOffAlias = normalizeAlias(fallback.write_off_currency);

  return {
    id: fallback.id,
    status: fallback.status,
    created: fallback.created,
    processed:
      fallback.status === GetBills.statusNameToStatusCodeMap.Successful
        ? fallback.created + 180
        : null,
    expired: fallback.expired,
    shop_order_id: fallback.shop_order_id,
    account: fallback.account,
    receive_amount: fallback.receive_amount,
    receive_currency: {
      alias: receiveAlias,
      code:
        receiveAlias === "EUR"
          ? Currency.nameToCodeMap.Euro
          : receiveAlias === "USDT"
            ? Currency.nameToCodeMap.Usdt
            : Currency.nameToCodeMap.USADollar,
    },
    write_off_amount: fallback.write_off_amount,
    write_off_currency: {
      alias: writeOffAlias,
      code:
        writeOffAlias === "EUR"
          ? Currency.nameToCodeMap.Euro
          : writeOffAlias === "USDT"
            ? Currency.nameToCodeMap.Usdt
            : Currency.nameToCodeMap.USADollar,
    },
    shop: {
      id: 501,
      name: "Demo Merchant",
    },
  };
}

export function getDemoBillDetailed(
  encodedBillId: string,
): PutBillDetailed.Response {
  const bill =
    demoBills.find(item => item.encoded_id === encodedBillId) ?? demoBills[0];

  return {
    account: bill.account,
    allowed_balances: getDemoBalances().map(balance => ({
      write_off_amount: balance.available,
      write_off_currency: {
        alias: balance.alias,
        code: balance.code,
      },
    })),
    status: bill.status,
    description: "Demo invoice for showcase testing",
    expired: bill.expired,
    id: bill.id,
    is_balance_allowed: true,
    receive_amount: bill.receive_amount,
    receive_currency: bill.receive_currency,
    shop_order_id: bill.shop_order_id ?? `INV-DEMO-${bill.id}`,
    write_off_amount: bill.write_off_amount,
    write_off_currency: bill.write_off_currency,
  };
}

export function payDemoBill(encodedBillId: string) {
  demoBills.forEach(bill => {
    if (bill.encoded_id === encodedBillId) {
      bill.status = GetBills.statusNameToStatusCodeMap.Successful;
    }
  });

  return {
    shop_url: null,
  };
}

export function cancelDemoBill(encodedBillId: string) {
  demoBills.forEach(bill => {
    if (bill.encoded_id === encodedBillId) {
      bill.status = GetBills.statusNameToStatusCodeMap.Rejected;
    }
  });

  return {
    shop_url: null,
  };
}

export function getDemoStatements(params: GetStatements.Params) {
  return paginate(demoStatements, params)
    .filter(item =>
      params.operation_class
        ? item.operation_class === params.operation_class
        : true,
    )
    .filter(item =>
      params.currency
        ? matchesDemoCurrency(item.currency, params.currency)
        : true,
    );
}

export function getDemoStatementDetails(
  params: GetStatements.Params & {id: number},
) {
  const statement = demoStatements.find(item => item.id === params.id);
  const fallback = statement ?? demoStatements[0];

  return {
    id: fallback.id,
    created: fallback.created,
    amount: fallback.amount,
    currency: {
      alias: fallback.currency,
    },
    balance_amount: fallback.balance_amount,
    is_deposit: fallback.is_deposit,
    operation_class: fallback.operation_class,
    shop_operation_id: fallback.shop_operation_id,
  };
}
