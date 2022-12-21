import React, {MouseEventHandler} from 'react';
import {ProfileService} from '@/app/modules/profile/core/_requests';
import {PaginationDto, PremierePaginationReponseDto, TransactionDto} from '@/app/models/model';
import {Card6} from '@_metronic/partials/content/cards/Card6';

const badgeColors = {
  COMPLETED: 'success',
  CHECKING: 'warning',
};

const tiles = {
  MONEY_TRANSFER: 'Money Transfer',
  LOAN: 'Loan',
};

export function Transactions() {
  const [data, setData] = React.useState<TransactionDto[]>([]);
  const [pagination, setPagination] = React.useState<PaginationDto>(ProfileService.paginationInit);

  const handleOnRefreshClick: MouseEventHandler<HTMLButtonElement> = async () => {
    const res: PremierePaginationReponseDto<TransactionDto> =
      await ProfileService.getTransactionByCustomerId(2, {});
    console.log(res);
    setData(res.payload);
    setPagination(res.meta.pagination);
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
              defaultValue='0'
            >
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
            title='refresh'
          >
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
        <div className='fs-6 fw-bold text-gray-700'>{`Showing 1 to ${pagination.currPageTotalElements} of ${pagination.totalElements} entries`}</div>

        <ul className='pagination'>
          <li className='page-item previous'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              <i className='previous'></i>
            </a>
          </li>

          <li className='page-item active'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              1
            </a>
          </li>

          <li className='page-item'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              2
            </a>
          </li>

          <li className='page-item'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              3
            </a>
          </li>

          <li className='page-item'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              4
            </a>
          </li>

          <li className='page-item'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              5
            </a>
          </li>

          <li className='page-item'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              6
            </a>
          </li>

          <li className='page-item next'>
            <a href='premiere-front/src/app/modules/profile#' className='page-link'>
              <i className='next'></i>
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
