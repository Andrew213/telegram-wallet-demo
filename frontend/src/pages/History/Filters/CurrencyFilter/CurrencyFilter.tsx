import {useTranslation} from "react-i18next";

import {Currency, GetAccount} from "@/api/requests";
import Select from "@/components/Select/Select";
import WithLabel from "@/pages/ui/WithLabel";

import {currencyCodeToOption} from "./utils";

interface Props {
  value: Currency.Code | "All";
  label: string;
  balances: GetAccount.Balance[];
  onChange: (code: Currency.Code | "All") => void;
}

const CurrencyFilter: React.FC<Props> = props => {
  const {value, label, balances, onChange} = props;

  const {t} = useTranslation();

  return (
    <WithLabel label={label}>
      <Select
        value={{
          value,
          ...currencyCodeToOption(
            value === "All"
              ? {code: "All" as const, alias: "All" as const}
              : balances.find(balance => balance.code === value)!,
            t,
          ),
        }}
        options={[
          {code: "All" as const, alias: "All" as const},
          ...balances.map(balance => ({
            code: balance.code,
            alias: balance.alias,
          })),
        ].map(option => ({
          ...currencyCodeToOption(option, t),
          value: option.code,
        }))}
        title={label}
        testId="history-currency-filter"
        onChange={onChange}
        bgColor="white"
      />
    </WithLabel>
  );
};

export default CurrencyFilter;
