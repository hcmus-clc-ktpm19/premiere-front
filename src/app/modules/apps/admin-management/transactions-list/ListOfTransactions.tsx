import React, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import {
  Gender,
  MoneyTransferCriteria,
  PaginationDto,
  TransactionCriteriaDto,
  TransactionDto,
  TransactionType,
} from '@/app/models/model';
import {Card6} from '@_metronic/partials/content/cards/Card6';
import {useAuth} from '@/app/modules/auth';
import {useQuery} from 'react-query';
import {
  TransactionService
} from "@/app/modules/apps/admin-management/transactions-list/core/_requests";
import {ProfileService} from "@/app/modules/profile/core/_requests";
import {KTCard, KTSVG} from "@_metronic/helpers";
import {MenuComponent} from "@_metronic/assets/ts/components";

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

function ListOfTransactions() {
  const {currentUser} = useAuth();
  const userId: number = currentUser?.id as number;

  const typeRef = useRef<HTMLSelectElement>(null);

  const [paginationData, setPaginationData] = React.useState<PaginationDto>(
      TransactionService.paginationInit
  );
  const [paginationArray] = useState(Array.from({length: 3}, (_, i) => i + 1));
  const [transactionCriteria, setTransactionCriteria] = useState<TransactionCriteriaDto>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    data: res,
    refetch,
    isLoading: transactionsAreFetching,
  } = useQuery(
      `transactions-${typeRef.current?.value}-${paginationData.currPage}-${userId}`,
      () => TransactionService.getTransactions(1, '2022-12-14', '2023-01-11', transactionCriteria),
      {refetchOnWindowFocus: false}
  );

  const {data: currentUserCardNumber} = useQuery(
      `transactions-credit-card-${userId}`,
      () => ProfileService.getCreditCardByUserId(userId),
      {refetchOnWindowFocus: false}
  );

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

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

  const handleOnPageClick = (e: React.MouseEvent<HTMLLIElement>) => {
    setTransactionCriteria({
      ...transactionCriteria,
      page: Number(e.currentTarget.innerText) - 1,
    });
  };

  useEffect(() => {
    const refetchData = async () => {
      const {data: res} = await refetch();
      if (res) {
        setPaginationData(res.meta.pagination);
      }
    };

    refetchData();
  }, [transactionCriteria]);

  return (
      <>
        <KTCard>
          <div className={'card-toolbar'} style={{backgroundColor: '#151521'}}>
            <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
              {/* Search Component */}
              <div className='card-title' style={{marginRight: '10px'}}>
                {/* begin::Search */}
                <div className='d-flex align-items-center position-relative my-1'>
                  <KTSVG
                      path='/media/icons/duotune/general/gen021.svg'
                      className='svg-icon-1 position-absolute ms-6'
                  />
                  <input
                      type='text'
                      data-kt-user-table-filter='search'
                      className='form-control form-control-solid w-350px ps-14'
                      placeholder='Search transaction by credit card number'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* end::Search */}
              </div>
              {/* End Search Component */}

              {/* end::SubMenu */}
              <div className={'d-flex justify-content-end'}>

                {/* begin::Filter Button */}
                <button
                    disabled={false}
                    type='button'
                    className='btn btn-light-primary'
                    data-kt-menu-trigger='click'
                    data-kt-menu-placement='bottom-end'
                    style={{height: '50px'}}
                >
                  <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2'/>
                  Filter
                </button>
                {/* end::Filter Button */}
                {/* begin::SubMenu */}
                <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px'
                     data-kt-menu='true'>
                  {/* begin::Header */}
                  <div className='px-7 py-5'>
                    <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
                  </div>
                  {/* end::Header */}

                  {/* begin::Separator */}
                  <div className='separator border-gray-200'></div>
                  {/* end::Separator */}

                  {/* begin::Content */}
                  <div className='px-7 py-5' data-kt-user-table-filter='form'>
                    {/* begin::Input group */}
                    <div className='mb-10'>
                      <label className='form-label fs-6 fw-bold'>Gender:</label>
                      <select
                          className='form-select form-select-solid fw-bolder'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-allow-clear='true'
                          data-kt-user-table-filter='gender'
                          data-hide-search='true'
                          onChange={(e) => {
                          }}
                          value={'MALE'}
                      >
                        <option value='ALL'>ALL</option>
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>
                    {/* end::Input group */}

                    {/* begin::Input group */}
                    <div className='mb-10'>
                      <label className='form-label fs-6 fw-bold'>Account Status:</label>
                      <select
                          className='form-select form-select-solid fw-bolder'
                          data-kt-select2='true'
                          data-placeholder='Select option'
                          data-allow-clear='true'
                          data-kt-user-table-filter='two-step'
                          data-hide-search='true'
                          onChange={(e) => {
                          }}
                          value={'Enabled'}
                      >
                        <option value=''></option>
                        <option value='true'>Enabled</option>
                        <option value='false'>Disabled</option>
                      </select>
                    </div>
                    {/* end::Input group */}

                    {/* begin::Actions */}
                    <div className='d-flex justify-content-end'>
                      <button
                          type='button'
                          disabled={isLoading}
                          onClick={() => {
                          }}
                          className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                          data-kt-menu-dismiss='true'
                          data-kt-user-table-filter='reset'
                      >
                        Reset
                      </button>
                      <button
                          disabled={isLoading}
                          type='button'
                          onClick={() => {
                          }}
                          className='btn btn-primary fw-bold px-6'
                          data-kt-menu-dismiss='true'
                          data-kt-user-table-filter='filter'
                      >
                        Apply
                      </button>
                    </div>
                    {/* end::Actions */}
                  </div>
                  {/* end::Content */}
                </div>
              </div>
            </div>
          </div>

          <div className='py-4' style={{backgroundColor: '#151521'}}>

            <div className='d-flex flex-wrap flex-stack mb-6'>
              <h3 className='fw-bolder mx-2 my-2'>
                Transactions
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
              </div>
            </div>

            <div className='row g-6 g-xl-9'>
              {transactionsAreFetching ? (
                  <div style={{
                    ...styles,
                    position: 'absolute',
                    textAlign: 'center'
                  }}>Processing...</div>
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
                              type={''}
                              receiverCreditCard={item.receiverCreditCardNumber}
                              senderCreditCard={item.senderCreditCardNumber}
                          />
                        </div>
                    );
                  })
              )}
            </div>

            <div className='d-flex flex-stack flex-wrap pt-10'>
              <div
                  className='fs-6 fw-bold text-gray-700'>{`Showing 1 to ${paginationData.currPageTotalElements} of ${paginationData.totalElements} entries`}</div>

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
          </div>
        </KTCard>
      </>
  );
}

export default ListOfTransactions;