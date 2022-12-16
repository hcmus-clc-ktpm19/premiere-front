import {UserDto} from '@/app/models/model';
import axios, {AxiosResponse} from 'axios';
import {Response} from '@_metronic/helpers';

const API_URL: string = process.env.PREMIERE_API_URL!!;
const LOAN_REMINDER_URL: string = `${API_URL}/loan-reminders`;

const getUserByCardNumber = (cardNumber: string): Promise<Response<UserDto> | UserDto> => {
  return axios
  .get(`${LOAN_REMINDER_URL}/user/card-number/${cardNumber}`)
  .then((response: AxiosResponse<Response<UserDto>>) => response.data);
}

export const LoanReminderService  = {
  getUserByCardNumber
}