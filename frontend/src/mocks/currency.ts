import {Currency} from "@/api/requests";

export const demoCurrencyAliases: Record<
  number,
  NonNullable<Currency.Alias>
> = {
  [Currency.nameToCodeMap.USADollar]: "USD",
  [Currency.nameToCodeMap.Euro]: "EUR",
  [Currency.nameToCodeMap.Usdt]: "USDT",
};

export function getDemoCurrencyAlias(
  code: Currency.Code,
): NonNullable<Currency.Alias> {
  return demoCurrencyAliases[Number(code)] ?? "USD";
}

export function matchesDemoCurrency(
  alias: Currency.Alias,
  code?: Currency.Code,
) {
  if (!code) {
    return true;
  }

  return alias === getDemoCurrencyAlias(code);
}
