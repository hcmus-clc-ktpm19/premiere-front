import React, {FC, useState} from 'react';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {isNotEmpty} from '@_metronic/helpers';
import clsx from 'clsx';
import {useListView} from '../core/ListViewProvider';
import {createEmployee, updateEmployee} from '../core/_requests';
import {useQueryResponse} from '../core/QueryResponseProvider';
import {ErrorDto, FullInfoUserDto, PremiereRole} from '@/app/models/model';
import {AlertColor} from "@mui/material";
import useNotification from "@/app/modules/notifications/useNotification";
import {AxiosError} from "axios";
import {
  EmployeesListLoading
} from "@/app/modules/apps/admin-management/employees-list/components/loading/EmployeesListLoading";

type Props = {
  isUserLoading: boolean;
  user: FullInfoUserDto | ErrorDto;
};

const editUserSchema = Yup.object().shape({
  email: Yup.string().email('Wrong email format').required('Email is required'),
  username: Yup.string()
    .min(5, 'Minimum 5 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Username is required'),
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string()
    .min(10, 'Minimum 10 symbols')
    .max(10, 'Maximum 10 symbols')
    .required('Phone is required'),
  panNumber: Yup.string().required('Identification number is required'),
  address: Yup.string().required('Address is required'),
  password: Yup.string()
    .min(5, 'Minimum 5 symbols')
    .max(50, 'Maximum 50 symbols')
    .nullable(),
  gender: Yup.string().required('Gender is required'),
  role: Yup.string().required('Role is required'),
});

