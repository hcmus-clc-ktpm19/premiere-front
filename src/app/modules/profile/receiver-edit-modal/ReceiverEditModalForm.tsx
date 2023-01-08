import React, { FC, useContext, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { isNotEmpty, toAbsoluteUrl } from '@_metronic/helpers';
import { CreditCardDto, ExternalUserDto, ReceiverDto } from '@/app/modules/profile/core/_dtos';
import clsx from 'clsx';
import { ReceiversListLoading } from '@/app/modules/profile/loading/ReceiversListLoading';
import { ProfileService as profileService } from '../core/_requests';
import { useAuth } from '@/app/modules/auth';
import { ReceiverModalContext } from '@/app/modules/profile/components/Receivers';
import useNotification from '@/app/modules/notifications/useNotification';
import { AlertColor } from '@mui/material';
import { useQuery } from 'react-query';
import { services } from '@/app/modules/loan-management/core/services';

type Props = {
  receiver: ReceiverDto;
  isReceiverLoading: boolean;
};

const insertReceiverSchema = Yup.object().shape({
  cardNumber: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Card number is required'),
  nickname: Yup.string().min(3, 'Minimum 3 symbols').max(50, 'Maximum 50 symbols'),
  bankName: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Bank name is required'),
});

const ReceiverEditModalForm: FC<Props> = ({ receiver, isReceiverLoading }) => {
  // @ts-ignore
  const { openAddReceiverModal } = useContext(ReceiverModalContext);
  const { currentUser } = useAuth();
  const { setNotification } = useNotification();
  const [receiverToInsert] = useState<ReceiverDto>(receiver);
  const [currentUserCreditCard, setCurrentUserCreditCard] = React.useState<CreditCardDto>();

  const { data } = useQuery('creditCard', async () => {
    try {
      const response = await profileService.getCreditCardByUserId(currentUser?.id);
      setCurrentUserCreditCard(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  });

  const cancel = (withRefresh?: boolean) => {
    openAddReceiverModal();
  };

  const blankImg = toAbsoluteUrl('/media/svg/avatars/blank.svg');
  const userAvatarImg = toAbsoluteUrl('/media/avatars/300-6.jpg');

  const formik = useFormik({
    initialValues: receiverToInsert,
    validationSchema: insertReceiverSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      values.userId = currentUser?.id || -1;
      values.cardNumber = values.cardNumber.trim();
      console.log('value from receiver edit modal form', values);
      try {
        if (isNotEmpty(values.id)) {
          console.log('update receiver');
          await profileService.updateReceiver(values);
        } else {
          console.log('insert receiver');
          if (values.cardNumber === currentUserCreditCard?.cardNumber) {
            setNotification(true, 'You cannot add yourself as  a receiver', 'error', () => {});
          } else {
            if (values.bankName === 'Premierebank') {
              await profileService.insertReceiver(values);
            } else {
              // validate external card before insert
              const res: ExternalUserDto = await services.getExternalCreditCardByCardNumber(
                values.cardNumber
              );
              console.log('res from receiver', { res });
              if (res) {
                values.fullName = res.data.user.name;
                await profileService.insertReceiverExternal(values);
              }
            }
          }
        }
      } catch (e: AxiosError | any) {
        console.log({ e });
        const notificationType: AlertColor = 'error';
        const errorMessage: string =
          e?.response?.data?.message || e?.message || 'Something went wrong!';
        console.log('errorMessage', errorMessage);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        setNotification(true, errorMessage, notificationType, () => {});
      } finally {
        setSubmitting(true);
        cancel(true);
      }
    },
  });

  return (
    <>
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
          data-kt-scroll-offset='300px'>
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='d-block fw-bold fs-6 mb-5'>Avatar</label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className='image-input image-input-outline'
              data-kt-image-input='true'
              style={{ backgroundImage: `url('${blankImg}')` }}>
              {/* begin::Preview existing avatar */}
              <div
                className='image-input-wrapper w-125px h-125px'
                style={{ backgroundImage: `url('${userAvatarImg}')` }}></div>
              {/* end::Preview existing avatar */}
            </div>
            {/* end::Image input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Card Number</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Card number'
              {...formik.getFieldProps('cardNumber')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.cardNumber && formik.errors.cardNumber },
                {
                  'is-valid': formik.touched.cardNumber && !formik.errors.cardNumber,
                }
              )}
              type='text'
              name='cardNumber'
              autoComplete='off'
              disabled={formik.isSubmitting || isReceiverLoading}
            />
            {/* end::Input */}
            {formik.touched.cardNumber && formik.errors.cardNumber && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.cardNumber}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='fw-bold fs-6 mb-2'>Nickname</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Nickname'
              {...formik.getFieldProps('nickname')}
              type='text'
              name='nickname'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.nickname && formik.errors.nickname },
                {
                  'is-valid': formik.touched.nickname && !formik.errors.nickname,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isReceiverLoading}
            />
            {formik.touched.nickname && formik.errors.nickname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.nickname}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        <div className='row mb-6'>
          <label className='col-lg-4 col-form-label fw-bold fs-6'>
            <span className='required'>Bank</span>
          </label>

          <div className='col-lg-8 fv-row'>
            <select
              className='form-select form-select-solid form-select-lg fw-bold'
              {...formik.getFieldProps('bankName')}>
              <option value=''>Select a bank...</option>
              <option value='Premierebank'>Premierebank</option>
              <option value='Taixiubank'>Taixiubank</option>
            </select>
            {formik.touched.bankName && formik.errors.bankName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>{formik.errors.bankName}</div>
              </div>
            )}
          </div>
        </div>

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isReceiverLoading}>
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={
              isReceiverLoading || formik.isSubmitting || !formik.isValid || !formik.touched
            }>
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isReceiverLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isReceiverLoading) && <ReceiversListLoading />}
    </>
  );
};

export { ReceiverEditModalForm };
