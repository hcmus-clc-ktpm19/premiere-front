import React, {MouseEventHandler, useState} from 'react';
import {ProfileService} from '@/app/modules/profile/core/_requests';
import {PaginationDto, PremierePaginationReponseDto, TransactionDto} from '@/app/models/model';
import {Card6} from '@_metronic/partials/content/cards/Card6';
import {useAuth} from '@/app/modules/auth';

const badgeColors = {
  COMPLETED: 'success',
  CHECKING: 'warning',
};

const tiles = {
  MONEY_TRANSFER: 'Money Transfer',
  LOAN: 'Loan',
};

export function Transactions() {
  const {currentUser} = useAuth();
  const [data, setData] = React.useState<TransactionDto[]>([]);
  const [paginationData, setPaginationData] = React.useState<PaginationDto>(
    ProfileService.paginationInit
  );
  const [paginationArray, setPaginationArray] = useState(Array.from({length: 3}, (_, i) => i + 1));

  const handleOnRefreshClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const res: PremierePaginationReponseDto<TransactionDto> =
      await ProfileService.getTransactionByCustomerId(currentUser?.id as number, {});
    console.log(res);
    setData(res.payload);
    setPaginationData(res.meta.pagination);
    setPaginationArray(Array.from({length: 3}, (_, i) => i + res.meta.pagination.currPage + 1));
  };

  const handleOnPageClick = async (e: React.MouseEvent<HTMLLIElement>) => {
    console.log(e.currentTarget.value);
  };

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder mx-2 my-2'>
          My Transactions
          <span className='fs-6 text-gray-400 fw-bold ms-1'>30 Days</span>
        </h3>

        <div className='d-flex align-items-center my-2'>
          <div className='w-100px me-5'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-white form-select-sm'
              defaultValue='0'>
              <option value='0'></option>
              <option value='1'>Receive</option>
              <option value='2'>Send</option>
              <option value='3'>Loan</option>
            </select>
          </div>
          <button
            onClick={handleOnRefreshClick}
            className='btn btn-primary btn-sm'
            data-bs-toggle='tooltip'
            title='refresh'>
            Refresh
          </button>
        </div>
      </div>

      <div className='row g-6 g-xl-9'>
        {data.map<JSX.Element>((item: TransactionDto) => {
          return (
            <div key={item.id} className='col-md-6 col-xl-4'>
              <Card6
                badgeColor={badgeColors[item.status]}
                status={item.status}
                transactionType={tiles[item.type]}
                description={item.transactionRemark}
                date={item.createdAt.toString()}
                budget={item.totalBalance.toString()}
              />
            </div>
          );
        })}
      </div>

      <div className='d-flex flex-stack flex-wrap pt-10'>
        <div className='fs-6 fw-bold text-gray-700'>{`Showing 1 to ${paginationData.currPageTotalElements} of ${paginationData.totalElements} entries`}</div>

        <ul className='pagination'>
          <li className='page-item previous'>
            <div className={`page-link ${paginationData.first || 'pe-auto'}`}>
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
