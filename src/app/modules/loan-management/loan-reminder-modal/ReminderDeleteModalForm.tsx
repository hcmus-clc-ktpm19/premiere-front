import {LoanReminderDto, LoanReminderMessageDto} from "@/app/modules/loan-management/core/_dtos";
import React, {FC, useContext} from "react";
import {KTSVG} from "@_metronic/helpers";
import {useFormik} from "formik";
import clsx from "clsx";
import {ReceiversListLoading} from "@/app/modules/profile/loading/ReceiversListLoading";
import * as Yup from "yup";
import {LoanReminderContext} from "@/app/modules/loan-management/components/ListOfLoanReminders";
import {services} from "@/app/modules/loan-management/core/services";
import {useAuth} from "@/app/modules/auth";

type Props = {
  reminder: LoanReminderDto;
  isReminderLoading: boolean;
}
const initialValues = {
  cancelReason: 'I no longer need this loan reminder',
  loanRemark: '',
}
const loanReminderSchema = Yup.object().shape({
  cancelReason: Yup.string()
  .min(3, 'Minimum 3 symbols'),
  loanRemark: Yup.string()
  .min(3, 'Minimum 3 symbols')
});

const ReminderDeleteModalForm: FC<Props> = ({reminder, isReminderLoading}) => {
  // @ts-ignore
  const {openReminderDeleteModal} = useContext(LoanReminderContext);
  const {currentUser} = useAuth();
  const cancel = (withRefresh?: boolean) => {
    openReminderDeleteModal();
  };
  console.log({reminder});

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loanReminderSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true);
      console.log(values);
      try {
        const loanReminderToCancel: LoanReminderDto = {
          ...reminder,
          cancelReason: values.cancelReason,
        }
        console.log(loanReminderToCancel);
        await services.cancelLoanReminder(loanReminderToCancel);
        // after canceled loan reminder, send a notification to the receiver and redirect to the list of loan reminders
        let loanReminderMessageDto: LoanReminderMessageDto;
        if (currentUser?.id === reminder.senderId) {
          loanReminderMessageDto = {
            senderId: reminder.senderId,
            senderName: reminder.senderName,
            receiverId: reminder.receiverId,
            receiverName: reminder.receiverName,
            message: `You have a cancelled loan reminder message from ${reminder.senderName}`,
          }
        } else {
          loanReminderMessageDto = {
            senderId: reminder.receiverId,
            senderName: reminder.receiverName,
            receiverId: reminder.senderId,
            receiverName: reminder.senderName,
            message: `You have a cancelled loan reminder message from ${reminder.receiverName}`,
          }
        }
        // push message to RabbitMQ
        await services.pushMessageToMessageQueue(loanReminderMessageDto);
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(true);
        cancel(true);
      }
    },
  });

  return (
      <>
        <div className={'card card card-xl-stretch mb-xl-8'}>
          {/* begin::Body */}
          <div className='card-body p-0'>
            {/* begin::Header */}
            <div className={'px-9 pt-7 card-rounded h-275px w-100 bg-danger'}>
              {/* begin::Balance */}
              <div className='d-flex text-center flex-column text-white pt-8'>
                <span className='fw-semibold fs-7'>Transfer Amount</span>
                <span className='fw-bold fs-2x pt-1'>
                  {reminder.transferAmount.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })
                  }
                </span>
              </div>
              {/* end::Balance */}
            </div>
            {/* end::Header */}
            {/* begin::Items */}
            <div
                className='shadow-xs card-rounded mx-9 mb-9 px-6 py-9 position-relative z-index-1 bg-body'
                style={{marginTop: '-150px'}}
            >
              {/* begin::Item */}
              <div className='d-flex align-items-center mb-6'>
                {/* begin::Symbol */}
                <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/maps/map004.svg' className='svg-icon-1' />
              </span>
                </div>
                {/* end::Symbol */}
                {/* begin::Description */}
                <div className='d-flex align-items-center flex-wrap w-100'>
                  {/* begin::Title */}
                  <div className='mb-1 pe-3 flex-grow-1'>
                    <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                      {reminder.senderName}
                    </a>
                    <div className='text-gray-400 fw-semibold fs-7'>{reminder.senderCreditCardNumber}</div>
                  </div>
                  {/* end::Title */}
                  {/* begin::Label */}
                  <div className='d-flex align-items-center'>
                    <div className='fw-bold fs-5 text-gray-800 pe-1'>Sender</div>
                    <KTSVG
                        path='/media/icons/duotune/arrows/arr066.svg'
                        className='svg-icon-5 svg-icon-success ms-1'
                    />
                  </div>
                  {/* end::Label */}
                </div>
                {/* end::Description */}
              </div>
              {/* end::Item */}
              {/* begin::Item */}
              <div className='d-flex align-items-center mb-6'>
                {/* begin::Symbol */}
                <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-1' />
              </span>
                </div>
                {/* end::Symbol */}
                {/* begin::Description */}
                <div className='d-flex align-items-center flex-wrap w-100'>
                  {/* begin::Title */}
                  <div className='mb-1 pe-3 flex-grow-1'>
                    <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                      {reminder.receiverName}
                    </a>
                    <div className='text-gray-400 fw-semibold fs-7'>{reminder.receiverCreditCardNumber}</div>
                  </div>
                  {/* end::Title */}
                  {/* begin::Label */}
                  <div className='d-flex align-items-center'>
                    <div className='fw-bold fs-5 text-gray-800 pe-1'>Receiver</div>
                    <KTSVG
                        path='/media/icons/duotune/arrows/arr065.svg'
                        className='svg-icon-5 svg-icon-danger ms-1'
                    />
                  </div>
                  {/* end::Label */}
                </div>
                {/* end::Description */}
              </div>
              {/* end::Item */}
              {/* begin::Item */}
              <div className='d-flex align-items-center mb-6'>
                {/* begin::Symbol */}
                <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/electronics/elc005.svg' className='svg-icon-1' />
              </span>
                </div>
                {/* end::Symbol */}
                {/* begin::Description */}
                <div className='d-flex align-items-center flex-wrap w-100'>
                  {/* begin::Title */}
                  <div className='mb-1 pe-3 flex-grow-1'>
                    {
                      reminder.status === 'PENDING' ? (
                          <span className='badge badge-light-primary'>PENDING</span>
                      ) : reminder.status === 'APPROVED' ? (
                          <span className='badge badge-light-success'>APPROVED</span>
                      ) : reminder.status === 'REJECTED' ? (
                          <span className='badge badge-light-warning'>REJECTED</span>
                      ) : (
                          <span className='badge badge-light-danger'>CANCELLED</span>
                      )
                    }
                  </div>
                  {/* end::Title */}
                  {/* begin::Label */}
                  <div className='d-flex align-items-center'>
                    <div className='fw-bold fs-5 text-gray-800 pe-1'>Status</div>
                    <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-1' />
                  </div>
                  {/* end::Label */}
                </div>
                {/* end::Description */}
              </div>
              {/* end::Item */}
              {/* begin::Item */}
              <div className='d-flex align-items-center'>
                {/* begin::Symbol */}
                <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-1' />
              </span>
                </div>
                {/* end::Symbol */}
                {/* begin::Description */}
                <div className='d-flex align-items-center flex-wrap w-100'>
                  {/* begin::Title */}
                  <div className='mb-1 pe-3 flex-grow-1'>
                    <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                      {new Date(reminder.time).toLocaleDateString()}
                    </a>
                    <div className='text-gray-400 fw-semibold fs-7'>{new Date(reminder.time).toLocaleTimeString()}</div>
                  </div>
                  {/* end::Title */}
                  {/* begin::Label */}
                  <div className='d-flex align-items-center'>
                    <div className='fw-bold fs-5 text-gray-800 pe-1'>Created Date</div>
                    <KTSVG
                        path='/media/icons/duotune/arrows/arr065.svg'
                        className='svg-icon-5 svg-icon-danger ms-1'
                    />
                  </div>
                  {/* end::Label */}
                </div>
                {/* end::Description */}
              </div>
              {/* end::Item */}
            </div>
            {/* end::Items */}
          </div>
          {/* end::Body */}
        </div>
        <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
          {/* begin::Scroll */}
          <div
              className='d-flex flex-column scroll-y me-n7 pe-7'
              id='kt_modal_add_user_scroll'
              data-kt-scroll='true'
              data-kt-scroll-activate='{default: false, lg: true}'
              data-kt-scroll-max-height='auto'
              data-kt-scroll-dependencies='#kt_modal_add_user_header'
              data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
              data-kt-scroll-offset='300px'
          >

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Loan Remark</label>
              {/* end::Label */}

              {/* begin::Input */}
              <textarea
                  placeholder='Input your loan remark'
                  {...formik.getFieldProps('loanRemark')}
                  className={clsx(
                      'form-control form-control-solid mb-3 mb-lg-0',
                      {'is-invalid': formik.touched.loanRemark && formik.errors.loanRemark},
                      {
                        'is-valid': formik.touched.loanRemark && !formik.errors.loanRemark,
                      }
                  )}
                  name='loanRemark'
                  autoComplete='off'
                  disabled={true}
                  rows={5}
                  value={reminder.loanRemark}
              />
              {/* end::Input */}
              {formik.touched.loanRemark && formik.errors.loanRemark && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{formik.errors.loanRemark}</span>
                  </div>
              )}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>Cancel Reason</label>
              {/* end::Label */}

              {/* begin::Input */}
              <textarea
                  placeholder='Input your cancel reason'
                  {...formik.getFieldProps('cancelReason')}
                  className={clsx(
                      'form-control form-control-solid mb-3 mb-lg-0',
                      {'is-invalid': formik.touched.cancelReason && formik.errors.cancelReason},
                      {
                        'is-valid': formik.touched.cancelReason && !formik.errors.cancelReason,
                      }
                  )}
                  name='cancelReason'
                  autoComplete='off'
                  disabled={formik.isSubmitting || isReminderLoading || reminder.status === 'CANCELLED'}
                  rows={5}
                  value={reminder.cancelReason}
              />
              {/* end::Input */}
              {formik.touched.cancelReason && formik.errors.cancelReason && (
                  <div className='fv-plugins-message-container'>
                    <span role='alert'>{formik.errors.cancelReason}</span>
                  </div>
              )}
            </div>
            {/* end::Input group */}
          </div>

          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
                type='reset'
                onClick={() => cancel()}
                className='btn btn-light me-3'
                data-kt-users-modal-action='cancel'
                disabled={formik.isSubmitting || isReminderLoading}
            >
              Discard
            </button>

            <button
                type='submit'
                className='btn btn-primary'
                data-kt-users-modal-action='submit'
                disabled={isReminderLoading || formik.isSubmitting || !formik.isValid || !formik.touched || reminder.status === 'CANCELLED'}
            >
              <span className='indicator-label'>Confirm</span>
              {(formik.isSubmitting || isReminderLoading) && (
                  <span className='indicator-progress'>
                Please wait...{' '}
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
              )}
            </button>
          </div>
          {/* end::Actions */}
        </form>
        {(formik.isSubmitting || isReminderLoading) && <ReceiversListLoading />}
      </>
  );
};

export {ReminderDeleteModalForm};