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

export interface ExternalUserDto {
  data: {
    accountNumber: string;
    user: {
      id: number;
      username: string;
      name: string;
      phone: string;
    };
  },
  statusCode: number;
  message: string;
}