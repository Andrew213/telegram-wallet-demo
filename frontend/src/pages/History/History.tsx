import {useEffect, useId} from "react";
import {useTranslation} from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import Spiner from "@/components/Spiner/Spiner";
import StatusPage from "@/components/StatusPage/StatusPage";
import Transaction from "@/components/Transaction/Transaction";
import {useCloudStorage} from "@/core/context/useCloudStorage";
import {useOpenLink} from "@/hooks";
import {userError} from "@/utils";

import useGetAccount from "../hooks/useGetAccount";
import Filters, {useFilter} from "./Filters/Filters";
import useFetchTransactions from "./useFetchTransactions";

const History: React.FC = () => {
  const scrollContainerId = useId();
  const [filter, setFilter] = useFilter();
  const [token] = useCloudStorage();
  const getAccount = useGetAccount(token);
  const fetchTransactions = useFetchTransactions(filter, token);
  const openLink = useOpenLink();

  const {t} = useTranslation();

  // will refetch with page reset
  const {resetQuery} = fetchTransactions;
  useEffect(resetQuery, [filter, resetQuery]);

  if (fetchTransactions.error || getAccount.error) {
    return (
      <StatusPage
        status="ERROR"
        title={userError(fetchTransactions.error || getAccount.error)}
        testId="history-error"
        button={{
          size: "lg",
          color: "primary",
          children: t`badge_support_button_label`,
          onClick: () => {
            openLink("mailto:support@example.com");
          },
        }}
      />
    );
  }

  if (getAccount.isLoading || !getAccount.data) {
    return (
      <div className="flex h-tg-viewport-height items-center justify-center">
        <Spiner />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex flex-col gap-4 pb-[11px] pt-4">
          <Filters
            filter={filter}
            balances={getAccount.data.balances}
            onChange={setFilter}
          />
        </div>
        <div
          className="flex-grow overflow-y-auto rounded-t-6 bg-white dark:bg-dark-bg"
          data-testid="history-list-container"
          id={scrollContainerId}>
          {!fetchTransactions.data ||
          !fetchTransactions.data.pages.length ||
          (fetchTransactions.data.pages.at(0)?.at(0) &&
            fetchTransactions.data.pages.at(0)!.at(0)!.type !== filter.type) ? (
            <div className="flex h-full w-full items-center justify-center">
              <Spiner style={{height: "30px", width: "30px"}} />
            </div>
          ) : !fetchTransactions.data.pages.flat().length ? (
            <p
              className="p-4 text-center text-p3 font-p3 text-grey-400 dark:text-dark-text-tertiary"
              data-testid="history-empty-list-text">
              {t`history_list_empty_placeholder`}
            </p>
          ) : (
            <InfiniteScroll
              scrollableTarget={scrollContainerId}
              dataLength={fetchTransactions.data.pages.flat().length}
              next={() => fetchTransactions.fetchNextPage()}
              hasMore={fetchTransactions.hasNextPage}
              loader={
                <div className="flex w-full items-center justify-center p-4">
                  <Spiner style={{height: "30px", width: "30px"}} />
                </div>
              }>
              {fetchTransactions.data.pages.flat().map(transaction => (
                <Transaction
                  key={`${transaction.type}-${transaction.id}`}
                  transaction={transaction}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default History;
