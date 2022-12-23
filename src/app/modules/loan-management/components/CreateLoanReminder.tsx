import React, {useEffect, useRef, useState} from 'react';
import {KTSVG} from '@_metronic/helpers';
import {Form, Formik, FormikProps} from 'formik';
import {CreateLoanReminderStep1} from '@/app/modules/loan-management/components/steps/CreateLoanReminderStep1';
import {CreateLoanReminderStep2} from '@/app/modules/loan-management/components/steps/CreateLoanReminderStep2';
import {StepperComponent} from '@_metronic/assets/ts/components';
import StepperItem from '@/app/modules/loan-management/components/shared/StepperItem';
import {loanReminderInit} from '@/app/modules/loan-management/core/_models';
import {services} from '@/app/modules/loan-management/core/services';
// @ts-ignore
import {CreateLoanReminderDto} from '@/app/models/model';
import {NavigateFunction, useNavigate} from 'react-router-dom';

const CreateLoanReminder: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const stepper = useRef<StepperComponent | null>(null);
  const [currentSchema, setCurrentSchema] = useState(services.loanReminderValidationSchemas[0]);
  const [initValues] = useState<CreateLoanReminderDto>(loanReminderInit);

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement);
  };

  const prevStep = () => {
    if (!stepper.current) {
      return;
    }

    stepper.current.goPrev();

    setCurrentSchema(services.loanReminderValidationSchemas[stepper.current.currentStepIndex - 1]);
  };

  const submitStep = async (values: CreateLoanReminderDto) => {
    if (!stepper.current) {
      return;
    }

    setCurrentSchema(services.loanReminderValidationSchemas[stepper.current.currentStepIndex]);

    if (stepper.current.currentStepIndex !== stepper.current?.totalStepsNumber - 1) {
      stepper.current.goNext();
    } else {
      await services.saveLoanReminder(values);
      // TODO: Implement navigate to loan reminder list here
      navigate('/dashboard');
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
      id='kt_create_account_stepper'
    >
      {/* begin::Aside*/}
      <div className='card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9'>
        {/* begin::Wrapper*/}
        <div className='card-body px-6 px-lg-10 px-xxl-15 py-20'>
          {/* begin::Nav*/}
          <div className='stepper-nav'>
            {/* begin::Step 1 */}
            <StepperItem
              className='current'
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

            <div data-kt-stepper-element='nav' hidden />
          </div>
          {/* end::Nav*/}
        </div>
        {/* end::Wrapper*/}
      </div>
      {/* begin::Aside*/}

      <div className='d-flex flex-row-fluid flex-center bg-body rounded'>
        <Formik
          validationSchema={currentSchema}
          onSubmit={submitStep}
          initialValues={initValues}
          validateOnChange={false}
        >
          {(props: FormikProps<any>) => (
            <Form className='py-20 w-100 w-xl-700px px-9' noValidate id='kt_create_account_form'>
              <div className='current' data-kt-stepper-element='content'>
                <CreateLoanReminderStep1 formikProps={props} />
              </div>

              <div data-kt-stepper-element='content'>
                <CreateLoanReminderStep2 formikProps={props} />
              </div>

              <div className='d-flex flex-stack pt-10'>
                <div className='mr-2'>
                  <button
                    onClick={prevStep}
                    type='button'
                    className='btn btn-lg btn-light-primary me-3'
                    data-kt-stepper-action='previous'
                  >
                    <KTSVG
                      path='/media/icons/duotune/arrows/arr063.svg'
                      className='svg-icon-4 me-1'
                    />
                    Back
                  </button>
                </div>

                <div>
                  <button
                    type='submit'
                    disabled={!props.isValid || Object.keys(props.errors).length !== 0}
                    className='btn btn-lg btn-primary me-3'
                  >
                    <span className='indicator-label'>
                      {stepper.current?.currentStepIndex !== stepper.current?.totalStepsNumber &&
                        'Continue'}
                      {stepper.current?.currentStepIndex === stepper.current?.totalStepsNumber &&
                        'Create'}
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
