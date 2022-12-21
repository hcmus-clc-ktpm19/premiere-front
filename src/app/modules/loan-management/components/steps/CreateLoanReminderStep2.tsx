import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, Field, FormikProps} from 'formik';
import {NavLink} from 'react-router-dom';
import {CreditCardDto, ErrorDto} from '@/app/models/model';
import {services} from '@/app/modules/loan-management/core/services';
import {useIntl} from 'react-intl';

interface Props {
  formikProps: FormikProps<any>;
}

const CreateLoanReminderStep2: FC<Props> = (props: Props) => {
  const {formikProps} = props;
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [error, setError] = useState<ErrorDto | null>(null);
  const intl = useIntl();

  const handleOnChange = (e: React.ChangeEvent<any>) => {
    setAccountNumber(e.target?.value);
  };

  useEffect(() => {
    setError(null);
    if (accountNumber.length === 0) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const res: CreditCardDto = (await services.getCreditCardByCardNumber(
          accountNumber
        )) as CreditCardDto;
        formikProps.setFieldValue('creditorCreditCardNumber', accountNumber);
        formikProps.setFieldValue('creditorCreditCardId', res.id);
        formikProps.setErrors({});
      } catch (e: ErrorDto | any) {
        formikProps.setFieldValue('creditorCreditCardNumber', accountNumber);
        formikProps.setFieldValue('creditorCreditCardId', '');
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
        <h2 className='fw-bolder text-dark'>Beneficiary Account Information</h2>

        <div className='text-gray-400 fw-bold fs-6'>
          If you need more info, please check out
          <NavLink to='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </NavLink>
          .
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Enter your beneficiary's account number</label>

        <input
          name='creditorCreditCardNumber'
          className='form-control form-control-lg form-control-solid'
          onChange={handleOnChange}
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='creditorCreditCardNumber' />
        </div>

        {error && (
          <div className='form-text text-danger'>
            {intl.formatMessage({id: error.i18nPlaceHolder})}
          </div>
        )}
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>ID</span>
        </label>

        <Field
          name='creditorCreditCardId'
          disabled
          className='form-control form-control-lg form-control-solid'
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='creditorCreditCardId' />
        </div>
      </div>
    </div>
  );
};

export {CreateLoanReminderStep2};
