/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useContext, useEffect} from 'react';
import {toAbsoluteUrl, KTSVG} from '../../../helpers';
import {ReceiverModalContext} from "@/app/modules/profile/components/Receivers";
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import {InviteUsers} from "@_metronic/partials";
import {ConfirmModal} from "@_metronic/partials/modals/confirm/ConfirmModal";

type Props = {
  id: number | null,
  userId: number,
  color?: string;
  avatar?: string;
  online?: boolean;
  name: string;
  nickname: string;
  cardNumber: string;
  bankName: string
};

const Card3: FC<Props> = ({
                            id,
                            userId,
                            color = '',
                            avatar = '',
                            online = false,
                            name,
                            nickname,
                            cardNumber,
                            bankName
                          }) => {
  // @ts-ignore
  const {openAddReceiverModal, setReceiverToUpdate, handleDeleteReceiver} = useContext(ReceiverModalContext);
  const [modal, setModal] = React.useState(false);
  const handleEditBtn = () => {
    setReceiverToUpdate({
      id,
      userId,
      cardNumber,
      bankName,
      nickname,
      fullName: name
    });
    openAddReceiverModal();
  };


  return (
      <div className='card'>
        <div className='card-body d-flex flex-center flex-column p-9'>
          <div className='mb-5'>
            <div className='symbol symbol-75px symbol-circle'>
              {color ? (
                  <span className={`symbol-label bg-light-${color} text-${color} fs-5 fw-bolder`}>
                {name.charAt(0)}
              </span>
              ) : (
                  <img alt='Pic' src={toAbsoluteUrl(avatar)}/>
              )}
              {online && (
                  <div
                      className='symbol-badge bg-success start-100 top-100 border-4 h-15px w-15px ms-n3 mt-n3'></div>
              )}
            </div>
          </div>

          <a href='#' className='fs-4 text-gray-800 text-hover-primary fw-bolder mb-0'>
            {name}
          </a>

          <div className='fw-bold text-gray-400 mb-6'>{nickname}</div>
          <div className='fw-bold text-gray-400 mb-6'>{cardNumber} - {bankName}</div>
          <div className={'d-flex flex-center flex-wrap mb-5'}>
            <button type='button' className='btn btn-sm btn-primary' onClick={handleEditBtn}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
              Edit
            </button>
            <button type='button' className='btn btn-sm btn-danger' style={{marginLeft: '10px'}}
                    onClick={() => setModal(!modal)}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2'/>
              Delete
            </button>
          </div>
        </div>
        <ConfirmModal isShow={modal} header={"Receiver Delete Confirmation"}
                      content={"Are you sure want to delete this receiver?"}
                      onCancel={setModal}
                      onConfirm={handleDeleteReceiver}
                      value={cardNumber}
                      isShowCancelBtn={true}
        />
      </div>
  );
};

export {Card3};
