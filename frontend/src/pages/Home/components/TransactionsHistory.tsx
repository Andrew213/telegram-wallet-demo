import {useEffect, useId, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import Spiner from "@/components/Spiner/Spiner";
import Transaction from "@/components/Transaction/Transaction";
import {Transaction as TransactionType} from "@/components/Transaction/utils";
import {useCloudStorage} from "@/core/context/useCloudStorage";

import {
  useUploadBills,
  useUploadDeposits,
  useUploadPayments,
} from "../hooks/useFetchTransactions";

const TransactionsHistory: React.FC = () => {
  const scrollContainerId = useId();

  const [allData, setAllData] = useState<TransactionType[]>([]);

  const [token] = useCloudStorage();

  const deposits = useUploadDeposits(token);

  const payments = useUploadPayments(token);

  const bills = useUploadBills(token);

  const {t} = useTranslation();

  const categories = [
    {query: deposits, name: "DEPOSIT"},
    {
      query: payments,
      name: "PAYMENT",
    },
    {query: bills, name: "BILL"},
  ];

  const flag = useRef(true);
  const categoryIndex = useRef(0);

  useEffect(() => {
    if (
      deposits.isSuccess &&
      payments.isSuccess &&
      bills.isSuccess &&
      flag.current
    ) {
      // первый раз загружаю сразу всё.
      setAllData([
        ...(deposits.data.pages
          .flat()
          .map(el => ({...el, type: "DEPOSIT"})) as TransactionType[]),
        ...(payments.data.pages
          .flat()
          .map(el => ({...el, type: "PAYMENT"})) as TransactionType[]),
        ...(bills.data.pages
          .flat()
          .map(el => ({...el, type: "BILL"})) as TransactionType[]),
      ]);
      const findFirstCategoryIndex = categories.findIndex(
        el => el.query.hasNextPage,
      );
      if (findFirstCategoryIndex !== -1) {
        categoryIndex.current = findFirstCategoryIndex;
      }
      flag.current = false;
    }
  }, [deposits, payments, bills]);

  const loadMore = async () => {
    const loadDataFromCategory = async (index: number) => {
      const {query, name} = categories[index];
      if (!query.hasNextPage) {
        return;
      }
      const response = await query.fetchNextPage();
      const lastPage = response.data?.pages.at(-1);

      if (lastPage?.length) {
        setAllData(prev => [
          ...prev,
          ...(lastPage
            .flat()
            .map(el => ({...el, type: name})) as TransactionType[]),
        ]);
        categoryIndex.current = (categoryIndex.current + 1) % categories.length;
      } else {
        // ищу следующую доступную категорию
        categoryIndex.current = (index + 1) % categories.length;

        loadDataFromCategory(categoryIndex.current);
      }
    };
    await loadDataFromCategory(categoryIndex.current);

    while (!categories[categoryIndex.current].query.hasNextPage) {
      categoryIndex.current = (categoryIndex.current + 1) % categories.length;
    }
  };

  if (deposits.isSuccess && payments.isSuccess && bills.isSuccess) {
    return (
      <div className="rounded-t-6 bg-white pt-4 transition-transform dark:bg-dark-bg">
        <h3 className="px-4 pb-4 text-h3 font-h3 dark:text-dark-text-primary">{t`transaction_history_title`}</h3>
        <div id={scrollContainerId} className="max-h-[216px] overflow-y-auto">
          <div className="flex-grow" data-testid="home-list-container">
            {allData.length ? (
              <InfiniteScroll
                next={loadMore}
                dataLength={allData.length}
                scrollableTarget={scrollContainerId}
                hasMore={(() => {
                  return (
                    (deposits.hasNextPage && !deposits.isFetching) ||
                    (payments.hasNextPage && !payments.isFetching) ||
                    (bills.hasNextPage && !bills.isFetching)
                  );
                })()}
                loader={
                  <div className="flex w-full items-center justify-center p-4">
                    <Spiner style={{height: "30px", width: "30px"}} />
                  </div>
                }>
                <div className="flex flex-col">
                  {allData.map(transaction => {
                    return (
                      <Transaction
                        key={`${transaction.type}_${transaction.id}`}
                        transaction={transaction}
                      />
                    );
                  })}
                </div>
              </InfiniteScroll>
            ) : (
              <p
                className="px-4 pb-6 pt-4 text-p3 font-p3 text-grey-400 dark:text-dark-text-tertiary"
                data-testid="home-empty-list-text">
                {t`transaction_list_empty_placeholder`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex w-full items-center justify-center p-4">
        <Spiner style={{height: "30px", width: "30px"}} />
      </div>
    );
  }
};

export default TransactionsHistory;
