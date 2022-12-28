import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, Field, FormikProps} from 'formik';
import {services} from '@/app/modules/loan-management/core/services';
// @ts-ignore
import {ErrorDto, UserDto} from '@/app/models/model';
import {NavLink} from 'react-router-dom';
import {useIntl} from 'react-intl';

interface Props {
  formikProps: FormikProps<any>;
}

const CreateTransactionStep2: FC<Props> = (props: Props) => {
  const {formikProps} = props;
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
        formikProps.setFieldValue('debtorCreditCardNumber', accountNumber);
        formikProps.setFieldValue('debtorName', `${res.firstName} ${res.lastName}`);
        formikProps.setFieldValue('debtorPhone', res.phone);
        formikProps.setErrors({});
      } catch (e: ErrorDto | any) {
        formikProps.setFieldValue('debtorCreditCardNumber', accountNumber);
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
          <h2 className='fw-bolder text-dark'>Loan Reminder Details</h2>

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
          <label className='form-label required'>Enter debtor's credit card number</label>

          <Field
              onChange={handleOnChange}
              name='debtorCreditCardNumber'
              className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='debtorCreditCardNumber' />
          </div>

          {error && (
              <div className='form-text text-danger'>
                {intl.formatMessage({id: error.i18nPlaceHolder})}
              </div>
          )}
        </div>

        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Debtor's Name</span>
          </label>

          <Field name='debtorName' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='debtorName' />
          </div>

          <div className='form-text'>
            This name will be kept and applied to the subsequent transaction.
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

        <div className='fv-row mb-10'>
          <label className='form-label'>Content</label>

          <Field
              as='textarea'
              name='loanRemark'
              className='form-control form-control-lg form-control-solid'
              rows={3}
          ></Field>
        </div>

        <div className='fv-row mb-0'>
          <label className='fs-6 fw-bold form-label'>Debtor's phone number</label>

          <Field name='debtorPhone' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='debtorPhone' />
          </div>
        </div>
      </div>
  );
};

export {CreateTransactionStep2};
