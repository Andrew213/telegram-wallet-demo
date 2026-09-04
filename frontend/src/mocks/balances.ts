import {GetAccount} from "@/api/requests";

const initialDemoBalances: GetAccount.Balance[] = [
  {
    id: 1,
    code: 840,
    alias: "USD",
    available: 1250.5,
    hold: 0,
    displayed: true,
  },
  {
    id: 2,
    code: 978,
    alias: "EUR",
    available: 840.2,
    hold: 0,
    displayed: true,
  },
  {
    id: 3,
    code: 1001,
    alias: "USDT",
    available: 500,
    hold: 0,
    displayed: true,
  },
];

let demoBalances = initialDemoBalances.map(balance => ({...balance}));

export function getDemoBalances() {
  return demoBalances.map(balance => ({...balance}));
}

export function adjustDemoBalance(
  currencyCode: GetAccount.Balance["code"],
  delta: number,
) {
  demoBalances = demoBalances.map(balance =>
    balance.code === currencyCode
      ? {
          ...balance,
          available: Number((balance.available + delta).toFixed(2)),
        }
      : balance,
  );
}

export function resetDemoBalances() {
  demoBalances = initialDemoBalances.map(balance => ({...balance}));
}
