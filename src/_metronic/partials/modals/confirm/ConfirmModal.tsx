/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {Dispatch, FC, SetStateAction} from 'react';
import {KTSVG} from '../../../helpers';

type Props = {
  isShow: boolean;
  header: string;
  content: string;
  onConfirm: any;
  onCancel: any;
  value: any;
  isShowCancelBtn: boolean;
};
const ConfirmModal: FC<Props> = ({
  isShow,
  header,
  content,
  onConfirm,
  onCancel,
  value,
  isShowCancelBtn,
}): JSX.Element => {
  return (isShow && (
    <>
      <div
        className='modal fade show d-block'
        id='kt_modal_add_user'
        role='dialog'
        tabIndex={-1}
        aria-modal='true'
      >
        {/* begin::Modal dialog */}
        <div className='modal-dialog modal-dialog-centered'>
          {/* begin::Modal content */}
          <div className='modal-content'>
            <div className='modal-header'>
              {/* begin::Modal title */}
              <h2 className='fw-bolder'>{header}</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div
                className='btn btn-icon btn-sm btn-active-icon-primary'
                data-kt-users-modal-action='close'
                onClick={() => onCancel()}
                style={{cursor: 'pointer'}}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className='modal-body scroll-y mx-5'>
              <span className={'fs-4 text-gray-800 text-hover-primary fw-bolder mb-0'}>
                {content}
              </span>
            </div>
            <div className={'d-flex flex-center flex-wrap mb-5'}>
              {isShowCancelBtn && (
                <button type='button' className='btn btn-sm btn-primary' onClick={() => onCancel()}>
                  <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
                  No
                </button>
              )}
              <button
                type='button'
                className='btn btn-sm btn-danger'
                style={{marginLeft: '30px'}}
                onClick={() => onConfirm(value)}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                {isShowCancelBtn ? 'Yes' : 'OK'}
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
  )) as JSX.Element;
};

export {ConfirmModal};
