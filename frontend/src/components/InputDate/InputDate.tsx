import "react-datepicker/dist/react-datepicker.css";

import React, {useState} from "react";
import DatePicker from "react-datepicker";
import {useTranslation} from "react-i18next";

import {RegularArrowLeft, RegularArrowRight} from "@/assets/icons";
import {addDays} from "@/utils";

import BottomPlate from "../BottomPlate/BottomPlate";
import Button from "../Button/Button";
import {getDayNames, getMonthName} from "./utils";

type CalendarDate = Date | null | undefined;

export interface InputDateProps {
  valueString: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
  onChange: (dates: [Date | null, Date | null]) => void;
}

const InputDate: React.FC<InputDateProps> = props => {
  const {valueString, startDate, endDate, onChange} = props;

  const {t} = useTranslation();

  const [isOpened, setIsOpened] = useState<boolean>(false);

  return (
    <>
      {isOpened && (
        <BottomPlate
          title={t`choose_dates`}
          close={() => {
            setIsOpened(false);
          }}>
          {close => (
            <div className="px-4">
              <DatePicker
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                excludeDates={[addDays(new Date(), 1)]}
                filterDate={date => date < new Date()}
                selectsRange
                placeholderText={t`set_date_range`}
                selectsDisabledDaysInRange
                weekDayClassName={() =>
                  "text-p3 font-p1 !text-grey-500 dark:!text-dark-text-secondary"
                }
                dayClassName={() => "text-h4 font-h4"}
                inline
                formatWeekDay={date => getDayNames(date, t)}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => {
                  return (
                    <div className="flex items-center justify-between px-2 py-1">
                      <button
                        onClick={decreaseMonth}
                        disabled={prevMonthButtonDisabled}
                        data-testid="history-filter-date-calendar-arrow-left"
                        className="text-gray-600 dark:text-dark-text-primary">
                        <RegularArrowLeft />
                      </button>
                      <span className="text-p3 font-p1 text-grey-500 dark:text-dark-text-secondary">
                        {getMonthName(date, t)}
                      </span>
                      <button
                        onClick={increaseMonth}
                        disabled={nextMonthButtonDisabled}
                        data-testid="history-filter-date-calendar-arrow-right"
                        className="text-gray-600 dark:text-dark-text-primary">
                        <RegularArrowRight />
                      </button>
                    </div>
                  );
                }}
              />
              <div className="flex flex-row items-center justify-between gap-4 py-4">
                <Button
                  testId="history-filter-date-cancel-button"
                  onClick={() => {
                    setIsOpened(false);
                    close();
                  }}
                  size="lg"
                  color="secondary">
                  {t`cancel_label`}
                </Button>
                <Button
                  testId="history-filter-date-confirm-button"
                  onClick={() => {
                    setIsOpened(false);
                    close();
                  }}
                  size="lg"
                  color="primary">
                  {t`confirm_label`}
                </Button>
              </div>
            </div>
          )}
        </BottomPlate>
      )}
      <div className="px-4">
        <button
          className="w-full rounded-3 bg-white px-4 py-[22px] text-start dark:bg-dark-bg"
          data-testid="history-filter-date-container"
          onClick={() => setIsOpened(true)}>
          {!valueString ? (
            <p className="w-full truncate bg-transparent text-p2 font-p2 text-grey-400 outline-none dark:text-dark-text-secondary">{t`set_date_range`}</p>
          ) : (
            <p className="w-full truncate bg-transparent text-p2 font-p2 outline-none dark:text-dark-text-primary">
              {valueString}
            </p>
          )}
        </button>
      </div>
    </>
  );
};

export default InputDate;
