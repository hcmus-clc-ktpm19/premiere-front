import { DepositMoneyRequestDto, ErrorDto } from '@/app/models/model';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as Yup from 'yup';
import CreditCardNotFoundException from '@/app/models/exceptions/CreditCardNotFoundException';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const API_URL: string = process.env.PREMIERE_API_URL!;
const CREDIT_CARD_API = `${API_URL}/credit-card`;
const WEB_SOCKET_API = `${API_URL}/notification`;

const depositMoneyValidationSchemas = Yup.object().shape({
  username: Yup.string()
    // .matches(/\(?(\d{3})\)?([ .-]?)(\d{3})\2(\d{4})/, 'Invalid phone number')
    .when('creditCardNumber', {
      is: (creditCardNumber: string) => !creditCardNumber || creditCardNumber.length === 0,
      then: Yup.string().required('Phone number is required'),
    }),
  creditCardNumber: Yup.string(),
  amount: Yup.number()
    .min(100_000, 'Minimum amount is 100,000 VND')
    .max(100_000_000, 'Maximum amount is 100,000,000 VND')
    .required('Amount is required'),
});

const initDepositMoneyRequest: DepositMoneyRequestDto = {
  amount: 0,
  creditCardNumber: '',
  username: '',
};

const depositMoney = (
  depositMoneyRequestDto: DepositMoneyRequestDto
): Promise<number | ErrorDto> => {
  return axios
    .put<number>(`${CREDIT_CARD_API}/deposit-money`, depositMoneyRequestDto)
    .then((response: AxiosResponse<number | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        throw new CreditCardNotFoundException(res.message, res);
      }

      return response.data as number;
    })
    .catch((error: AxiosError | any) => {
      throw error;
    });
};

const pushDepositSuccessNotification = (depositMoneyRequestDto: DepositMoneyRequestDto): Promise<void> => {
  return axios
    .post(`${WEB_SOCKET_API}/deposit-money/message`, depositMoneyRequestDto)
    .then((response: AxiosResponse<void>) => response.data);
}

export const depositMoneyService = {
  depositMoneyValidationSchemas,
  initDepositMoneyRequest,
  depositMoney,
  pushDepositSuccessNotification,
};
