import {KTSVG} from '../../../../_metronic/helpers';
import {useListView} from '../../apps/user-management/users-list/core/ListViewProvider';
import {useContext} from "react";
import {ReceiverModalContext} from "@/app/modules/profile/receiver-edit-modal/ReceiverEditModal";

const ReceiverEditModalHeader = () => {
  const onClose = useContext(ReceiverModalContext);
  return (
      <div className='modal-header'>
        {/* begin::Modal title */}
        <h2 className='fw-bolder'>Add Receiver</h2>
        {/* end::Modal title */}

        {/* begin::Close */}
        <div
            className='btn btn-icon btn-sm btn-active-icon-primary'
            data-kt-users-modal-action='close'
            onClick={() => onClose()}
            style={{cursor: 'pointer'}}
        >
          <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
        </div>
        {/* end::Close */}
      </div>
  );
};

export {ReceiverEditModalHeader};
