/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useCallback, useEffect} from 'react';
import {Card3} from '../../../../_metronic/partials/content/cards/Card3';
import {ProfileService as profileService} from '@/app/modules/profile/core/_requests';
import {ReceiverDto} from '@/app/modules/profile/core/_dtos';
import {useAuth} from '@/app/modules/auth';
import {KTSVG} from '@_metronic/helpers';
import {useListView} from "@/app/modules/apps/user-management/users-list/core/ListViewProvider";
import {ReceiverEditModal} from "@/app/modules/profile/receiver-edit-modal/ReceiverEditModal";
import {InviteUsers} from "@_metronic/partials";

export const ReceiverModalContext = React.createContext({});

export function Receivers() {
  const {currentUser} = useAuth();
  const [modal, setModal] = React.useState(false);
  const [receivers, setReceivers] = React.useState<ReceiverDto[]>([]);
  const [bank, setBank] = React.useState<string>('');
  const [receiverToUpdate, setReceiverToUpdate] = React.useState<ReceiverDto>();
  useEffect(() => {
    profileService.getAllReceiversByUserId(currentUser?.id).then((data: ReceiverDto[]) => {
      setReceivers(data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const openAddReceiverModal = () => {
    setModal(!modal);
    profileService.getAllReceiversByUserId(currentUser?.id).then((data: ReceiverDto[]) => {
      setReceivers(data);
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleDeleteReceiver  = async (cardNumber: string) => {
    try {
      await profileService.deleteReceiver(cardNumber);
      setReceivers(receivers.filter((receiver) => receiver.cardNumber !== cardNumber));
    }catch (e) {
      console.error(e);
    }
  }

  const handleAddReceiverBtn = () => {
    setReceiverToUpdate(undefined);
    openAddReceiverModal();
  }

  return (
      <>
        <ReceiverModalContext.Provider
            value={{openAddReceiverModal, modal, receiverToUpdate, setReceiverToUpdate, handleDeleteReceiver}}>
          <div className='d-flex flex-wrap flex-stack mb-6'>
            <h3 className='fw-bolder my-2'>
              My Receivers
              <span className='fs-6 text-gray-400 fw-bold ms-1'>({receivers.filter((receiver) => receiver.bankName === bank || bank === '').length})</span>
            </h3>

            <div className={'d-flex flex-center flex-wrap mb-5'}>
              <div className='d-flex my-2'>
                <select
                    name='bank'
                    data-control='select2'
                    data-hide-search='true'
                    className='form-select form-select-white form-select-sm w-125px'
                    defaultValue='Select a bank...'
                    onChange={(e) => setBank(e.target.value)}
                >
                  <option value=''>Select a bank...</option>
                  <option value='Vietcombank'>Vietcombank</option>
                  <option value='Vietinbank'>Vietinbank</option>
                  <option value='Techcombank'>Techcombank</option>
                </select>
              </div>
              <button type='button' className='btn btn-sm btn-primary' style={{marginLeft: '10px'}}
                      onClick={handleAddReceiverBtn}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
                Add Receiver
              </button>
            </div>
          </div>

          <div className='row g-6 g-xl-9'>
            {
              receivers.filter((receiver) => receiver.bankName === bank || bank === '').map((receiver: ReceiverDto) => {
                return (
                    <div className='col-md-6 col-xxl-4' key={receiver.id}>
                      <Card3
                          id={receiver.id}
                          userId={receiver.userId}
                          avatar='/media/avatars/300-6.jpg'
                          name={receiver.fullName}
                          nickname={receiver.nickname}
                          online={true}
                          cardNumber={receiver.cardNumber}
                          bankName={receiver.bankName}
                      />
                    </div>
                );
              })
            }
          </div>

          <div className='d-flex flex-stack flex-wrap pt-10'>
            <div className='fs-6 fw-bold text-gray-700'>Showing 1 to 10 of 50 entries</div>

            <ul className='pagination'>
              <li className='page-item previous'>
                <a href='#' className='page-link'>
                  <i className='previous'></i>
                </a>
              </li>

              <li className='page-item active'>
                <a href='#' className='page-link'>
                  1
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  2
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  3
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  4
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  5
                </a>
              </li>

              <li className='page-item'>
                <a href='#' className='page-link'>
                  6
                </a>
              </li>

              <li className='page-item next'>
                <a href='#' className='page-link'>
                  <i className='next'></i>
                </a>
              </li>
            </ul>
          </div>
          <ReceiverEditModal/>
        </ReceiverModalContext.Provider>
      </>
  );
}
