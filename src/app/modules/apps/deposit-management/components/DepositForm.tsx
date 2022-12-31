import React, { FC, useEffect, useState } from 'react';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { services } from '@/app/modules/loan-management/core/services';
import { ErrorDto, UserDto } from '@/app/models/model';
import { NavLink } from 'react-router-dom';
import { useIntl } from 'react-intl';

interface Props {
  formikProps: FormikProps<any>;
}

const DepositForm: FC<Props> = (props: Props) => {
  const { formikProps } = props;
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
        formikProps.setFieldValue('depositWith', accountNumber);
        formikProps.setFieldValue('debtorName', `${res.firstName} ${res.lastName}`);
        formikProps.setFieldValue('debtorPhone', res.phone);
        formikProps.setErrors({});
      } catch (e: ErrorDto | any) {
        formikProps.setFieldValue('depositWith', accountNumber);
        formikProps.setFieldValue('debtorName', '');
        formikProps.setFieldValue('debtorPhone', '');
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
        <h2 className='fw-bolder text-dark'>Deposit Money</h2>

        <div className='text-gray-400 fw-bold fs-6'>
          If you need more info, please check out
          <NavLink className='link-primary fw-bolder' to='/dashboard'>
            {' '}
            Help Page
          </NavLink>
          .
        </div>
      </div>

      <div className='fv-row mb-10 flex-row justify-content-center'>
        <label className='form-label required me-4'>
          Use phone or credit card number to deposit:
        </label>

        <div className='btn-group' role='group' aria-label='Basic radio toggle button group'>
          <Field
            type='radio'
            className='btn-check'
            name='depositWithPhone'
            id='phoneNumber'
            autoComplete='off'
            checked
          />
          <label className='btn btn-outline-primary' htmlFor='phoneNumber'>
            Phone Number
          </label>

          <Field
            type='radio'
            className='btn-check'
            name='depositWithPhone'
            id='creditCardNumber'
            autoComplete='off'
          />
          <label className='btn btn-outline-primary' htmlFor='creditCardNumber'>
            Credit Card Number
          </label>
        </div>
        <div className='text-danger mt-2'>
          <ErrorMessage name='depositWith' />
        </div>

        {error && (
          <div className='form-text text-danger'>
            {intl.formatMessage({ id: error.i18nPlaceHolder })}
          </div>
        )}
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Phone Number</span>
        </label>

        <Field name='debtorName' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='debtorName' />
        </div>
      </div>

      <div className='fv-row mb-0'>
        <label className='fs-6 fw-bold form-label'>Credit Card Number</label>

        <Field name='debtorPhone' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='debtorPhone' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Transfer Amount</label>

        <Field name='transferAmount' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='transferAmount' />
        </div>

        <div className='form-text'>Minimum transfer amount is 100,000 VND.</div>
      </div>
    </div>
  );
};

export { DepositForm };
