import { useContext } from 'react';
import { KTSVG } from '@_metronic/helpers';
import { LoanReminderContext } from '@/app/modules/loan-management/components/ListOfLoanReminders';

const ReminderDeleteModalHeader = () => {
  // @ts-ignore
  const { openReminderDeleteModal } = useContext(LoanReminderContext);
  return (
    <div className='modal-header'>
      {/* begin::Modal title */}
      <h2 className='fw-bolder'>Loan Reminder Details</h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className='btn btn-icon btn-sm btn-active-icon-primary'
        data-kt-users-modal-action='close'
        onClick={() => openReminderDeleteModal()}
        style={{ cursor: 'pointer' }}
      >
        <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon-1' />
      </div>
      {/* end::Close */}
    </div>
  );
};

export { ReminderDeleteModalHeader };
