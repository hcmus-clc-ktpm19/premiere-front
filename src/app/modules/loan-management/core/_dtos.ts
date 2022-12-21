export interface LoanReminderDto {
  id: number;
  version: number;
  transferAmount: number;
  loanRemark: string;
  time: string;
  status: string;
  senderCreditCardNumber: string;
  senderName: string;
  senderId: number;
  receiverName: string;
  receiverId: number;
  receiverCreditCardNumber: string;
  senderCreditCardId: number;
  receiverCreditCardId: number;
  cancelReason: string;
}

export interface LoanReminderMessageDto {
  senderName: string;
  senderId: number;
  receiverName: string;
  receiverId: number;
  message: string;
}