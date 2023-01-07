import React, {FC} from 'react';
import {KTSVG} from "@_metronic/helpers";
import {useFormik} from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import {LoanReminderDto, LoanReminderMessageDto} from "@/app/modules/loan-management/core/_dtos";
import {TransferMoneyRequestDto} from "@/app/models/model";
import {services} from "@/app/modules/loan-management/core/services";
import {AlertColor} from "@mui/material";
import useNotification from "@/app/modules/notifications/useNotification";
import {useAuth} from "@/app/modules/auth";

type Props = {

  isShow: boolean;
  setIsShowModal: (isShowModal: boolean) => void;
  setPaymentSuccess: (isPaymentSuccess: boolean) => void;
  reminder: LoanReminderDto;
};

const otpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 characters').required('OTP is required'),
});

const initialValues = {
  otp: ''
};

const ReminderPaymentModal: FC<Props> = ({isShow, setIsShowModal, reminder, setPaymentSuccess}) => {

  const {setNotification} = useNotification();
  const {currentUser} = useAuth();

  const formik = useFormik(
      {
        initialValues,
        validationSchema: otpSchema,
        onSubmit: async (values) => {
          const loanReminderPayDto: TransferMoneyRequestDto = {
            requestID: reminder.id,
            otp: values.otp
          };
          console.log('submitting', loanReminderPayDto);
          try {
            await services.payLoanReminder(loanReminderPayDto);
            setIsShowModal(false);
            setPaymentSuccess(true); // set payment success to true in order to trigger reload data
            setNotification(true, 'Debt is paid successfully', 'success', () => {});
            // TODO: send notification to sender user
            const loanReminderMessageDto: LoanReminderMessageDto = {
              senderId: currentUser!.id,
              senderName: currentUser?.lastName + ' ' + currentUser?.firstName,
              receiverId: reminder.senderId,
              receiverName: reminder.senderName,
              message: `${currentUser?.lastName + ' ' + currentUser?.firstName} has paid your debt of ${reminder.transferAmount} VND`,
              destination: '/loan-management/list-of-loan-reminders'
            }
            // push notification to RabbitMQ in order to notify sender user
            await services.pushMessageToMessageQueue(loanReminderMessageDto);
          } catch (e: any) {
            console.log(e);
            const notificationType: AlertColor = "error";
            const errorMessage: string = e.response.data['Error: '] || "Something went wrong!";
            console.log("errorMessage", errorMessage);
            setNotification(true, errorMessage, notificationType, () => {});
          }
        }
      }
  );

  if (!isShow) {
    return null;
  }

  return (
      <>
        <div
            className='modal fade show d-block'
            id='kt_modal_add_user'
            role='dialog'
            tabIndex={-1}
            aria-modal='true'
        >
          {/* begin::Modal dialog */}
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            {/* begin::Modal content */}
            <div className='modal-content'>
              <div className='modal-header'>
                {/* begin::Modal title */}
                <h2 className='fw-bolder'>Reminder Payment</h2>
                {/* end::Modal title */}

                {/* begin::Close */}
                <div
                    className='btn btn-icon btn-sm btn-active-icon-primary'
                    data-kt-users-modal-action='close'
                    onClick={() => setIsShowModal(false)}
                    style={{cursor: 'pointer'}}
                >
                  <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1'/>
                </div>
                {/* end::Close */}

              </div>
              {/* begin::Modal body */}
              <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
                <form
                    className='form w-100'
                    onSubmit={formik.handleSubmit}
                    noValidate
                    id='kt_login_signin_form'
                >
                  <div className='mb-5 bg-light-info p-8 rounded'>
                    <div className='text-info'>
                      Enter OTP sent to your email
                    </div>
                  </div>
                  <div className='fv-row mb-8'>
                    <label className='form-label fs-6 fw-bolder text-dark'>OTP</label>
                    <input
                        placeholder='OTP'
                        {...formik.getFieldProps('otp')}
                        className={clsx(
                            'form-control bg-transparent',
                            {'is-invalid': formik.touched.otp && formik.errors.otp},
                            {
                              'is-valid': formik.touched.otp && !formik.errors.otp,
                            }
                        )}
                        type='text'
                        name='otp'
                        autoComplete='off'
                    />
                    {formik.touched.otp && formik.errors.otp && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert'>{formik.errors.otp}</span>
                          </div>
                        </div>
                    )}
                  </div>
                  <button type={'submit'}
                          className={'btn btn-primary float-end'}
                          onClick={() => {
                          }}
                  >
                    Confirm
                  </button>
                </form>

              </div>
              {/* end::Modal body */}
            </div>
            {/* end::Modal content */}
          </div>
          {/* end::Modal dialog */}
        </div>
        {/* begin::Modal Backdrop */}
        <div className='modal-backdrop fade show'></div>
        {/* end::Modal Backdrop */}
      </>
  );
};

export default ReminderPaymentModal;