export interface ReceiverDto {
  id: number | null;
  cardNumber: string;
  nickname: string;
  fullName: string;
  userId: number;
  bankName: string;
}

export interface CreditCardDto {
  balance: number;
  cardNumber: string;
}
