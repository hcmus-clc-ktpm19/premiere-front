// @ts-ignore
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

const cancelReminderInit: object = {
  cancelReason: 'I no longer need this loan reminder',
}

export {loanReminderInit, cancelReminderInit};
