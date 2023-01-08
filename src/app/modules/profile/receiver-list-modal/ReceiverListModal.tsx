import React, { FC, useEffect } from 'react';
import { KTSVG } from '@_metronic/helpers';
import { ReceiverDto } from '@/app/modules/profile/core/_dtos';
import { ProfileService as profileService } from '@/app/modules/profile/core/_requests';
import { useAuth } from '@/app/modules/auth';
// @ts-ignore
import Card from 'react-credit-card-payment';
import { useThemeMode } from '@_metronic/partials';

type Props = {
  setIsShowModal: (isShowModal: boolean) => void;
  isShow: boolean;
  isInternal: boolean;
  handleOnConfirmBtn: (selectedReceiver: ReceiverDto | null) => void;
};
const ReceiverListModal: FC<Props> = ({
  isShow,
  setIsShowModal,
  handleOnConfirmBtn,
  isInternal,
}) => {
  const { currentUser } = useAuth();
  const { mode } = useThemeMode();
  const [receivers, setReceivers] = React.useState<ReceiverDto[]>([]);
  const [selectedReceiver, setSelectedReceiver] = React.useState<ReceiverDto | null>(null);
  useEffect(() => {
    profileService
      .getAllReceiversByUserId(currentUser?.id)
      .then((data: ReceiverDto[]) => {
        if (isInternal) {
          setReceivers(data.filter((receiver) => receiver.bankName === 'Premierebank'));
        } else {
          setReceivers(data.filter((receiver) => receiver.bankName !== 'Premierebank'));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  if (!isShow) {
    return null;
  }

  return (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered mw-650px'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder'>Recipients</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                onClick={() => setIsShowModal(false)}
                style={{ cursor: 'pointer' }}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5 mx-xl-15 my-7'>
              {receivers.length > 0 ? (
                <table className='table table-row-gray-300 align-middle gs-0 gy-4'>
                  <thead>
                    <tr className='fw-bold text-muted'>
                      <th className='w-10px'></th>
                      <th className='min-w-150px text-center'>Nickname</th>
                      <th className='min-w-140px text-center'>Credit Card</th>
                    </tr>
                  </thead>
                  {/* begin::Table body */}
                  <tbody>
                    {receivers.map((receiver: ReceiverDto) => (
                      <tr key={receiver.id}>
                        <td>
                          <div className='form-check form-check-sm form-check-custom form-check-solid'>
                            <input
                              className='form-check-input widget-9-check'
                              type='checkbox'
                              name={'receiverCheckbox'}
                              checked={selectedReceiver?.id === receiver.id}
                              onChange={() => {
                                setSelectedReceiver(receiver);
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='d-flex flex-column ms-3 text-center'>
                            <a href='#' className='text-gray-800 text-hover-primary fs-6 fw-bolder'>
                              {receiver.nickname}
                            </a>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <Card
                              className={'creditcard'}
                              bankName={receiver.bankName}
                              cardHolder={receiver.fullName}
                              cardNumber={receiver.cardNumber}
                              issuer='visa'
                              theme={mode}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* end::Table body */}
                </table>
              ) : (
                <div className='text-center'>
                  <h3 className='text-gray-600'>No receiver found</h3>
                </div>
              )}
              <button
                type={'button'}
                className={'btn btn-primary float-end'}
                disabled={selectedReceiver === null}
                onClick={() => handleOnConfirmBtn(selectedReceiver)}
              >
                Confirm
              </button>
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className='modal-backdrop fade show'></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export default ReceiverListModal;
