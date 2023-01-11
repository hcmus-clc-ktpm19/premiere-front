import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { ProfileService } from '@/app/modules/profile/core/_requests';
import {
  MoneyTransferCriteria,
  PaginationDto,
  TransactionCriteriaDto,
  TransactionDto,
  TransactionType,
} from '@/app/models/model';
import { Card6 } from '@_metronic/partials/content/cards/Card6';
import { useAuth } from '@/app/modules/auth';
import { useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { KTSVG } from '@_metronic/helpers';

export const badgeColors = {
  COMPLETED: 'success',
  CHECKING: 'warning',
  FAILED: 'danger',
};

export const tiles = {
  MONEY_TRANSFER: 'Money Transfer',
  LOAN: 'Loan',
};

const styles = {
  borderRadius: '0.475rem',
  boxShadow: '0 0 50px 0 rgb(82 63 105 / 15%)',
  backgroundColor: '#fff',
  color: '#7e8299',
  fontWeight: '500',
  margin: '0',
  width: 'auto',
  padding: '1rem 2rem',
  top: 'calc(50% - 2rem)',
  left: 'calc(50% - 4rem)',
};

export function Transactions() {
  const [searchParams] = useSearchParams();
  const userIdParam: string | null = searchParams.get('userId');
  const { currentUser } = useAuth();
  const userId: number = userIdParam ? parseInt(userIdParam) : (currentUser?.id as number);

  const navigate = useNavigate();
  const typeRef = useRef<HTMLSelectElement>(null);

  const [paginationData, setPaginationData] = React.useState<PaginationDto>(
    ProfileService.paginationInit
  );
  const [paginationArray] = useState(Array.from({ length: 3 }, (_, i) => i + 1));
  const [transactionCriteria, setTransactionCriteria] = useState<TransactionCriteriaDto>({});

  const {
    data: res,
    refetch,
    isLoading: transactionsAreFetching,
  } = useQuery(
    `transactions-${typeRef.current?.value}-${paginationData.currPage}-${userId}`,
    () => ProfileService.getTransactionByCustomerId(userId, transactionCriteria),
    { refetchOnWindowFocus: false }
  );

  const { data: currentUserCardNumber } = useQuery(
    `transactions-credit-card-${userId}`,
    () => ProfileService.getCreditCardByUserId(userId),
    { refetchOnWindowFocus: false }
  );

  const handleOnRefreshClick: MouseEventHandler<HTMLButtonElement> = () => {
    const currValue: string | undefined = typeRef.current?.value;
    let transactionType: TransactionType | undefined;
    let moneyTransferCriteria: MoneyTransferCriteria | undefined;
    if (
      MoneyTransferCriteria.OUTGOING === currValue ||
      MoneyTransferCriteria.INCOMING === currValue
    ) {
      moneyTransferCriteria = currValue;
    } else {
      transactionType = currValue ? (currValue as TransactionType) : undefined;
    }

    setTransactionCriteria({
      ...transactionCriteria,
      transactionType,
      moneyTransferCriteria,
    });
  };

  const handleOnCreateTransactionClick: MouseEventHandler<HTMLButtonElement> = () => {
    navigate('/crafted/pages/profile/create-transaction');
  };

  const handleOnPageClick = (e: React.MouseEvent<HTMLLIElement>) => {
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
          {userId === currentUser?.id ? 'My Transactions' : "Customer's Transactions" }
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
              <option></option>
              <option value={TransactionType.MONEY_TRANSFER}>Money Transfer</option>
              <option value={MoneyTransferCriteria.INCOMING}>Incoming</option>
              <option value={MoneyTransferCriteria.OUTGOING}>Outgoing</option>
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
          {
            userId === currentUser?.id && (
                  <button
                      onClick={handleOnCreateTransactionClick}
                      className='btn btn-danger btn-sm'
                      data-bs-toggle='tooltip'
                      title='create new transaction'>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Create Transaction
                  </button>
              )
          }
        </div>
      </div>

      <div className='row g-6 g-xl-9'>
        {transactionsAreFetching ? (
          <div style={{ ...styles, position: 'absolute', textAlign: 'center' }}>Processing...</div>
        ) : (
          res?.payload.map<JSX.Element>((item: TransactionDto) => {
            return (
              <div key={item.id} className='col-md-6 col-xl-4'>
                <Card6
                  badgeColor={badgeColors[item.status]}
                  status={item.status}
                  transactionType={tiles[item.type]}
                  description={item.transactionRemark}
                  date={item.createdAt.toString()}
                  budget={(item.amount + item.fee).toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                  type={
                    item.senderCreditCardNumber === currentUserCardNumber?.cardNumber
                      ? 'Outgoing'
                      : 'Incoming'
                  }
                  receiverCreditCard={item.receiverCreditCardNumber}
                  senderCreditCard={item.senderCreditCardNumber}
                />
              </div>
            );
          })
        )}
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
}
