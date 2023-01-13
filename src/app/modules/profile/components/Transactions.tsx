import React, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import {ProfileService} from '@/app/modules/profile/core/_requests';
import {
  MoneyTransferCriteria,
  PaginationDto,
  TransactionDto,
  TransactionType,
} from '@/app/models/model';
import {Card6} from '@_metronic/partials/content/cards/Card6';
import {useAuth} from '@/app/modules/auth';
import {useQuery} from 'react-query';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {KTSVG} from '@_metronic/helpers';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import {useThemeMode} from "@_metronic/partials";
import dayjs, {Dayjs} from "dayjs";
import useNotification from "@/app/modules/notifications/useNotification";
import {MenuComponent} from "@_metronic/assets/ts/components";
import {
  TransactionCriteriaDtoCustom
} from "@/app/modules/apps/admin-management/transactions-list/core/_dtos";

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
  const [transactionCriteria, setTransactionCriteria] = useState<TransactionCriteriaDtoCustom>({});

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [color, setColor] = useState<string[]>(['#f5f8fa' ,'#151521']);
  const {mode} = useThemeMode();

  const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs());
  const {setNotification} = useNotification();

  const formatDay = (date: Dayjs) => {
    return dayjs(date).format('YYYY-MM-DD');
  }

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

  useEffect(() => {
    setColor(mode === 'light' ? ['#f5f8fa' ,'#151521'] : ['#151521' ,'#f5f8fa']);
  }, [mode]);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);


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

  const resetData = () => {
    typeRef.current!.value = '';
    setFromDate(dayjs().subtract(30, 'day'));
    setToDate(dayjs());
    setSearchTerm('');
    setTransactionCriteria({});
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
    if (validateDateRange(fromDate!, toDate!)) { // date range is valid (30 days)
      setTransactionCriteria({
        ...transactionCriteria,
        fromDate: formatDay(fromDate!),
        toDate: formatDay(toDate!),
        transactionType,
        moneyTransferCriteria,
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
        transactionType,
        moneyTransferCriteria,
      });
    }
  }

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder mx-2 my-2'>
          {userId === currentUser?.id ? 'My Transactions' : "Customer's Transactions" }
          <span className='fs-6 text-gray-400 fw-bold ms-1'>30 Days</span>
        </h3>

        <div className='d-flex align-items-center my-2'>
          {/* Begin Filter */}
          <div>
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
                      className='btn btn-light-primary btn-sm me-2'
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                      style={{height: '50px'}}
                  >
                    <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2'/>
                    Filter
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
                        <label className='form-label fs-6 fw-bold'>Transaction Type:</label>
                        <select
                            ref={typeRef}
                            name='status'
                            data-control='select2'
                            data-hide-search='true'
                            className='form-select form-select-solid fw-bolder'
                            defaultValue='none'>
                          <option></option>
                          <option value={TransactionType.MONEY_TRANSFER}>Money Transfer</option>
                          <option value={MoneyTransferCriteria.INCOMING}>Incoming</option>
                          <option value={MoneyTransferCriteria.OUTGOING}>Outgoing</option>
                          <option value={TransactionType.LOAN}>Loan</option>
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
          {/* End Filter */}

        </div>
      </div>

      <div className='row g-6 g-xl-9'>
        {transactionsAreFetching ? (
          <div style={{ ...styles, position: 'absolute', textAlign: 'center' }}>Processing...</div>
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
                  type={
                    item.type === TransactionType.MONEY_TRANSFER ? (
                        item.senderCreditCardNumber === currentUserCardNumber?.cardNumber
                            ? 'Outgoing - '
                            : 'Incoming - '
                    ) : (
                      ''
                    )
                  }
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
