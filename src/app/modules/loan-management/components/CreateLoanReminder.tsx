import React, {useState} from 'react';
import {KTSVG} from '@_metronic/helpers';
import {Form, Formik, FormikValues} from 'formik';
import {LoanReminderForm} from '@/app/modules/loan-management/components/LoanReminderForm';
import {
  LoanReminderDto,
  loanReminderInit,
  loanReminderValidationSchema,
} from '@/app/modules/wizards/components/CreateAccountWizardHelper';

const CreateLoanReminder: React.FC = () => {
  const [initValues] = useState<LoanReminderDto>(loanReminderInit);
  const submitStep = (values: LoanReminderDto, actions: FormikValues) => {
    console.log('values', values);
  };

  return (
    <div
      className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
      id='kt_create_account_stepper'>
      {/* begin::Aside*/}
      <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
        {/* begin::Wrapper*/}
        <div className='card-body px-6 px-lg-10 px-xxl-15 py-20'>
          {/* begin::Nav*/}
          <div className='stepper-nav'>
            {/* begin::Create */}
            <div className='stepper-item current' data-kt-stepper-element='nav'>
              {/* begin::Wrapper*/}
              <div className='stepper-wrapper'>
                {/* begin::Icon*/}
                <div className='stepper-icon w-40px h-40px'>
                  <i className='stepper-check fas fa-check'></i>
                  <span className='stepper-number'>L</span>
                </div>
                {/* end::Icon*/}

                {/* begin::Label*/}
                <div className='stepper-label'>
                  <h3 className='stepper-title'>Create Loan Reminder</h3>

                  <div className='stepper-desc fw-semibold'>Input reminder information</div>
                </div>
                {/* end::Label*/}
              </div>
              {/* end::Wrapper*/}

              {/* begin::Line*/}
              <div className='stepper-line h-40px'></div>
              {/* end::Line*/}
            </div>
            {/* end::Create*/}
          </div>
          {/* end::Nav*/}
        </div>
        {/* end::Wrapper*/}
      </div>
      {/* begin::Aside*/}

      <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
        <Formik
          validationSchema={loanReminderValidationSchema}
          onSubmit={submitStep}
          initialValues={initValues}>
          {() => (
            <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
              <div className='current' data-kt-stepper-element='content'>
                <LoanReminderForm />
              </div>

              <div className='d-flex flex-stack pt-10'>
                <div>
                  <button type='submit' className='btn btn-lg btn-primary me-3'>
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

export {CreateLoanReminder};
