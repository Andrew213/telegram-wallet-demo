import {Currency} from "@api/requests";
import {twJoin} from "tailwind-merge";

import * as icons from "@/assets/icons";

interface Props {
  testId: string;
  currency: Currency.Code;
  currencies: {code: Currency.Code; alias: Currency.Alias}[];
  onChange: (currency: Currency.Code) => void;
}

const SelectCurrency: React.FC<Props> = props => {
  return (
    <div className="flex gap-4 overflow-x-auto">
      {props.currencies.map(currency => {
        const icon = Currency.getIcon(currency.alias);
        const Icon = icon ? icons[icon as keyof typeof icons] : undefined;
        return (
          <button
            key={currency.code}
            disabled={currency.code === props.currency}
            onClick={() => props.onChange(currency.code)}
            data-testid={`${props.testId}-select-currency-${currency.code}-item`}
            className={twJoin(
              "flex cursor-pointer items-center gap-1 rounded-4 px-3 py-2 first:ml-4 last:mr-4",
              currency.code !== props.currency
                ? "bg-white text-grey-600 dark:bg-dark-bg dark:text-dark-text-primary"
                : Currency.getColor(currency.alias)
                  ? `bg-${Currency.getColor(currency.alias)!} text-white dark:text-dark-bg`
                  : "bg-grey-400 text-white dark:bg-dark-text-tertiary dark:text-dark-bg",
            )}>
            {Icon && (
              <Icon
                data-testid={`${props.testId}-select-currency-${currency.code}-icon`}
              />
            )}
            <div
              className="text-p3 font-p3"
              data-testid={`${props.testId}-select-currency-${currency.code}-title`}>
              {currency.alias}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SelectCurrency;
