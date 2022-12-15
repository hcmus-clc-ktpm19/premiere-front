import axios from 'axios';
import {ReceiverDto} from '@/app/modules/profile/core/_dtos';


const PREMIERE_API_URL: string = process.env.PREMIERE_API_URL!!;

const getAllReceiversByUserId = async (userId: number | undefined) : Promise<ReceiverDto[]> => {
  return (
    await axios.get<ReceiverDto[]>(`${PREMIERE_API_URL}/receivers?userId=${userId}`)
  ).data;
};

const getReceiverByCreditCardNumber = async (creditCardNumber: string | undefined) : Promise<ReceiverDto> => {
  return (
    await axios.get<ReceiverDto>(`${PREMIERE_API_URL}/receivers/${creditCardNumber}`)
  ).data;
}

const insertReceiver = async (receiver: ReceiverDto) : Promise<ReceiverDto> => {
  return (
    await axios.post<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver)
  ).data;
}

const deleteReceiver = async (creditCardNumber: string) : Promise<ReceiverDto> => {
  return (
    await axios.delete<ReceiverDto>(`${PREMIERE_API_URL}/receivers/${creditCardNumber}`)
  ).data;
}

const updateReceiver = async (receiver: ReceiverDto) : Promise<ReceiverDto> => {
  return (
    await axios.put<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver)
  ).data;
}

export const ProfileService = {
  getAllReceiversByUserId,
  getReceiverByCreditCardNumber,
  insertReceiver,
  deleteReceiver,
  updateReceiver
};
