import React, {FC, useEffect, useState} from 'react';
import {ErrorMessage, FormikProps} from 'formik';
import {NavLink} from 'react-router-dom';
// @ts-ignore
import {ErrorDto} from '@/app/models/model';
import {CreditCardDto} from '@/app/modules/profile/core/_dtos';
// @ts-ignore
import Card from 'react-credit-card-payment';
import {useAuth} from "@/app/modules/auth";
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import {useThemeMode} from "@_metronic/partials";
import {useIntl} from "react-intl";

interface Props {
  formikProps: FormikProps<any>;
}

const CreateTransactionStep1: FC<Props> = (props: Props) => {
  const {formikProps} = props;
  const {currentUser} = useAuth();
  const {mode} = useThemeMode();
  const [creditCard, setCreditCard] = useState<CreditCardDto>();
  const intl = useIntl();
  const [error, setError] = useState<ErrorDto | null>(null);
  const [isCardSelected, setIsCardSelected] = useState(false);

  const handleCardChange = (e: React.ChangeEvent<any>) => {
    setIsCardSelected(!isCardSelected);
    formikProps.setFieldValue('isCardSelected', !isCardSelected);
  }


  useEffect(() => {
    setError(null);
    profileService.getCreditCardByUserId(currentUser?.id)
    .then((data: CreditCardDto) => {
      setCreditCard(data);
      formikProps.setFieldValue('senderCardNumber', data.cardNumber);
      formikProps.setFieldValue('senderBankName', 'Premierebank');
    })
    .catch((error) => {
      console.log(error);
    });
  },[]);

  return (
      <div className='w-100'>
        <div className='pb-10 pb-lg-12'>
          <h2 className='fw-bolder text-dark'>Choose a credit card</h2>

          <div className='text-gray-400 fw-bold fs-6'>
            If you need more info, please check out
            <NavLink to='/dashboard' className='link-primary fw-bolder'>
              {' '}
              Help Page
            </NavLink>
            .
          </div>
        </div>
        {/* begin::Body */}
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-gray-300 align-middle gs-0 gy-4'>
              {/* begin::Table body */}
              <tbody>
              <tr>
                <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-9-check'
                           type='checkbox'
                           checked={isCardSelected}
                           onChange={handleCardChange}
                           name={'isCardSelected'}
                    />
                    <div className='text-danger mt-2'>
                      <ErrorMessage name='isCardSelected' />
                    </div>

                    {error && (
                        <div className='form-text text-danger'>
                          {intl.formatMessage({id: error.i18nPlaceHolder})}
                        </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className='d-flex align-items-center'>
                    <Card className={'creditcard'}
                        bankName='Premiere Bank'
                        cardHolder = {currentUser?.lastName + ' ' + currentUser?.firstName}
                        cardNumber= {creditCard?.cardNumber}
                        issuer='mastercard'
                        theme={mode}
                    />
                  </div>
                </td>
              </tr>
              </tbody>
              {/* end::Table body */}
            </table>
            {/* end::Table */}
          </div>
          {/* end::Table container */}
        </div>
        {/* begin::Body */}
      </div>
  );
};

export {CreateTransactionStep1};
