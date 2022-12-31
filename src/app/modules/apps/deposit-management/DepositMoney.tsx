import React, { useState } from 'react';
import { KTSVG } from '@_metronic/helpers';
import { Form, Formik, FormikProps } from 'formik';
import { DepositMoneyRequestDto } from '@/app/models/model';
import { useAuth } from '@/app/modules/auth';
import { DepositForm } from '@/app/modules/apps/deposit-management/components/DepositForm';
import { depositMoneyService } from '@/app/modules/apps/deposit-management/core/services';

const DepositMoney: React.FC = () => {
  const [initValues] = useState<DepositMoneyRequestDto>({
    amount: 0,
    creditCardNumber: '',
    username: '',
  });

  const { currentUser } = useAuth();

  const submitStep = async (values: DepositMoneyRequestDto) => {
    /* TODO document why this async arrow function is empty */
  };

  return (
    <div
      className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
      id='kt_create_account_stepper'>
      <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
        <Formik
          validationSchema={depositMoneyService.depositMoneyValidationSchemas}
          onSubmit={submitStep}
          initialValues={initValues}
          validateOnChange={false}>
          {(props: FormikProps<any>) => (
            <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
              <div className='current' data-kt-stepper-element='content'>
                <DepositForm formikProps={props} />
              </div>

              <div className='d-flex flex-stack pt-10'>
                <div>
                  <button
                    type='submit'
                    disabled={!props.isValid || Object.keys(props.errors).length !== 0}
                    className='btn btn-lg btn-primary me-3'>
                    <span className='indicator-label'>
                      Submit
                      <KTSVG
                        path='/media/icons/duotune/arrows/arr064.svg'
                        className='svg-icon-3 ms-2 me-0'
                      />
                    </span>
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export { DepositMoney };
