export interface LoanReminderDto {
  id: number;
  version: number;
  transferAmount: number;
  loanRemark: string;
  time: string;
  status: string;
  senderCreditCardNumber: string;
  senderName: string;
  receiverName: string;
  receiverCreditCardNumber: string;
  senderCreditCardId: number;
  receiverCreditCardId: number;
  cancelReason: string;
}
