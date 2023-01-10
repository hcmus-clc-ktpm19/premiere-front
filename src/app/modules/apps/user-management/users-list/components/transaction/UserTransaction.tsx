import React, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import {badgeColors, tiles} from "@/app/modules/profile/components/Transactions";
import {useSearchParams} from "react-router-dom";
import {
  PaginationDto,
  TransactionCriteriaDto,
  TransactionDto,
  TransactionType
} from "@/app/models/model";
import {ProfileService} from "@/app/modules/profile/core/_requests";
import {useQuery} from "react-query";
import {Card6} from "@_metronic/partials/content/cards/Card6";

const UserTransaction = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId') as unknown as number;

  const [paginationData, setPaginationData] = React.useState<PaginationDto>(
      ProfileService.paginationInit
  );
  const [paginationArray] = useState(Array.from({ length: 3 }, (_, i) => i + 1));
  const [transactionCriteria, setTransactionCriteria] = useState<TransactionCriteriaDto>({});

  const { data: res, refetch } = useQuery(
      `transactions-${paginationData.currPage}`,
      () => ProfileService.getTransactionByCustomerId(userId, transactionCriteria),
      { refetchOnWindowFocus: false }
  );

  const { data: customerCardNumber } = useQuery(
      'transactions-credit-card',
      () => ProfileService.getCreditCardByUserId(userId),
      { refetchOnWindowFocus: false }
  );
  console.log('res', { res }, {customerCardNumber });

  const typeRef = useRef<HTMLSelectElement>(null);

  const handleOnRefreshClick: MouseEventHandler<HTMLButtonElement> = async () => {
    setTransactionCriteria({
      ...transactionCriteria,
      transactionType:
          typeRef.current?.value === 'none' ? undefined : (typeRef.current?.value as TransactionType),
    });
  };

  const handleOnPageClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    setTransactionCriteria({
      ...transactionCriteria,
      page: Number(e.currentTarget.innerText) - 1,
    });
  };

  useEffect(() => {
    const refetchData = async () => {
      const { data: res } = await refetch();
      if (res) {
        setPaginationData(res.meta.pagination);
      }
    };

    refetchData();
  }, [transactionCriteria]);

  return (
      <>
        <div className='d-flex flex-wrap flex-stack mb-6'>
          <h3 className='fw-bolder mx-2 my-2'>
            Customer's Transactions
            <span className='fs-6 text-gray-400 fw-bold ms-1'>30 Days</span>
          </h3>

          <div className='d-flex align-items-center my-2'>
            <div className='w-auto me-5'>
              <select
                  ref={typeRef}
                  name='status'
                  data-control='select2'
                  data-hide-search='true'
                  className='form-select form-select-white form-select-sm'
                  defaultValue='none'>
                <option value='none'></option>
                <option value={TransactionType.MONEY_TRANSFER}>Money Transfer</option>
                <option value={TransactionType.LOAN}>Loan</option>
              </select>
            </div>
            <button
                onClick={handleOnRefreshClick}
                className='btn btn-primary btn-sm me-2'
                data-bs-toggle='tooltip'
                title='refresh'>
              Refetch
            </button>
          </div>
        </div>

        <div className='row g-6 g-xl-9'>
          {res?.payload.map<JSX.Element>((item: TransactionDto) => {
            return (
                <div key={item.id} className='col-md-6 col-xl-4'>
                  <Card6
                      badgeColor={badgeColors[item.status]}
                      status={item.status}
                      transactionType={tiles[item.type]}
                      description={item.transactionRemark}
                      date={item.createdAt.toString()}
                      budget={item.amount.toLocaleString('it-IT', {
                        style: 'currency',
                        currency: 'VND',
                      })}
                      type={item.senderCreditCardNumber === customerCardNumber?.cardNumber ? 'Outgoing' : 'Incoming'}
                  />
                </div>
            );
          })}
        </div>

        <div className='d-flex flex-stack flex-wrap pt-10'>
          <div className='fs-6 fw-bold text-gray-700'>{`Showing 1 to ${paginationData.currPageTotalElements} of ${paginationData.totalElements} entries`}</div>

          <ul className='pagination'>
            <li className='page-item previous'>
              <div className={`page-link ${paginationData.first && 'disabled'}`}>
                <i className='previous'></i>
              </div>
            </li>

            {paginationArray.map((item) => {
              return (
                  <li
                      key={item}
                      onClick={handleOnPageClick}
                      value={item}
                      className={`page-item ${paginationData.currPage === item - 1 && 'active'}`}>
                    <div className='page-link'>{item}</div>
                  </li>
              );
            })}
            <li className='page-item next'>
              <div className={`page-link ${paginationData.last && 'disabled'}`}>
                <i className='next'></i>
              </div>
            </li>
          </ul>
        </div>
      </>
  );
};

export default UserTransaction;