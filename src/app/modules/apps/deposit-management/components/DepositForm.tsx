import React, { useState } from 'react';
import { ErrorMessage, Field, FormikProps } from 'formik';
import { NavLink } from 'react-router-dom';

interface Props {
  formikProps: FormikProps<any>;
}

const DepositForm: React.FC<Props> = ({ formikProps }) => {
  const [depositWithPhone, setDepositWithPhone] = useState(true);

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
          Use username or credit card number of user to deposit:
        </label>

        <div className='btn-group' role='group' aria-label='Basic radio toggle button group'>
          <input
              onChange={() => {
                setDepositWithPhone(true);
                formikProps.setFieldValue('creditCardNumber', '');
              }}
              type='radio'
              className='btn-check'
              name='depositWith'
              id='phoneNumber'
              autoComplete='off'
              defaultChecked={true}
          />
          <label className='btn btn-outline-primary' htmlFor='phoneNumber'>
            Username
          </label>

          <input
            onChange={() => {
              setDepositWithPhone(false);
              formikProps.setFieldValue('username', '');
            }}
            type='radio'
            className='btn-check'
            name='depositWith'
            id='creditCardNumber'
            autoComplete='off'
          />
          <label className='btn btn-outline-primary' htmlFor='creditCardNumber'>
            Credit Card Number
          </label>
        </div>
      </div>

      {depositWithPhone && (
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Username</span>
          </label>

          <Field name='username' className='form-control form-control-lg form-control-solid' />
          <div className='text-danger mt-2'>
            <ErrorMessage name='username' />
          </div>
        </div>
      )}

      {!depositWithPhone && (
        <div className='fv-row mb-10'>
          <label className='d-flex align-items-center form-label'>
            <span className='required'>Credit Card Number</span>
          </label>

          <Field
            name='creditCardNumber'
            className='form-control form-control-lg form-control-solid'
          />
          <div className='text-danger mt-2'>
            <ErrorMessage name='creditCardNumber' />
          </div>
        </div>
      )}

      <div className='fv-row mb-10'>
        <label className='form-label required'>Transfer Amount</label>

        <Field name='amount' className='form-control form-control-lg form-control-solid' />
        <div className='text-danger mt-2'>
          <ErrorMessage name='amount' />
        </div>

        <div className='form-text'>Minimum transfer amount is 100,000 VND.</div>
      </div>
    </div>
  );
};

export { DepositForm };