const EmployeeEditModalForm: FC<Props> = ({user, isUserLoading}) => {
  const {setItemIdForUpdate} = useListView();
  const {refetch} = useQueryResponse();
  // @ts-ignore
  const [userForEdit] = useState<FullInfoUserDto>(user);
  const {setNotification} = useNotification();

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };


  const formik = useFormik({
    initialValues: userForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true);
      console.log('values', {values});
      try {
        if (isNotEmpty(values.id)) {
          console.log('update', {values});
          await updateEmployee(values);
          setNotification(true, 'Update user successfully.', 'success', () => {});
        } else {
          console.log('create', {values});
          console.log(await createEmployee(values));
          setNotification(true, 'Create user successfully.', 'success', () => {});
        }
      } catch (ex: AxiosError | any) {
        console.log('error happened', {ex});
        console.error(ex);
        const notificationType: AlertColor = 'error';
        if (ex.response.status === 500) {
          setNotification(true, 'Username is already used.', notificationType, () => {});
        } else {
          const message = ex.response.data.message;
          setNotification(true, message, notificationType, () => {});
        }
      } finally {
        setSubmitting(true);
        cancel(true);
      }
    },
  });

  return (
    <>
      <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'>

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Username</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Username'
              {...formik.getFieldProps('username')}
              type='text'
              name='username'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.username && formik.errors.username},
                {
                  'is-valid': formik.touched.username && !formik.errors.username,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading || userForEdit.username !== ''}
            />
            {formik.touched.username && formik.errors.username && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.username}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Password</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Password'
              {...formik.getFieldProps('password')}
              type='password'
              name='password'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.password && formik.errors.password},
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Email</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Email'
              {...formik.getFieldProps('email')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.email && formik.errors.email},
                {
                  'is-valid': formik.touched.email && !formik.errors.email,
                }
              )}
              type='email'
              name='email'
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {/* end::Input */}
            {formik.touched.email && formik.errors.email && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>First Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
                placeholder='First Name'
                {...formik.getFieldProps('firstName')}
                type='text'
                name='firstName'
                className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.firstName && formik.errors.firstName},
                    {
                      'is-valid': formik.touched.firstName && !formik.errors.firstName,
                    }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.firstName && formik.errors.firstName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.firstName}</span>
                  </div>
                </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Last Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
                placeholder='Last Name'
                {...formik.getFieldProps('lastName')}
                type='text'
                name='lastName'
                className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.lastName && formik.errors.lastName},
                    {
                      'is-valid': formik.touched.lastName && !formik.errors.lastName,
                    }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.lastName && formik.errors.lastName && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.lastName}</span>
                  </div>
                </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Phone</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
                placeholder='Phone'
                {...formik.getFieldProps('phone')}
                type='text'
                name='phone'
                className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.phone && formik.errors.phone},
                    {
                      'is-valid': formik.touched.phone && !formik.errors.phone,
                    }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.phone && formik.errors.phone && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.phone}</span>
                  </div>
                </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Identification number</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
                placeholder='Identification number'
                {...formik.getFieldProps('panNumber')}
                type='text'
                name='panNumber'
                className={clsx(
                    'form-control form-control-solid mb-3 mb-lg-0',
                    {'is-invalid': formik.touched.panNumber && formik.errors.panNumber},
                    {
                      'is-valid': formik.touched.panNumber && !formik.errors.panNumber,
                    }
                )}
                autoComplete='off'
                disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.panNumber && formik.errors.panNumber && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.panNumber}</span>
                  </div>
                </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Address</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Address'
              {...formik.getFieldProps('address')}
              type='text'
              name='address'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.address && formik.errors.address},
                {
                  'is-valid': formik.touched.address && !formik.errors.address,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
            />
            {formik.touched.address && formik.errors.address && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.address}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2'>Gender</label>
            {/* end::Label */}
            <select
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.gender && formik.errors.gender},
                {
                  'is-valid': formik.touched.gender && !formik.errors.gender,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isUserLoading}
              {...formik.getFieldProps('gender')}
              name='gender'>
              <option value=''>Select gender...</option>
              <option value='MALE'>Male</option>
              <option value='FEMALE'>Female</option>
              <option value='OTHER'>Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.gender}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-5'>Role</label>
            {/* end::Label */}
            {/* begin::Roles */}
            {/* begin::Input row */}
            <div className='d-flex fv-row'>
              {/* begin::Radio */}
              <div className='form-check form-check-custom form-check-solid'>
                {/* begin::Input */}
                <input
                  className='form-check-input me-3'
                  {...formik.getFieldProps('role')}
                  name='role'
                  type='radio'
                  value='EMPLOYEE'
                  id='kt_modal_update_role_option_0'
                  checked={formik.values.role === PremiereRole.EMPLOYEE}
                  disabled={formik.isSubmitting || isUserLoading}
                />

                {/* end::Input */}
                {/* begin::Label */}
                <label className='form-check-label' htmlFor='kt_modal_update_role_option_0'>
                  <div className='fw-bolder text-gray-800'>Employee</div>
                </label>
                {/* end::Label */}
              </div>
              {/* end::Radio */}
            </div>
            {/* end::Input row */}
            {/* begin::Input row */}
            {/*{currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() && (*/}
            {/*  <div className='separator separator-dashed my-5'></div>*/}
            {/*)}*/}
            {/*{currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() && (*/}
            {/*  <div className='d-flex fv-row'>*/}
            {/*    /!* begin::Radio *!/*/}
            {/*    <div className='form-check form-check-custom form-check-solid'>*/}
            {/*      /!* begin::Input *!/*/}
            {/*      <input*/}
            {/*        className='form-check-input me-3'*/}
            {/*        {...formik.getFieldProps('role')}*/}
            {/*        name='role'*/}
            {/*        type='radio'*/}
            {/*        value='EMPLOYEE'*/}
            {/*        id='kt_modal_update_role_option_1'*/}
            {/*        checked={formik.values.role === 'EMPLOYEE'}*/}
            {/*        disabled={formik.isSubmitting || isUserLoading}*/}
            {/*      />*/}
            {/*      /!* end::Input *!/*/}
            {/*      /!* begin::Label *!/*/}
            {/*      <label className='form-check-label' htmlFor='kt_modal_update_role_option_1'>*/}
            {/*        <div className='fw-bolder text-gray-800'>Employee</div>*/}
            {/*      </label>*/}
            {/*      /!* end::Label *!/*/}
            {/*    </div>*/}
            {/*    /!* end::Radio *!/*/}
            {/*  </div>*/}
            {/*)}*/}
            {/* end::Input row */}
            {/* end::Roles */}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isUserLoading}>
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isUserLoading || formik.isSubmitting || !formik.isValid || !formik.touched}>
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <EmployeesListLoading />}
    </>
  );
};

export {EmployeeEditModalForm};
