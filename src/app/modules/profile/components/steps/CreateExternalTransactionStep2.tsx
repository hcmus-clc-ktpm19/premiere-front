import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, Field, FormikProps} from 'formik';
import {services} from '@/app/modules/loan-management/core/services';
import {ErrorDto} from '@/app/models/model';
import {NavLink} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {KTSVG} from "@_metronic/helpers";
import ReceiverListModal from "@/app/modules/profile/receiver-list-modal/ReceiverListModal";
import {ExternalUserDto, ReceiverDto} from "@/app/modules/profile/core/_dtos";

interface Props {
  formikProps: FormikProps<any>;
}

const CreateExternalTransactionStep2: FC<Props> = (props: Props) => {
  const {formikProps} = props;

  const [accountNumber, setAccountNumber] = useState<string>('');
  const [error, setError] = useState<ErrorDto | null>(null);
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [receiver, setReceiver] = useState<ReceiverDto | null>(null);
  const intl = useIntl();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
    setReceiver(null);
    formikProps.handleChange(e);
  };

  const handleOnConfirmBtn = (selectedReceiver: ReceiverDto | null) => {
    console.log("selectedReceiver", selectedReceiver);
    setAccountNumber(selectedReceiver!.cardNumber);
    setReceiver(selectedReceiver);
    setIsShowModal(false);
  }



  useEffect(() => {
    setError(null);
    if (accountNumber.length === 0) {
      return;
    }

    const intervalId = setInterval(async () => {
      if (receiver) {
        formikProps.setFieldValue('receiverCardNumber', receiver.cardNumber);
        formikProps.setFieldValue('receiverName', receiver.fullName);
        formikProps.setFieldValue('receiverBankName', receiver.bankName);
        formikProps.setErrors({});
      } else {
        try {
          const res: ExternalUserDto = (await services.getExternalCreditCardByCardNumber(accountNumber)) as ExternalUserDto; // TODO: change to get user by card number external
          console.log("res", {res});
          formikProps.setFieldValue('receiverCardNumber', accountNumber);
          formikProps.setFieldValue('receiverName', `${res.user.name}`);
          formikProps.setFieldValue('receiverBankName', 'Taixiubank');
          formikProps.setErrors({});
        } catch (e: ErrorDto | any) {
          console.log('error happen')
          formikProps.setFieldValue('receiverCardNumber', accountNumber);
          formikProps.setFieldValue('receiverName', '');
          formikProps.setFieldValue('receiverBankName', 'Taixiubank');
          formikProps.setErrors(e);

          setError(e);
        } finally {
          clearInterval(intervalId);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);

  }, [accountNumber]);

  return (
      <div className='w-100'>
        <div className='pb-10 pb-lg-12'>
          <h2 className='fw-bolder text-dark'>Transaction Details</h2>

          <div className='text-gray-400 fw-bold fs-6'>
            If you need more info, please check out
            <NavLink className='link-primary fw-bolder' to='/dashboard'>
              {' '}
              Help Page
            </NavLink>
            .
          </div>

          <button
              className='btn btn-danger btn-sm float-end'
              data-bs-toggle='tooltip'
              title='Choose from your receiver list'
              type={'button'}
              onClick={() => setIsShowModal(true)}
          >
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
            Contacts
          </button>
        </div>

        <div className='fv-row mb-10'>
          <label className='form-label required'>Enter recipient's credit card number</label>

          <Field
              onChange={handleOnChange}
              name='receiverCardNumber'
              className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='receiverCardNumber' />
          </div>

          {error && (
              <div className='form-text text-danger'>
                {/*{intl.formatMessage({id: error.i18nPlaceHolder})}*/}
                Credit card with this number is not found
              </div>
          )}
        </div>

        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Recipient's Name</span>
          </label>

          <Field name='receiverName' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='receiverName' />
          </div>

          <div className='form-text'>
            This name will be kept and applied to the subsequent transaction.
          </div>
        </div>

        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Recipient Bank Name</span>
          </label>

          <Field name='receiverBankName' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='receiverBankName' />
          </div>
        </div>

        <div className='fv-row mb-10'>
          <label className='form-label required'>Transfer Amount</label>

          <Field name='amount' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='amount' />
          </div>

          <div className='form-text'>Minimum transfer amount is 100,000 VND.</div>
        </div>

        <div className='fv-row mb-10'>
          <label className='form-label'>Remark</label>

          <Field
              as='textarea'
              name='remark'
              className='form-control form-control-lg form-control-solid'
              rows={3}
          ></Field>
        </div>

        <div className='form-check form-check-sm form-check-custom form-check-solid mb-10'>
          <Field
              className='form-check-input'
              type='checkbox'
              data-kt-check='true'
              data-kt-check-target='.widget-9-check'
              name={'isSelfPaymentFee'}
          />
          <label className='form-check-label fw-bold text-gray-600'>
            Self Payment
          </label>
        </div>
        <ReceiverListModal isShow={isShowModal}
                           setIsShowModal={setIsShowModal}
                           handleOnConfirmBtn={handleOnConfirmBtn}
                           isInternal={false}
        />
      </div>
  );
};

export {CreateExternalTransactionStep2};
