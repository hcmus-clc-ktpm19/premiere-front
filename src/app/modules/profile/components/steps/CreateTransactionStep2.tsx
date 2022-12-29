import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, Field, FormikProps} from 'formik';
import {services} from '@/app/modules/loan-management/core/services';
// @ts-ignore
import {ErrorDto, UserDto} from '@/app/models/model';
import {NavLink} from 'react-router-dom';
import {useIntl} from 'react-intl';
import {useAuth} from "@/app/modules/auth";

interface Props {
  formikProps: FormikProps<any>;
}

const CreateTransactionStep2: FC<Props> = (props: Props) => {
  const {formikProps} = props;
  const {currentUser} = useAuth();
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [error, setError] = useState<ErrorDto | null>(null);
  const intl = useIntl();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
    formikProps.handleChange(e);
  };

  useEffect(() => {
    setError(null);
    if (accountNumber.length === 0) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const res: UserDto = (await services.getUserByCardNumber(accountNumber)) as UserDto;
        formikProps.setFieldValue('receiverCardNumber', accountNumber);
        formikProps.setFieldValue('receiverName', `${res.firstName} ${res.lastName}`);
        formikProps.setFieldValue('receiverBankName', 'Premierebank');
        formikProps.setErrors({});
      } catch (e: ErrorDto | any) {
        formikProps.setFieldValue('receiverCardNumber', accountNumber);
        formikProps.setFieldValue('receiverName', '');
        formikProps.setFieldValue('receiverBankName', 'Premierebank');
        formikProps.setErrors(e);

        setError(e);
      } finally {
        clearInterval(intervalId);
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
                {intl.formatMessage({id: error.i18nPlaceHolder})}
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
              // value={`${currentUser!.lastName} ${currentUser!.firstName} sent you ${formikProps.values.transferAmount} VND`}
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

      </div>
  );
};

export {CreateTransactionStep2};
