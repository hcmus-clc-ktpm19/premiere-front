/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect} from 'react';
import {Card3} from '../../../../_metronic/partials/content/cards/Card3';
import {ProfileService as profileService} from '@/app/modules/profile/core/_requests';
import {ReceiverDto} from '@/app/modules/profile/core/_dtos';
import {useAuth} from '@/app/modules/auth';
import {KTSVG} from '@_metronic/helpers';


export function Receivers() {
  const {currentUser} = useAuth();
  const [receivers, setReceivers] = React.useState<ReceiverDto[]>([]);
  useEffect(() => {
    profileService.getAllReceiversByUserId(currentUser?.id).then((data: ReceiverDto[]) => {
      setReceivers(data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <>
      <div className='d-flex flex-wrap flex-stack mb-6'>
        <h3 className='fw-bolder my-2'>
          My Contacts
          <span className='fs-6 text-gray-400 fw-bold ms-1'>(59)</span>
        </h3>

        <div className={'d-flex flex-center flex-wrap mb-5'}>
          <div className='d-flex my-2'>
            <select
              name='status'
              data-control='select2'
              data-hide-search='true'
              className='form-select form-select-white form-select-sm w-125px'
              defaultValue='Online'
            >
              <option value='Online'>Online</option>
              <option value='Pending'>Pending</option>
              <option value='Declined'>Declined</option>
              <option value='Accepted'>Accepted</option>
            </select>
          </div>
          <a href='#' className='btn btn-sm btn-primary' style={{marginLeft: '10px'}}>
            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
            Add New Receiver
          </a>
        </div>
      </div>

      <div className='row g-6 g-xl-9'>
        {
          receivers.map((receiver: ReceiverDto) => {
            return (
              <div className='col-md-6 col-xxl-4' key={receiver.id}>
                <Card3
                  avatar='/media/avatars/300-6.jpg'
                  name={receiver.fullName}
                  nickname={receiver.nickname}
                  online={true}
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
    </>
  );
}
