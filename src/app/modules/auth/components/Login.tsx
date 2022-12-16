/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { AuthService, getUserByToken } from "../core/_requests";
import { useAuth } from "../core/Auth";
import ReCAPTCHA from "react-google-recaptcha";

const RECAPTCHA_SITE_KEY: string = process.env.GOOGLE_RECAPTCHA_SITE_KEY!!;

// const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const loginSchema = Yup.object().shape({
  // TODO: Ignore for testing
  // phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  // password: Yup.string()
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Password is required'),
});

const initialValues = {
  phone: 'admin',
  password: 'admin',
};

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const {saveAuth, setCurrentUser} = useAuth();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      if (recaptchaRef.current?.getValue()?.length === 0) {
        setStatus('Please verify that you are not a robot.');
        return;
      }

      setLoading(true);
      try {
        const {data: auth} = await AuthService.loginKeycloak(values.phone, values.password);
        saveAuth(auth);
        const {data: user} = await getUserByToken();
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
        saveAuth(undefined);
        setStatus('The login details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const recaptchaRef = React.createRef<ReCAPTCHA>();

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_login_signin_form'>
      {/* begin::Heading */}
      <div className='text-center mb-11'>
        <h1 className='text-dark fw-bolder mb-3'>Sign In</h1>
      </div>
      {/* begin::Heading */}

      {/* begin::Separator */}
      <div className='separator separator-content my-14'>
        <span className='w-150px bold text-gray-500 fw-semibold fs-7'>With Your Phone</span>
      </div>
      {/* end::Separator */}

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>
            Use account <strong>{initialValues.phone}</strong> and password <strong>{initialValues.password}</strong>{' '}
            to continue.
          </div>
        </div>
      )}

      {/* begin::Form group */}
      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-dark'>Phone number</label>
        <input
          placeholder='Phone number'
          {...formik.getFieldProps('phone')}
          className={clsx(
            'form-control bg-transparent',
            {'is-invalid': formik.touched.phone && formik.errors.phone},
            {
              'is-valid': formik.touched.phone && !formik.errors.phone,
            }
          )}
          type='phone'
          name='phone'
          autoComplete='off'
        />
        {formik.touched.phone && formik.errors.phone && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.phone}</span>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-3'>
        <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
        <input
          type='password'
          autoComplete='off'
          {...formik.getFieldProps('password')}
          className={clsx(
            'form-control bg-transparent',
            {
              'is-invalid': formik.touched.password && formik.errors.password,
            },
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

      {/* begin::Wrapper */}
      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />

        {/* begin::Link */}
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} />
        <button
          type='submit'
          id='kt_sign_in_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}>
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  );
}
