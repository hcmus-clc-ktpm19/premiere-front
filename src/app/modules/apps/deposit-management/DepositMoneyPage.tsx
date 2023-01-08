import React, { useState } from 'react';
import { KTSVG } from '@_metronic/helpers';
import { Form, Formik, FormikProps } from 'formik';
import { DepositMoneyRequestDto } from '@/app/models/model';
import { DepositForm } from '@/app/modules/apps/deposit-management/components/DepositForm';
import { depositMoneyService } from '@/app/modules/apps/deposit-management/core/services';
import { useNavigate } from 'react-router-dom';
import CreditCardNotFoundException from '@/app/models/exceptions/CreditCardNotFoundException';
import { useIntl } from 'react-intl';

const DepositMoneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [initValues] = useState<DepositMoneyRequestDto>(
    depositMoneyService.initDepositMoneyRequest
  );
  const [error, setError] = useState<string | undefined>();
  const intl = useIntl();

  const handleOnSubmit = async (values: DepositMoneyRequestDto): Promise<void> => {
    try {
      await depositMoneyService.depositMoney(values);
      await depositMoneyService.pushDepositSuccessNotification(values);
      navigate('/dashboard');
    } catch (e: CreditCardNotFoundException | any) {
      if (e instanceof CreditCardNotFoundException) {
        setError(e.errorDto?.i18nPlaceHolder);
      } else {
        navigate('/error/500');
      }
    }
  };

  return (
    <div
      className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
      id='kt_create_account_stepper'
    >
      <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
        <Formik
          validationSchema={depositMoneyService.depositMoneyValidationSchemas}
          onSubmit={handleOnSubmit}
          initialValues={initValues}
          validateOnChange={false}
        >
          {(props: FormikProps<any>) => (
            <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
              <div className='current' data-kt-stepper-element='content'>
                <DepositForm formikProps={props} />
              </div>

              {error && (
                <h4 className='fw-bolder text-danger'>{intl.formatMessage({ id: error })}</h4>
              )}

              <div className='d-flex flex-stack pt-10'>
                <div>
                  <button
                    type='submit'
                    disabled={!props.isValid}
                    className='btn btn-lg btn-primary me-3'
                  >
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

export { DepositMoneyPage };
