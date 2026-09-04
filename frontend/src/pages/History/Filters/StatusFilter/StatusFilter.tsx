import {useTranslation} from "react-i18next";

import {
  GetBills,
  GetDeposits,
  GetPayments,
  GetStatements,
} from "@/api/requests";
import Select from "@/components/Select/Select";
import WithLabel from "@/pages/ui/WithLabel";

import {Filter} from "../utils";
import {statementTypeToIconMap, statusToIconMap} from "./utils";

interface Props {
  filter: Filter;
  onChange: (filter: Filter) => void;
}

const StatusFilter: React.FC<Props> = props => {
  const {filter, onChange} = props;

  const {t} = useTranslation();

  switch (filter.type) {
    case "DEPOSIT": {
      return (
        <WithLabel label={t`payment_status`}>
          <Select
            value={{
              icon: statusToIconMap[filter.status],
              value: filter.status,
              title:
                filter.status === "All"
                  ? t`all_statuses`
                  : GetDeposits.statusCodeToStatusRuNameMap(t)[
                      GetDeposits.statusNameToStatusCodeMap[filter.status]
                    ],
            }}
            options={["All" as const, ...GetDeposits.statusNames].map(name => ({
              icon: statusToIconMap[name],
              value: name,
              title:
                name === "All"
                  ? t`all_statuses`
                  : GetDeposits.statusCodeToStatusRuNameMap(t)[
                      GetDeposits.statusNameToStatusCodeMap[name]
                    ],
            }))}
            title={t`payment_status`}
            testId="history-status-filter"
            onChange={status => onChange({...filter, status})}
            bgColor="white"
          />
        </WithLabel>
      );
    }
    case "PAYMENT": {
      return (
        <WithLabel label={t`payment_status`}>
          <Select
            value={{
              icon: statusToIconMap[filter.status],
              value: filter.status,
              title:
                filter.status === "All"
                  ? t`all_statuses`
                  : GetPayments.statusCodeToStatusRuNameMap(t)[
                      GetPayments.statusNameToStatusCodeMap[filter.status]
                    ],
            }}
            options={["All" as const, ...GetPayments.statusNames].map(name => ({
              icon: statusToIconMap[name],
              value: name,
              title:
                name === "All"
                  ? t`all_statuses`
                  : GetPayments.statusCodeToStatusRuNameMap(t)[
                      GetPayments.statusNameToStatusCodeMap[name]
                    ],
            }))}
            title={t`payment_status`}
            testId="history-status-filter"
            onChange={status => onChange({...filter, status})}
            bgColor="white"
          />
        </WithLabel>
      );
    }
    case "BILL": {
      return (
        <WithLabel label={t`payment_status`}>
          <Select
            value={{
              icon: statusToIconMap[filter.status],
              value: filter.status,
              title:
                filter.status === "All"
                  ? t`all_statuses`
                  : GetBills.statusCodeToStatusRuNameMap(t)[
                      GetBills.statusNameToStatusCodeMap[filter.status]
                    ],
            }}
            options={["All" as const, ...GetBills.statusNames].map(name => ({
              icon: statusToIconMap[name],
              value: name,
              title:
                name === "All"
                  ? t`all_statuses`
                  : GetBills.statusCodeToStatusRuNameMap(t)[
                      GetBills.statusNameToStatusCodeMap[name]
                    ],
            }))}
            title={t`payment_status`}
            testId="history-status-filter"
            onChange={status => onChange({...filter, status})}
            bgColor="white"
          />
        </WithLabel>
      );
    }
    case "STATEMENT": {
      return (
        <WithLabel label={t`operation_type`}>
          <Select
            value={{
              icon: statementTypeToIconMap[filter.statementType],
              value: filter.statementType,
              title:
                filter.statementType === "All"
                  ? t`transaction_types.all_types`
                  : GetStatements.operationClassNameToOperationClassNameRuMap(
                      t,
                    )[filter.statementType],
            }}
            options={["All" as const, ...GetStatements.operationClassNames].map(
              name => ({
                icon: statementTypeToIconMap[name],
                value: name,
                title:
                  name === "All"
                    ? t`transaction_types.all_types`
                    : GetStatements.operationClassNameToOperationClassNameRuMap(
                        t,
                      )[name],
              }),
            )}
            title={t`operation_type`}
            testId="history-status-filter"
            onChange={statementType => onChange({...filter, statementType})}
            bgColor="white"
          />
        </WithLabel>
      );
    }
  }
};

export default StatusFilter;
