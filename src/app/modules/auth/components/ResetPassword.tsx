import {Link, Navigate, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useState} from "react";
import {useFormik} from "formik";
import {resetPassword, verifyOTP} from "@/app/modules/auth/core/_requests";
import clsx from "clsx";
import * as Yup from "yup";
import {OTPModel} from "@/app/modules/auth";

const initialValues = {
  password: '',
  confirmPassword: '',
};

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
  .min(3, 'Minimum 3 symbols')
  .max(50, 'Maximum 50 symbols')
  .required('Password is required'),
  confirmPassword: Yup.string()
  .min(3, 'Minimum 3 symbols')
  .max(50, 'Maximum 50 symbols')
  .required('Password is required')
  .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export function ResetPassword() {
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
    return (
        <Navigate to={'/auth/forgot-password'}/>
    )
  }
  // if not verified return to verify otp page
  // @ts-ignore
  if (!location.state?.isOTPVerified) {
    console.log('not verified OTP, redirect to verify OTP page');
    return (
        <Navigate to={`/auth/verify-otp?email=${email}`}/>
    )
  }
  const formik = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true);
      setHasErrors(undefined);
      setTimeout(() => {
        resetPassword({email: email || '', newPassword: values.password})
        .then((res) => {
          console.log('reset password: ', email, values.password, res);
          setHasErrors(false);
          setLoading(false);
          navigate({
            pathname: '/auth/login'
          });
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
          onSubmit={formik.handleSubmit}
      >
        <div className='text-center mb-10'>
          {/* begin::Title */}
          <h1 className='text-dark fw-bolder mb-3'>Reset Password</h1>
          {/* end::Title */}

          {/* begin::Link */}
          <div className='text-gray-500 fw-semibold fs-6'>
            Enter your new password.
          </div>
          {/* end::Link */}
        </div>

        {/* begin::Title */}
        {hasErrors === true && (
            <div className='mb-lg-15 alert alert-danger'>
              <div className='alert-text font-weight-bold'>
                Sorry, looks like there are some errors detected, please try again.
              </div>
            </div>
        )}

        {hasErrors === false && (
            <div className='mb-10 bg-light-info p-8 rounded'>
              <div className='text-info'>Wait a moment...</div>
            </div>
        )}
        {/* end::Title */}

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Password</label>
          <input
              type='password'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                  'form-control bg-transparent',
                  {'is-invalid': formik.touched.password && formik.errors.password},
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
              )}
          />
          {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='fv-row mb-8'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>
          <input
              type='password'
              placeholder=''
              autoComplete='off'
              {...formik.getFieldProps('confirmPassword')}
              className={clsx(
                  'form-control bg-transparent',
                  {'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword},
                  {
                    'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword,
                  }
              )}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.confirmPassword}</span>
                </div>
              </div>
          )}
        </div>
        {/* end::Form group */}

        {/* begin::Form group */}
        <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
          <button type='submit' id='kt_password_reset_submit' className='btn btn-primary me-4'>
            <span className='indicator-label'>Submit</span>
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
                disabled={formik.isSubmitting || !formik.isValid}
            >
              Cancel
            </button>
          </Link>{' '}
        </div>
        {/* end::Form group */}
      </form>
  );
}