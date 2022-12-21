// @ts-ignore
import { CreateLoanReminderDto, CreditCardDto, ErrorDto, UserDto } from "@/app/models/model";
import axios, {AxiosResponse} from 'axios';
import * as Yup from 'yup';
import {LoanReminderDto} from "@/app/modules/loan-management/core/_dtos";

const API_URL: string = process.env.PREMIERE_API_URL!!;
const LOAN_REMINDER_API: string = `${API_URL}/loan-management`;
const CREDIT_CARD_API: string = `${API_URL}/credit-card`;

const loanReminderValidationSchemas = [
  Yup.object({
    debtorCreditCardNumber: Yup.string().required().label("Debtor's credit card number"),
    debtorName: Yup.string().required().label("Debtor's Name"),
    transferAmount: Yup.number().required().min(100_000).label('Transfer amount'),
  }),
  Yup.object({
    creditorCreditCardNumber: Yup.string().required().label("Your credit card number"),
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
  .then((response: AxiosResponse<number>) => response.data)
}

const getLoanRemindersByUserCreditCardNumber = (cardNumber: string): Promise<LoanReminderDto[]> => {
  return axios
    .get(`${LOAN_REMINDER_API}/loan-reminder/${cardNumber}`)
    .then((response: AxiosResponse<LoanReminderDto[]>) => response.data);
}

const cancelLoanReminder = (loanReminderDto: LoanReminderDto): Promise<String> => {
  return axios.put(`${LOAN_REMINDER_API}/loan-reminder/cancel`, loanReminderDto)
    .then((response: AxiosResponse<String>) => response.data);
}

export const services = {
  loanReminderValidationSchemas,
  getUserByCardNumber,
  getCreditCardByCardNumber,
  saveLoanReminder,
  getLoanRemindersByUserCreditCardNumber,
  cancelLoanReminder,
};
