import {
  CreateLoanReminderDto,
  CreditCardDto,
  ErrorDto,
  TransferMoneyRequestDto,
  UserDto
} from '@/app/models/model';
import axios, { AxiosResponse } from 'axios';
import * as Yup from 'yup';
import { LoanReminderDto, LoanReminderMessageDto } from '@/app/modules/loan-management/core/_dtos';
import {ExternalUserDto} from "@/app/modules/profile/core/_dtos";

const API_URL: string = import.meta.env.VITE_PREMIERE_API_URL;
const LOAN_REMINDER_API = `${API_URL}/loan-management`;
const CREDIT_CARD_API = `${API_URL}/credit-card`;
const LOAN_REMINDER_SOCKET_API = `${API_URL}/notification`;
const EXTERNAL_USER_API = `${CREDIT_CARD_API}/external-bank/Taixiubank`;

const loanReminderValidationSchemas = [
  Yup.object({
    debtorCreditCardNumber: Yup.string().required().label("Debtor's credit card number"),
    debtorName: Yup.string().required().label("Debtor's Name"),
    transferAmount: Yup.number().required().min(100_000).label('Transfer amount'),
  }),
  Yup.object({
    creditorCreditCardNumber: Yup.string().required().label('Your credit card number'),
  }),
];

const getUserByCardNumber = (cardNumber: string): Promise<UserDto | ErrorDto> => {
  return axios
    .get<UserDto>(`${LOAN_REMINDER_API}/user/card-number/${cardNumber}`)
    .then((response: AxiosResponse<UserDto | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        return Promise.reject(res);
      }

      return response.data as UserDto;
    });
};

const getExternalCreditCardByCardNumber = async (cardNumber: string): Promise<ExternalUserDto> => {
  return await axios
    .get<ExternalUserDto>(`${EXTERNAL_USER_API}/${cardNumber}`)
    .then((response: AxiosResponse<ExternalUserDto>) => response.data);
};

const getCreditCardByCardNumber = (cardNumber: string): Promise<CreditCardDto | ErrorDto> => {
  return axios
    .get(`${CREDIT_CARD_API}/card-number/${cardNumber}`)
    .then((response: AxiosResponse<CreditCardDto | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        return Promise.reject(res);
      }

      return response.data as CreditCardDto;
    });
};

const saveLoanReminder = (loanReminder: CreateLoanReminderDto): Promise<number> => {
  return axios
    .post(LOAN_REMINDER_API, loanReminder)
    .then((response: AxiosResponse<number>) => response.data);
};

const getLoanRemindersByUserCreditCardNumber = (cardNumber: string): Promise<LoanReminderDto[]> => {
  return axios
    .get(`${LOAN_REMINDER_API}/loan-reminder/${cardNumber}`)
    .then((response: AxiosResponse<LoanReminderDto[]>) => response.data);
};

const cancelLoanReminder = (loanReminderDto: LoanReminderDto): Promise<string> => {
  return axios
    .put(`${LOAN_REMINDER_API}/loan-reminder/cancel`, loanReminderDto)
    .then((response: AxiosResponse<string>) => response.data);
};

const pushMessageToMessageQueue = (
  loanReminderMessageDto: LoanReminderMessageDto
): Promise<void> => {
  return axios
    .post(`${LOAN_REMINDER_SOCKET_API}/loan-reminder/message`, loanReminderMessageDto)
    .then((response: AxiosResponse<void>) => response.data);
};

const validateLoanReminder = (id: number): Promise<any> => {
  return axios
  .post(`${LOAN_REMINDER_API}/loan-reminder/validate/${id}`)
  .then((response: AxiosResponse<any>) => response.data);
}

const payLoanReminder = (loanReminderPayDto: TransferMoneyRequestDto): Promise<any> => {
  return axios
  .post(`${LOAN_REMINDER_API}/loan-reminder/pay`, loanReminderPayDto)
  .then((response: AxiosResponse<any>) => response.data);
}

export const services = {
  loanReminderValidationSchemas,
  getUserByCardNumber,
  getExternalCreditCardByCardNumber,
  getCreditCardByCardNumber,
  saveLoanReminder,
  getLoanRemindersByUserCreditCardNumber,
  cancelLoanReminder,
  pushMessageToMessageQueue,
  validateLoanReminder,
  payLoanReminder
};
