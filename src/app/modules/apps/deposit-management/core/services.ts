import { DepositMoneyRequestDto, ErrorDto } from '@/app/models/model';
import axios, { AxiosResponse } from 'axios';
import * as Yup from 'yup';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const API_URL: string = process.env.PREMIERE_API_URL!;
const CREDIT_CARD_API = `${API_URL}/credit-card`;

const depositMoneyValidationSchemas = Yup.object({});

const depositMoney = (
  depositMoneyRequestDto: DepositMoneyRequestDto
): Promise<number | ErrorDto> => {
  return axios
    .put<number>(`${CREDIT_CARD_API}/deposit-money`, depositMoneyRequestDto)
    .then((response: AxiosResponse<number | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        return Promise.reject(res);
      }

      return response.data as number;
    })
    .catch((error: ErrorDto | any) => {
      return Promise.reject(error);
    });
};

export const depositMoneyService = {
  depositMoneyValidationSchemas,
  depositMoney,
};
