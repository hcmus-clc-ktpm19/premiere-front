import React, {FC} from 'react';
import {Field, ErrorMessage} from 'formik';

const LoanReminderForm: FC = () => {
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

        <Field name='accountNumber' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='accountNumber' />
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='d-flex align-items-center form-label'>
          <span className='required'>Debtor's Name</span>
        </label>

        <Field
          name='debtorName'
          className='form-control form-control-lg form-control-solid'
        />
        <div className='text-danger mt-2'>
          <ErrorMessage name='debtorName' />
        </div>

        <div className='form-text'>
          Save name
        </div>
      </div>

      <div className='fv-row mb-10'>
        <label className='form-label required'>Transfer Amount</label>

        <Field name='transferAmount' className='form-control form-control-lg form-control-solid' />
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

export {LoanReminderForm};
