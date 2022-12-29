import React, {useEffect, useRef, useState} from 'react';
import {KTSVG} from '@_metronic/helpers';
import {ErrorMessage, Field, Form, Formik, FormikProps} from 'formik';
import {StepperComponent} from '@_metronic/assets/ts/components';
import StepperItem from '@/app/modules/loan-management/components/shared/StepperItem';
// @ts-ignore
import {
  CreateLoanReminderDto,
  TransactionRequestDto,
  TransactionType,
  TransferMoneyRequestDto
} from '@/app/models/model';
import {NavigateFunction, useNavigate} from 'react-router-dom';
import {
  CreateTransactionStep1
} from "@/app/modules/profile/components/steps/CreateTransactionStep1";
import {
  CreateTransactionStep2
} from "@/app/modules/profile/components/steps/CreateTransactionStep2";
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import {transactionInit} from "@/app/modules/profile/core/_models";

const CreateTransaction: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const stepper = useRef<StepperComponent | null>(null);
  const [currentSchema, setCurrentSchema] = useState(profileService.transactionValidationSchemas[0]);
  const [initValues] = useState<any>(transactionInit);
  const [checking, setChecking] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingTransactionId, setCheckingTransactionId] = useState<number>(-1);
  const [otp, setOtp] = useState<string>('');

  const loadStepper = () => {
    stepper.current = StepperComponent.createInsance(stepperRef.current as HTMLDivElement);
  };

  const prevStep = () => {
    if (!stepper.current) {
      return;
    }

    stepper.current.goPrev();

    setCurrentSchema(profileService.transactionValidationSchemas[stepper.current.currentStepIndex - 1]);
  };

  const submitStep = async (values: TransactionRequestDto) => {
    console.log("click submit", values);
    if (!stepper.current) {
      return;
    }

    setCurrentSchema(profileService.transactionValidationSchemas[stepper.current.currentStepIndex]);

    if (stepper.current.currentStepIndex !== stepper.current?.totalStepsNumber - 1) {
      stepper.current.goNext();
    } else {
      if (!checking) {
        console.log("verify transaction");
        console.log("step", stepper, currentSchema);
        const transactionRequestDto: TransactionRequestDto = {
          senderCardNumber: values.senderCardNumber,
          receiverCardNumber: values.receiverCardNumber,
          amount: values.amount,
          type: TransactionType.MONEY_TRANSFER,
          isInternal: values.senderBankName === values.receiverBankName,
          isSelfPaymentFee: values.isSelfPaymentFee || false,
          remark: values.remark,
          senderBankName: values.senderBankName,
          receiverBankName: values.receiverBankName,
          otp: ''
        }
        console.log("transactionRequestDto", transactionRequestDto);
        try {
          const res = await profileService.validateTransferMoney(transactionRequestDto);
          console.log("res", res);
          setCheckingTransactionId(res.checkingTransactionId);
          setChecking(!checking);
        } catch (e) {
          console.log("error", e);
        }
      } else {
        console.log("actual transaction");
        const transferMoneyRequestDto: TransferMoneyRequestDto = {
          checkingTransactionId,
          otp
        }
        try {
          await profileService.transferMoney(transferMoneyRequestDto);
          setSuccess(true);
          // wait 3s then navigate to dashboard
          setTimeout(() => {
            navigate('/crafted/pages/profile/transactions');
          }, 3000);
        } catch (e) {
          console.log("error", e);
        }
      }
    }
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);

  const onOTPChange = (otp: string) => {
    console.log("otp", otp);
    setOtp(otp);
  }

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
                  stepperTitle='Choose a credit card'
                  stepperDescription='Choose a credit card to transfer money'
              />
              {/* end::Step 1*/}
              {/* begin::Line*/}
              <div className='stepper-line h-40px'></div>
              {/* end::Line*/}

              {/* begin::Step 2*/}
              <StepperItem
                  stepperNumber={2}
                  stepperTitle='Input information'
                  stepperDescription='Input information to transfer money'
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
                    <CreateTransactionStep1 formikProps={props} />
                  </div>

                  <div data-kt-stepper-element='content'>
                    <CreateTransactionStep2 formikProps={props} />
                  </div>

                  {
                    checking && (
                          <div className='fv-row'>
                            <label className='form-label required'>OTP</label>

                            <Field name='otp'
                                   className='form-control form-control-lg form-control-solid'
                                   onChange={(e: any) => onOTPChange(e.target.value)}
                            />
                            {
                                success && (
                                    <div className='mb-lg-15 alert alert-success mt-2'>
                                      <div className='alert-text font-weight-bold'>Verify OTP Successfully!!!</div>
                                    </div>
                                )
                            }
                          </div>
                      )
                  }

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

export default CreateTransaction;
