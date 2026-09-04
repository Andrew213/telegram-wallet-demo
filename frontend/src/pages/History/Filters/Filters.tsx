import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useLocation} from "react-router-dom";

import {GetAccount} from "@/api/requests";
import {RegularFilter} from "@/assets/icons";
import Button from "@/components/Button/Button";
import SidePlate from "@/components/SidePlate/SidePlate";

import getFilters from "./getFilters";
import SelectTransactionType from "./SelectTransactionType/SelectTransactionType";
import {Filter, getFilterCount, initialFilter} from "./utils";

interface Props {
  filter: Filter;
  balances: GetAccount.Balance[];
  onChange: (filter: Filter) => void;
}

export function useFilter() {
  return useState<Filter>(initialFilter["DEPOSIT"]);
}

const Filters: React.FC<Props> = props => {
  const {filter, balances, onChange} = props;

  const [tempFilter, setTempFilter] = useState<Filter>(filter);

  const [showFilters, setShowFilters] = useState(false);

  const {t} = useTranslation();

  const {state: locationState} = useLocation();

  useEffect(() => {
    if (locationState === "bills") {
      onChange(initialFilter["BILL"]);
    }
  }, [locationState, onChange]);

  useEffect(() => setTempFilter(filter), [filter]);

  return (
    <>
      <SelectTransactionType
        value={tempFilter.type}
        onChange={type => onChange(initialFilter[type])}
      />
      <div
        className="flex items-center gap-2 px-4"
        data-testid="history-filters-container">
        <div
          className="cursor-pointer text-blue-300"
          onClick={() => setShowFilters(true)}
          data-testid="history-filters-icon">
          <RegularFilter />
        </div>
        <p
          className="text-p1 font-p1 dark:text-dark-text-primary"
          onClick={() => setShowFilters(true)}
          data-testid="history-filters-label">
          {t`transaction_history_filter_button_label`}
        </p>
        <div
          className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 text-p4 font-p4 text-blue-300 dark:bg-blue-500"
          data-testid="history-filters-count-text">
          {getFilterCount(filter)}
        </div>
      </div>
      {showFilters && (
        <SidePlate
          close={() => setShowFilters(false)}
          bgColor="grey-100 dark:bg-dark-underlay"
          testId="history-filters">
          {close => (
            <>
              <SidePlate.Header
                close={() => {
                  close();
                  setTempFilter(filter);
                }}
                testId="history-filters"
                bgColor="white dark:bg-dark-bg"
                color="grey-600 dark:text-dark-text-primary"
                title={t`transaction_history_filter_button_label`}
              />
              <div className="flex flex-grow flex-col overflow-y-auto">
                <div className="flex flex-grow flex-col gap-4 py-4">
                  {getFilters(tempFilter, balances, setTempFilter, t)}
                </div>
                <div className="flex gap-4 rounded-t-6 bg-white p-4 dark:bg-dark-bg">
                  <Button
                    size="lg"
                    color="secondary"
                    testId="history-filters-reset-button"
                    onClick={() => {
                      close();
                      onChange(initialFilter[filter.type]);
                    }}>
                    {t`reset_filters`}
                  </Button>
                  <Button
                    size="lg"
                    color="primary"
                    testId="history-filters-apply-button"
                    onClick={() => {
                      close();
                      onChange(tempFilter);
                    }}>
                    {t`apply_filters`}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SidePlate>
      )}
    </>
  );
};

export default Filters;
