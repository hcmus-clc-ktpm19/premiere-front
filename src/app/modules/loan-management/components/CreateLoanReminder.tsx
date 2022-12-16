import React, {useEffect, useRef, useState} from 'react';
import {KTSVG} from '@_metronic/helpers';
import {Form, Formik, FormikValues} from 'formik';
import {Step1} from '@/app/modules/loan-management/components/steps/Step1';
import {
  LoanReminderDto,
  loanReminderInit,
  loanReminderValidationSchema,
} from '@/app/modules/wizards/components/CreateAccountWizardHelper';
import {Step2} from '@/app/modules/loan-management/components/steps/Step2';
import {StepperComponent} from '@_metronic/assets/ts/components';
import StepperItem from '@/app/modules/loan-management/components/shared/StepperItem';

const CreateLoanReminder: React.FC = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const stepper = useRef<StepperComponent | null>(null);
  const [initValues] = useState<LoanReminderDto>(loanReminderInit);

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement);
  };

  const prevStep = () => {
    if (!stepper.current) {
      return;
    }

    stepper.current.goPrev();

    // setCurrentSchema(createAccountSchemas[stepper.current.currentStepIndex - 1]);
  };

  const submitStep = (values: LoanReminderDto, actions: FormikValues) => {
    console.log('values', values);
    console.log('actions', actions);
    console.log(stepper.current?.totalStepsNumber);
    console.log(stepper.current?.currentStepIndex);

    if (!stepper.current) {
      return;
    }

    if (stepper.current.currentStepIndex !== stepper.current?.totalStepsNumber) {
      stepper.current.goNext();
    } else {
      stepper.current.goto(1);
      actions.resetForm();
    }
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);

  return (
    <div
      ref={stepperRef}
      className='stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid'
      id='kt_create_account_stepper'>
      {/* begin::Aside*/}
      <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
        {/* begin::Wrapper*/}
        <div className='card-body px-6 px-lg-10 px-xxl-15 py-20'>
          {/* begin::Nav*/}
          <div className='stepper-nav'>
            {/* begin::Step 1 */}
            <StepperItem
              current
              stepperNumber={1}
              stepperTitle='Create Loan Reminder'
              stepperDescription='Input reminder information'
            />
            {/* end::Step 1*/}
            {/* begin::Line*/}
            <div className='stepper-line h-40px'></div>
            {/* end::Line*/}

            {/* begin::Step 2*/}
            <StepperItem
              stepperNumber={2}
              stepperTitle='Beneficiary Account'
              stepperDescription='Input your beneficiary account'
            />
            {/* end::Step 2*/}
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
          {(props) => (
            <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
              <div className='current' data-kt-stepper-element='content'>
                <Step1 formikProps={props} />
              </div>

              <div data-kt-stepper-element='content'>
                <Step2 />
              </div>

              <div className='d-flex flex-stack pt-10'>
                <div>
                  <button type='submit' className='btn btn-lg btn-primary me-3'>
                    <span className='indicator-label'>
                      {stepper.current?.currentStepIndex !==
                        stepper.current?.totalStepsNumber! - 1 && 'Continue'}
                      {stepper.current?.currentStepIndex ===
                        stepper.current?.totalStepsNumber! - 1 && 'Submit'}
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
