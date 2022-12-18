import {CreateLoanReminderDto} from '@/app/models/model';

const loanReminderInit: CreateLoanReminderDto = {
  creditorCreditCardNumber: '',
  creditorCreditCardId: '',
  debtorCreditCardNumber: '',
  debtorName: '',
  transferAmount: 0,
  loanRemark: '',
  debtorPhone: '',
};

export {loanReminderInit};
