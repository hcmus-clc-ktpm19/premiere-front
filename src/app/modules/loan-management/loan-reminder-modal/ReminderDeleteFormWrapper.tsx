import { useContext } from 'react';
import { ReminderDeleteModalForm } from '@/app/modules/loan-management/loan-reminder-modal/ReminderDeleteModalForm';
import { LoanReminderContext } from '@/app/modules/loan-management/components/ListOfLoanReminders';

const ReminderDeleteModalFormWrapper = () => {
  // @ts-ignore
  const { reminderToDelete } = useContext(LoanReminderContext);
  return <ReminderDeleteModalForm reminder={reminderToDelete} isReminderLoading={false} />;
};

export { ReminderDeleteModalFormWrapper };
