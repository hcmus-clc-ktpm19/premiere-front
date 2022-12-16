import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, Field, FormikProps} from 'formik';
import {LoanReminderDto} from '@/app/modules/wizards/components/CreateAccountWizardHelper';

interface Props {
  formikProps: FormikProps<any>;
}

const Step1: FC<Props> = (props: Props) => {
  const {formikProps} = props;
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [loanReminder, setLoanReminder] = useState<LoanReminderDto>({
    accountNumber: '',
    content: '',
    debtorName: '',
    debtorPhone: '',
    transferAmount: 0,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
    formikProps.handleChange(e);
  }

  useEffect(() => {
    if (accountNumber.length == 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setLoanReminder({
        accountNumber,
        debtorName: 'Nguyen Van A',
        transferAmount: 1000000,
        debtorPhone: '0123456789',
      });
      formikProps.setFieldValue('accountNumber', accountNumber);
      formikProps.setFieldValue('debtorName', 'Nguyen Van A');
      formikProps.setFieldValue('transferAmount', 1000000);
      formikProps.setFieldValue('debtorPhone', '0123456789');
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [accountNumber]);

  return (
    <div className='w-100'>
      <div className='pb-10 pb-lg-12'>
        <h2 className='fw-bolder text-dark'>Loan Reminder Details</h2>

        <div className='text-gray-400 fw-bold fs-6'>
          If you need more info, please check out
          <a href='/dashboard' className='link-primary fw-bolder'>
            {' '}
            Help Page
          </a>
          .
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Enter debtor's account number</label>

        <Field
          value={accountNumber}
          onChange={handleOnChange}
          name='accountNumber'
          className='form-control form-control-lg form-control-solid'
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='accountNumber' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Debtor's Name</span>
        </label>

        <Field value={loanReminder.debtorName} name='debtorName' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='debtorName' />
        </div>

        <div className='form-text'>Save name</div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Transfer Amount</label>

        <Field value={loanReminder.transferAmount} name='transferAmount' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='transferAmount' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label'>Content</label>

        <Field
          as='textarea'
          name='content'
          className='form-control form-control-lg form-control-solid'
          rows={3}></Field>
      </div>

      <div className='fv-row mb-0'>
        <label className='fs-6 fw-bold form-label'>Debtor's phone number</label>

        <Field value={loanReminder.debtorPhone} name='debtorPhone' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='debtorPhone' />
        </div>
      </div>
    </div>
  );
};

export {Step1};
