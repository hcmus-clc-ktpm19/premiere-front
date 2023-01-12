import React, {useEffect, useRef, useState} from 'react';
import {PaginationDto, TransactionDto,} from '@/app/models/model';
import {Card6} from '@_metronic/partials/content/cards/Card6';
import {useAuth} from '@/app/modules/auth';
import {useQuery} from 'react-query';
import {
  TransactionService
} from "@/app/modules/apps/admin-management/transactions-list/core/_requests";
import {ProfileService} from "@/app/modules/profile/core/_requests";
import {KTCard, KTSVG} from "@_metronic/helpers";
import {MenuComponent} from "@_metronic/assets/ts/components";
import dayjs, {Dayjs} from 'dayjs';
import TextField from '@mui/material/TextField';
import {useThemeMode} from "@_metronic/partials";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {
  TransactionCriteriaDtoCustom
} from "@/app/modules/apps/admin-management/transactions-list/core/_dtos";
import useNotification from "@/app/modules/notifications/useNotification";


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
  const [transactionCriteria, setTransactionCriteria] = useState<TransactionCriteriaDtoCustom>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [color, setColor] = useState<string[]>(['#f5f8fa' ,'#151521']);
  const {mode} = useThemeMode();

  const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs());
  const [bank, setBank] = React.useState<number>(1);
  const {setNotification} = useNotification();

  const formatDay = (date: Dayjs) => {
    return dayjs(date).format('YYYY-MM-DD');
  }

  useEffect(() => {
    setColor(mode === 'light' ? ['#f5f8fa' ,'#151521'] : ['#151521' ,'#f5f8fa']);
  }, [mode]);

  const {
    data: res,
    refetch,
    isLoading: transactionsAreFetching,
  } = useQuery(
      `transactions-${typeRef.current?.value}-${paginationData.currPage}-${userId}`,
      () => TransactionService.getTransactions(bank === 0 ? 1 : bank, formatDay(fromDate!), formatDay(toDate!), transactionCriteria),
      {refetchOnWindowFocus: false}
  );
  console.log({res});

  const {data: currentUserCardNumber} = useQuery(
      `transactions-credit-card-${userId}`,
      () => ProfileService.getCreditCardByUserId(userId),
      {refetchOnWindowFocus: false}
  );

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

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

  const resetData = () => {
    setFromDate(dayjs().subtract(30, 'day'));
    setToDate(dayjs());
    setBank(1);
    setSearchTerm('');
    setTransactionCriteria({
      ...transactionCriteria,
      fromDate: formatDay(fromDate!),
      toDate: formatDay(toDate!),
    });
  }

  const validateDateRange =(fromDate: Dayjs, toDate: Dayjs) => {
    if (fromDate.isAfter(dayjs())) { // if fromDate is after today
      return false;
    }
    if (fromDate.isAfter(toDate)) {
      return false;
    }
    if (toDate.subtract(30, 'day').isAfter(fromDate)) {
      return false;
    }
    return true;
  }

  const applyFilter = () => {
    if (validateDateRange(fromDate!, toDate!)) { // date range is valid (30 days)
      setTransactionCriteria({
        ...transactionCriteria,
        fromDate: formatDay(fromDate!),
        toDate: formatDay(toDate!),
      });
    } else {
      // date range is invalid, auto generate toDate from fromDate
      setNotification(true, 'Invalid date range.', 'error', () => {});
      setFromDate(dayjs().subtract(30, 'day'));
      setToDate(dayjs());
      setTransactionCriteria({
        ...transactionCriteria,
        fromDate: formatDay(fromDate!),
        toDate: formatDay(toDate!),
      });
    }
  }


  return (
      <>
        <KTCard>
          <div className='py-4' style={{backgroundColor: `${color[0]}`}}>

            <div className='d-flex flex-wrap flex-stack mb-6'>
              <h3 className='fw-bolder mx-2 my-2'>
                Transactions
                <span className='fs-6 text-gray-400 fw-bold ms-1'>30 Days</span>
              </h3>

              <div className='d-flex align-items-center my-2'>
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
                        disabled={transactionsAreFetching}
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
                          <label className='form-label fs-6 fw-bold'>Bank:</label>
                          <select
                              className='form-select form-select-solid fw-bolder'
                              data-kt-select2='true'
                              data-placeholder='Select option'
                              data-allow-clear='true'
                              data-kt-user-table-filter='gender'
                              data-hide-search='true'
                              onChange={(e) => setBank(Number(e.target.value))}
                              value={bank}
                          >
                            <option value='0'>All</option>
                            <option value='1'>Premiere</option>
                            <option value='5'>TaiXiu</option>
                          </select>
                        </div>
                        {/* end::Input group */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                              value={fromDate}
                              onChange={(newValue) => {
                                setFromDate(newValue);
                                setToDate(newValue!.add(30, 'day'));
                              }}
                              renderInput={(params) => (
                                  <div className='mb-10'>
                                    <label className='form-label fs-6 fw-bold'>From Date:</label>
                                    <TextField {...params}
                                               className='form-select form-select-solid fw-bolder'
                                               sx={{
                                                 svg: {color: color[1]},
                                                 input: {color: color[1]},
                                               }}
                                    />
                                  </div>
                              )}
                          />

                          <DatePicker
                              value={toDate}
                              onChange={(newValue) => {
                                setToDate(newValue);
                              }}
                              renderInput={(params) => (
                                  <div className='mb-10'>
                                    <label className='form-label fs-6 fw-bold'>To Date:</label>
                                    <TextField {...params}
                                               className='form-select form-select-solid fw-bolder'
                                               sx={{
                                                 svg: {color: color[1]},
                                                 input: {color: color[1]},
                                               }}
                                    />
                                  </div>
                              )}
                          />
                        </LocalizationProvider>

                        {/* begin::Actions */}
                        <div className='d-flex justify-content-end'>
                          <button
                              type='button'
                              disabled={transactionsAreFetching}
                              onClick={resetData}
                              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                              data-kt-menu-dismiss='true'
                              data-kt-user-table-filter='reset'
                          >
                            Reset
                          </button>
                          <button
                              disabled={transactionsAreFetching}
                              type='button'
                              onClick={applyFilter}
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
            </div>

            <div className='row g-6 g-xl-9'>
              {transactionsAreFetching ? (
                  <div style={{
                    ...styles,
                    position: 'absolute',
                    textAlign: 'center'
                  }}>Processing...</div>
              ) : (
                  res?.payload.filter((item: TransactionDto) =>
                     item.senderCreditCardNumber.indexOf(searchTerm.toLowerCase() || '') > - 1 || item.receiverCreditCardNumber.indexOf(searchTerm.toLowerCase() || '') > - 1
                  ).map<JSX.Element>((item: TransactionDto) => {
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
                              senderBankId={item.senderBankId}
                              receiverBankId={item.receiverBankId}
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