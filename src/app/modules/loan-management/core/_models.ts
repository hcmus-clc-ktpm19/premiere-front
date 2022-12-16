export interface LoanReminderDto {
  accountNumber: string,
  debtorName: string,
  transferAmount: number,
  content?: string,
  debtorPhone?: string,
}

const loanReminderInit: LoanReminderDto = {
  accountNumber: '',
  debtorName: '',
  transferAmount: 0,
}

export {
  loanReminderInit
}