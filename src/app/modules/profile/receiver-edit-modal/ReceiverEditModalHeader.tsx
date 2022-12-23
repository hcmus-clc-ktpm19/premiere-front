import {KTSVG} from '../../../../_metronic/helpers';
import {useContext} from 'react';
import {ReceiverModalContext} from '@/app/modules/profile/components/Receivers';

const ReceiverEditModalHeader = () => {
  // @ts-ignore
  const {openAddReceiverModal} = useContext(ReceiverModalContext);
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Add Receiver</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => openAddReceiverModal()}
        style={{cursor: 'pointer'}}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
      </div>
      {/* end::Close */}
    </div>
  );
};

export {ReceiverEditModalHeader};
