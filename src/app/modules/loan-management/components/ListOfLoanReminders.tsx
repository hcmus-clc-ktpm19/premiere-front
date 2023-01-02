import React, {useEffect} from 'react';
import {KTSVG} from "@_metronic/helpers";
import {CreditCardDto} from "@/app/modules/profile/core/_dtos";
import {useNavigate} from "react-router-dom";
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import {useAuth} from "@/app/modules/auth";
import {services} from '@/app/modules/loan-management/core/services';
import {LoanReminderDto} from "@/app/modules/loan-management/core/_dtos";
import {
  ReminderDeleteModal
} from "@/app/modules/loan-management/loan-reminder-modal/ReminderDeleteModal";
import {ConfirmModal} from "@_metronic/partials/modals/confirm/ConfirmModal";
import useNotification from "@/app/modules/notifications/useNotification";
import ReminderPaymentModal
  from "@/app/modules/loan-management/loan-reminder-modal/ReminderPaymentModal";
import {AlertColor} from "@mui/material";

export const LoanReminderContext = React.createContext({});
const ListOfLoanReminders = () => {
  const navigate = useNavigate();
  const {currentUser} = useAuth();
  const [loanReminders, setLoanReminders] = React.useState<LoanReminderDto[]>([]);
  const [status, setStatus] = React.useState<string>('');
  const [cancelModal, setCancelModal] = React.useState<boolean>(false);
  const [reminderToDelete, setReminderToDelete] = React.useState<LoanReminderDto>();

  const [paymentModal, setPaymentModal] = React.useState<boolean>(false);
  const [reminderToPay, setReminderToPay] = React.useState<LoanReminderDto>();
  const [otpModal, setOtpModal] = React.useState<boolean>(false);
  const [creditCard, setCreditCard] = React.useState<CreditCardDto>();
  const [paymentSuccess, setPaymentSuccess] = React.useState<boolean>(false);
  const {setNotification} = useNotification();

  useEffect(() => {
    setPaymentSuccess(false); // reset payment success
    profileService
    .getCreditCardByUserId(currentUser?.id)
    .then((data: CreditCardDto) => {
      setCreditCard(data);
      services.getLoanRemindersByUserCreditCardNumber(data.cardNumber).then((data: LoanReminderDto[]) => {
        setLoanReminders(data);
      }).catch((error) => {
        console.log('Load loan reminder failed', error);
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }, [paymentSuccess]);

  const openReminderDeleteModal = () => {
    setCancelModal(!cancelModal);
    services.getLoanRemindersByUserCreditCardNumber(creditCard!.cardNumber)
    .then((data: LoanReminderDto[]) => {
      setLoanReminders(data);
    }).catch((error) => {
      console.log('Load loan reminder failed', error);
    });
  }

  const addLoanReminderHandler = () => {
    navigate('/loan-management/create-loan-reminder');
  }

  const deleteLoanReminderHandler = (reminder: LoanReminderDto) => {
    console.log('deleteLoanReminderHandler');
    setReminderToDelete(reminder);
    openReminderDeleteModal();
  }

  const onPayReminderHandler = (reminder: LoanReminderDto) => {
    console.log('onPayReminderHandler');
    if (reminder.status === 'PAID') {
      setNotification(true, 'This reminder has been paid.', 'error', () => {});
    } else if (reminder.status === 'CANCELLED') {
      setNotification(true, 'This reminder has been cancelled.', 'error', () => {});
    } else {
      if (reminder.receiverId !== currentUser?.id) {
        setNotification(true, 'You are not allowed to pay this reminder', 'error', () => {});
      } else {
        setReminderToPay(reminder);
        setPaymentModal(!paymentModal);
      }
    }
  }

  const onAgreePaymentHandler = (reminder: LoanReminderDto) => {
    // check if user is really a receiver of this loan reminder
    console.log('onAgreePaymentHandler');
    setPaymentModal(!paymentModal);
    // we will validate and send OTP from this step
    services.validateLoanReminder(reminder.id).then((data: string) => {
      // open OTP modal to verify OTP
      setOtpModal(!otpModal);
    }).catch((e) => {
      console.log('Validate loan reminder failed', e);
      const notificationType: AlertColor = "error";
      const errorMessage: string = e.response.data['Error: '] || "Something went wrong!";
      console.log("errorMessage", errorMessage);
      setNotification(true, errorMessage, notificationType, () => {});
    });
  }

  return (
      <>
        <LoanReminderContext.Provider
            value={{modal: cancelModal, reminderToDelete, openReminderDeleteModal}}>
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <h3 className='fw-bolder my-2'>
              Total Reminders
              <span
                  className='fs-6 text-gray-400 fw-bold ms-1'>({loanReminders.filter(loanReminder => loanReminder.status === status || status === '').length})</span>
            </h3>

            <div className={'d-flex flex-center flex-wrap mb-5'}>
              <div className='d-flex my-2'>
                <select
                    name='bank'
                    data-control='select2'
                    data-hide-search='true'
                    className='form-select form-select-white form-select-sm w-125px'
                    defaultValue='Select a bank...'
                    onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=''>Status...</option>
                  <option value='PENDING'>PENDING</option>
                  <option value='PAID'>PAID</option>
                  <option value='CANCELLED'>CANCELLED</option>
                </select>
              </div>
              <button type='button' className='btn btn-sm btn-primary' style={{marginLeft: '10px'}}
                      onClick={addLoanReminderHandler}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
                Add Loan Reminder
              </button>
            </div>
          </div>

          <div className={'card mb-5 mb-xl-8'}>
            {/* begin::Body */}
            <div className='card-body py-3'>
              {/* begin::Table container */}
              <div className='table-responsive'>
                {/* begin::Table */}
                <table
                    className='table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3'>
                  {/* begin::Table head */}
                  <thead>
                  <tr className='fw-bold text-muted'>
                    <th className='min-w-30px'>Id</th>
                    <th className='min-w-20px'>Version</th>
                    <th className='min-w-120px'>Sender</th>
                    <th className='min-w-120px'>Receiver</th>
                    <th className='min-w-120px'>Transfer Amount</th>
                    <th className='min-w-120px'>Status</th>
                    <th className='min-w-120px'>Created Date</th>
                    <th className='min-w-120px'>Updated Date</th>
                    <th className='min-w-100px text-end'>Actions</th>
                  </tr>
                  </thead>
                  {/* end::Table head */}
                  {/* begin::Table body */}
                  <tbody>
                  {
                    loanReminders.filter((reminder) => reminder.status === status || status === '').map((reminder: LoanReminderDto) => (
                        <tr key={reminder.id}>
                          <td>
                            <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                              {reminder.id}
                            </a>
                          </td>
                          <td>
                            <a href='#' className='text-dark fw-bold text-hover-primary fs-6'>
                              {reminder.version}
                            </a>
                          </td>
                          <td>
                            <a href='#'
                               className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                              {reminder.senderCreditCardNumber}
                            </a>
                            <span
                                className='text-muted fw-semibold text-muted d-block fs-7'>{reminder.senderName}</span>
                          </td>
                          <td>
                            <a href='#'
                               className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                              {reminder.receiverCreditCardNumber}
                            </a>
                            <span
                                className='text-muted fw-semibold text-muted d-block fs-7'>{reminder.receiverName}</span>
                          </td>
                          <td className='text-dark fw-bold text-hover-primary fs-6'>
                            {reminder.transferAmount.toLocaleString('it-IT', {
                              style: 'currency',
                              currency: 'VND',
                            })
                            }
                          </td>
                          <td>
                            {
                              reminder.status === 'PENDING' ? (
                                  <span className='badge badge-light-primary'>PENDING</span>
                              ) : reminder.status === 'PAID' ? (
                                  <span className='badge badge-light-success'>PAID</span>
                              ) : (
                                  <span className='badge badge-light-danger'>CANCELLED</span>
                              )
                            }
                          </td>
                          <td>
                            <a href='#'
                               className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                              {new Date(reminder.time).toLocaleDateString()}
                            </a>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {new Date(reminder.time).toLocaleTimeString()}
                          </span>
                          </td>

                          <td>
                            <a href='#'
                               className='text-dark fw-bold text-hover-primary d-block mb-1 fs-6'>
                              {new Date(reminder.updatedTime).toLocaleDateString()}
                            </a>
                            <span className='text-muted fw-semibold text-muted d-block fs-7'>
                            {new Date(reminder.updatedTime).toLocaleTimeString()}
                          </span>
                          </td>

                          <td className='text-end'>
                            <button type='button'
                                    onClick={() => {
                                      onPayReminderHandler(reminder)
                                    }}
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                              <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-1' />
                            </button>
                            <button type='button'
                                    onClick={() => {
                                      deleteLoanReminderHandler(reminder)
                                    }}
                                    className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                              <KTSVG path='/media/icons/duotune/general/gen027.svg'
                                     className='svg-icon-3'/>
                            </button>
                          </td>
                        </tr>
                    ))
                  }
                  </tbody>
                  {/* end::Table body */}
                </table>
                {/* end::Table */}
              </div>
              {/* end::Table container */}
            </div>
            {/* begin::Body */}
          </div>

          <div className='d-flex flex-stack flex-wrap pt-10'>
            <div className='fs-6 fw-bold text-gray-700'>Showing 1 to 10 of 50 entries</div>

            <ul className='pagination'>
              <li className='page-item previous'>
                <a href='#' className='page-link'>
                  <i className='previous'></i>
                </a>
              </li>

              <li className='page-item active'>
                <a href='#' className='page-link'>
                  1
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  2
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  3
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  4
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  5
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  6
                </a>
              </li>

              <li className='page-item next'>
                <a href='#' className='page-link'>
                  <i className='next'></i>
                </a>
              </li>
            </ul>
          </div>
          <ReminderDeleteModal/>
        </LoanReminderContext.Provider>
        <ConfirmModal isShow={paymentModal}
                      header={'Payment Confirmation'}
                      content={'Are you sure you want to pay off this debt?'}
                      onConfirm={onAgreePaymentHandler}
                      onCancel={() => setPaymentModal(false)}
                      value={reminderToPay}
                      isShowCancelBtn={true}
        />

        <ReminderPaymentModal isShow={otpModal}
                              reminder={reminderToPay as LoanReminderDto}
                              setIsShowModal={setOtpModal}
                              setPaymentSuccess={setPaymentSuccess}
        />
      </>
  );
};

export default ListOfLoanReminders;