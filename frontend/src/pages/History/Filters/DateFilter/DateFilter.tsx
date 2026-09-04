import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {twJoin} from "tailwind-merge";

import InputDate from "@/components/InputDate/InputDate";

import {
  datePeriods,
  datePeriodToDates,
  datePeriodToNameRuMap,
  datesToInputValue,
} from "./utils";

interface Props {
  value: [Date, Date] | undefined;
  label: string;
  onChange: (value: [Date, Date] | undefined) => void;
}

const DateFilter: React.FC<Props> = props => {
  const {value, label, onChange} = props;

  const {t, i18n} = useTranslation();

  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const [valueString, setValueString] = useState(
    datesToInputValue(i18n.language, value),
  );

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (!start || !end) return;
    onChange([start, end]);
  };

  useEffect(() => {
    setStartDate(value?.[0]);
    setEndDate(value?.[1]);
    setValueString(datesToInputValue(i18n.language, value));
  }, [i18n.language, value]);

  return (
    <div className="flex flex-col gap-4">
      <p className="px-4 text-p1 font-p1 text-grey-600 dark:text-dark-text-primary">
        {label}
      </p>
      <InputDate
        valueString={valueString}
        startDate={startDate}
        endDate={endDate}
        onChange={handleChange}
      />
      <div className="flex gap-4 overflow-x-auto">
        {datePeriods.map(dp => (
          <button
            key={dp}
            onClick={() => {
              onChange(dp === "All" ? undefined : datePeriodToDates(dp));
            }}
            data-testid={`${dp}-history-filter-date-button`}
            className={twJoin(
              "flex cursor-pointer items-center gap-1 text-nowrap rounded-4 px-3 py-2 text-p3 font-p3 first:ml-4 last:mr-4",
              (!value && dp === "All") ||
                (value &&
                  dp !== "All" &&
                  datesToInputValue(i18n.language, value) ===
                    datesToInputValue(i18n.language, datePeriodToDates(dp)))
                ? "bg-blue-300 text-white dark:text-dark-bg"
                : "bg-white text-grey-600 dark:bg-dark-bg dark:text-dark-text-primary",
            )}>
            {datePeriodToNameRuMap(t)[dp]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateFilter;
