import { useState } from 'react';
import { useFormik } from 'formik';
import { verifyOTP } from '@/app/modules/auth/core/_requests';
import clsx from 'clsx';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

const initialValues = {
  otp: '',
};

const forgotPasswordSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
});

export function OTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  // if doesn't have email, redirect to forgot password page
  if (!email) {
    console.log('no email, redirect to forgot password page');
    // return to forgot password page
    return <Navigate to={'/auth/forgot-password'} />;
  }
  // @ts-ignore
  if (!location.state?.isOTPRequested) {
    console.log('not requested OTP yet, redirect to forgot password page');
    return <Navigate to={'/auth/forgot-password'} />;
  }
  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      setTimeout(() => {
        verifyOTP({ email: email || '', otp: values.otp })
          .then((res) => {
            console.log('verify OTP: ', email, values.otp, res);
            setHasErrors(false);
            setLoading(false);
            if (res.status === 200) {
              // redirect to reset password page
              navigate(
                {
                  pathname: '/auth/reset-password',
                  search: `?email=${email}`,
                },
                { state: { isOTPVerified: true } }
              );
            } else {
              setSubmitting(false);
              setStatus('The OTP is incorrect');
            }
          })
          .catch(() => {
            setHasErrors(true);
            setLoading(false);
            setSubmitting(false);
            setStatus('Something went wrong');
          });
      }, 1000);
    },
  });

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_password_reset_form'
      onSubmit={formik.handleSubmit}>
      <div className='text-center mb-10'>
        {/* begin::Title */}
        <h1 className='text-dark fw-bolder mb-3'>Verify OTP</h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className='text-gray-500 fw-semibold fs-6'>
          Enter the OTP code sent to {email} for verification.
        </div>
        <div className='text-gray-500 fw-semibold fs-6'>
          <strong>Check your spam folder if you can't find it.</strong>
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Title */}
      {hasErrors === true && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>
            Sorry, looks like there are some errors detected, please check your OTP again.
          </div>
        </div>
      )}

      {hasErrors === false && (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Verifying please wait a moment...</div>
        </div>
      )}
      {/* end::Title */}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>OTP</label>
        <input
          type='text'
          placeholder=''
          autoComplete='off'
          {...formik.getFieldProps('otp')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.otp && formik.errors.otp },
            {
              'is-valid': formik.touched.otp && !formik.errors.otp,
            }
          )}
        />
        {formik.touched.otp && formik.errors.otp && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.otp}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
        <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
          <span className='indicator-label'>Verify</span>
          {loading && (
            <span className='indicator-progress'>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_password_reset_form_cancel_button'
            className='btn btn-light'
            disabled={formik.isSubmitting || !formik.isValid}>
            Cancel
          </button>
        </Link>{' '}
      </div>
      {/* end::Form group */}
    </form>
  );
}
