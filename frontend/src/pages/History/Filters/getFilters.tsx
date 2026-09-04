import {TFunction} from "i18next";

import {GetAccount} from "@/api/requests";
import {bigintToNumber} from "@/utils";

import CurrencyFilter from "./CurrencyFilter/CurrencyFilter";
import DateFilter from "./DateFilter/DateFilter";
import IdFilter from "./IdFilter/IdFilter";
import StatusFilter from "./StatusFilter/StatusFilter";
import {Filter} from "./utils";

export default function getFilters(
  filter: Filter,
  balances: GetAccount.Balance[],
  onChange: (filter: Filter) => void,
  t: TFunction,
) {
  switch (filter.type) {
    case "DEPOSIT": {
      return (
        <>
          <StatusFilter filter={filter} onChange={onChange} />
          <CurrencyFilter
            label={t`invoice_currency`}
            value={filter.target_currency}
            balances={balances}
            onChange={target_currency => onChange({...filter, target_currency})}
          />
          <DateFilter
            label={t`create_date_time`}
            value={filter.date}
            onChange={date => onChange({...filter, date})}
          />
          <CurrencyFilter
            label={t`bill_payment_currency`}
            value={filter.source_currency}
            balances={balances}
            onChange={source_currency => onChange({...filter, source_currency})}
          />
          <IdFilter
            label={t`history_payment_tab_filters_payment_id_field_title`}
            placeholder={t`history_payment_tab_filters_payment_id_field_placeholder`}
            testId="history-filter-deposit-id-input"
            value={BigInt(filter.id)}
            onChange={id => onChange({...filter, id: bigintToNumber(id)})}
          />
          <IdFilter
            label={t`transaction_history_detail_field_transaction_number`}
            placeholder={t`enter_payment_number`}
            value={BigInt(filter.shop_order_id)}
            testId="history-filter-deposit-number-input"
            onChange={shop_order_id =>
              onChange({
                ...filter,
                shop_order_id: bigintToNumber(shop_order_id),
              })
            }
          />
        </>
      );
    }
    case "PAYMENT": {
      return (
        <>
          <StatusFilter filter={filter} onChange={onChange} />
          <CurrencyFilter
            label={t`withdraw_currency`}
            value={filter.source_currency}
            balances={balances}
            onChange={source_currency => onChange({...filter, source_currency})}
          />
          <DateFilter
            label={t`create_date_time`}
            value={filter.date}
            onChange={date => onChange({...filter, date})}
          />
          <IdFilter
            label={t`history_payment_tab_filters_payment_id_field_title`}
            placeholder={t`history_payment_tab_filters_payment_id_field_placeholder`}
            value={BigInt(filter.id)}
            testId="history-filter-payment-id-input"
            onChange={id => onChange({...filter, id: bigintToNumber(id)})}
          />
          <CurrencyFilter
            label={t`received_currency`}
            value={filter.target_currency}
            balances={balances}
            onChange={target_currency => onChange({...filter, target_currency})}
          />
        </>
      );
    }
    case "BILL": {
      return (
        <>
          <StatusFilter filter={filter} onChange={onChange} />
          <CurrencyFilter
            label={t`payment_currency`}
            value={filter.source_currency}
            balances={balances}
            onChange={source_currency => onChange({...filter, source_currency})}
          />
          <DateFilter
            label={t`create_date_time`}
            value={filter.date}
            onChange={date => onChange({...filter, date})}
          />
          <IdFilter
            label={t`transaction_history_detail_field_transaction_number`}
            placeholder={t`enter_payment_number`}
            testId="history-filter-bill-number-input"
            value={BigInt(filter.shop_order_id)}
            onChange={shop_order_id =>
              onChange({
                ...filter,
                shop_order_id: bigintToNumber(shop_order_id),
              })
            }
          />
          <IdFilter
            label={t`history_bill_tab_filters_bill_id_field_title`}
            placeholder={t`history_statement_tab_filters_statement_id_field_placeholder`}
            testId="history-filter-bill-id-input"
            value={BigInt(filter.id)}
            onChange={id => onChange({...filter, id: bigintToNumber(id)})}
          />
          <CurrencyFilter
            label={t`deposit_currency_title`}
            value={filter.target_currency}
            balances={balances}
            onChange={target_currency => onChange({...filter, target_currency})}
          />
        </>
      );
    }
    case "STATEMENT": {
      return (
        <>
          <StatusFilter filter={filter} onChange={onChange} />
          <CurrencyFilter
            label={t`currency`}
            value={filter.currency}
            balances={balances}
            onChange={currency => onChange({...filter, currency})}
          />
          <DateFilter
            label={t`create_date_time`}
            value={filter.date}
            onChange={date => onChange({...filter, date})}
          />
          <IdFilter
            label={t`history_statement_tab_filters_statement_id_field_title`}
            placeholder={t`history_statement_tab_filters_statement_id_field_placeholder`}
            testId="history-filter-statement-id-input"
            value={BigInt(filter.id)}
            onChange={id => onChange({...filter, id: bigintToNumber(id)})}
          />
        </>
      );
    }
  }
}
