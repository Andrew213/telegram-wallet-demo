import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {twJoin} from "tailwind-merge";

import {Currency, GetAccount} from "@/api/requests";
import {RegularArrowDown} from "@/assets/icons";
import Icon from "@/components/Icon/Icon";
import {menuRoutes} from "@/routes";

const Balance: React.FC<GetAccount.Balance> = props => {
  const {id, alias, available, code} = props;

  const [isOpen, setIsOpen] = useState(false);

  const {t} = useTranslation();

  const navigation = useNavigate();
  return (
    <div data-testid={`balance-${id}-item`} key={id} className="flex flex-col">
      <div
        onClick={() => {
          setIsOpen(prev => !prev);
        }}
        className={twJoin(
          "flex flex-col overflow-hidden rounded-8 bg-white p-4 text-grey-600 transition-all dark:bg-dark-bg dark:text-dark-text-primary",
          isOpen ? "max-h-[300px]" : "max-h-[74px]",
        )}>
        <div className="flex w-full items-center gap-2">
          {Currency.getIcon(alias) ? (
            <Icon
              icon={Currency.getIcon(alias)!}
              bgColor={
                Currency.getColor(alias) ?? "grey-200 dark:bg-dark-surface"
              }
              testId={`balance-${id}-icon`}
              color="white dark:text-dark-bg"
              size="sm"
            />
          ) : (
            <div
              className="flex size-10 items-center justify-center rounded-4 bg-grey-400 text-white dark:bg-dark-text-tertiary dark:text-dark-text-primary"
              data-testid={`balance-${id}-icon`}>
              {alias || code}
            </div>
          )}
          <div className="flex flex-grow flex-col gap-1 text-start">
            <div
              className="text-p1 font-p1 text-grey-600 dark:text-dark-text-primary"
              data-testid={`balance-${id}-name`}>
              {Currency.getRuName(code, t) || alias || `[${code}]`}
            </div>
            <div
              className="text-p3 font-p3 text-grey-600 dark:text-dark-text-primary"
              data-testid={`balance-${id}-amount`}>
              {`${available} ${alias || ""}`}
            </div>
          </div>
          <RegularArrowDown
            className={isOpen ? "rotate-180" : "rotate-0"}
            data-testid={`${id}-balance-arrow`}
          />
        </div>
        <div className="mt-4 flex w-full justify-center gap-2 transition-all">
          <button
            onClick={() => {
              navigation(menuRoutes.deposit, {
                replace: true,
                state: {
                  selectedBalanceId: id,
                },
              });
            }}
            className="rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary"
            data-testid={`balance-${id}-deposit-button`}>
            {t`tab_bar_deposit_screen_title`}
          </button>
          <button
            onClick={() => {
              navigation(menuRoutes.payment, {
                replace: true,
                state: {
                  selectedBalanceId: id,
                },
              });
            }}
            className="rounded-4 bg-grey-200 px-4 py-[6px] text-p1 font-p1 dark:bg-dark-surface dark:text-dark-text-primary"
            data-testid={`balance-${id}-payout-button`}>
            {t`tab_bar_transfer_screen_title`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Balance;
