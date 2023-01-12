import axios from 'axios';
import {CreditCardDto, ReceiverDto} from '@/app/modules/profile/core/_dtos';
import {
  PaginationDto,
  PremierePaginationResponseDto,
  TransactionDto,
  TransactionRequestDto,
  TransferMoneyRequestDto,
} from '@/app/models/model';
import * as Yup from 'yup';
import {
  TransactionCriteriaDtoCustom
} from "@/app/modules/apps/admin-management/transactions-list/core/_dtos";

const PREMIERE_API_URL: string = import.meta.env.VITE_PREMIERE_API_URL;

const transactionValidationSchemas = [
  Yup.object({
    isCardSelected: Yup.boolean().required(),
  }),
  Yup.object({
    senderCardNumber: Yup.string(),
    type: Yup.string(),
    isInternal: Yup.boolean(),
    senderBankName: Yup.string(),
    receiverBankName: Yup.string(),
    receiverCardNumber: Yup.string().required().label("Recipient's credit card number"),
    receiverName: Yup.string().required().label("Recipient's Name"),
    amount: Yup.number().required().min(100_000).label('Transfer amount'),
    remark: Yup.string().required().label('Remark'),
    isSelfPaymentFee: Yup.boolean(),
  }),
];

const getAllReceiversByUserId = async (userId: number | undefined): Promise<ReceiverDto[]> => {
  return (await axios.get<ReceiverDto[]>(`${PREMIERE_API_URL}/receivers?userId=${userId}`)).data;
};

const getReceiverByCreditCardNumber = async (
  userId: number | undefined,
  creditCardNumber: string
): Promise<ReceiverDto> => {
  return (
    await axios.get<ReceiverDto>(`${PREMIERE_API_URL}/receivers/${userId}/${creditCardNumber}`)
  ).data;
};

const insertReceiver = (receiver: ReceiverDto): Promise<ReceiverDto> => {
  return axios.post<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver).then((res) => {
    if (res.status === 202) {
      return Promise.reject(res.data);
    }
    return res.data;
  });
  // return (await axios.post<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver)).data;
};

const deleteReceiver = async (creditCardNumber: string): Promise<ReceiverDto> => {
  return (await axios.delete<ReceiverDto>(`${PREMIERE_API_URL}/receivers/${creditCardNumber}`))
    .data;
};

const updateReceiver = async (receiver: ReceiverDto): Promise<ReceiverDto> => {
  return (await axios.put<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver)).data;
};

const getCreditCardByUserId = async (userId: number | undefined): Promise<CreditCardDto> => {
  return (await axios.get<CreditCardDto>(`${PREMIERE_API_URL}/credit-card/${userId}`)).data;
};

const getTransactionByCustomerId = async (
  customerId: number,
  transactionCriteria: TransactionCriteriaDtoCustom
): Promise<PremierePaginationResponseDto<TransactionDto>> => {
  return (
    await axios.post<PremierePaginationResponseDto<TransactionDto>>(
      `${PREMIERE_API_URL}/transactions/users/${customerId}/get-transactions`,
      transactionCriteria
    )
  ).data;
};

const paginationInits: PaginationDto = {
  currPage: 0,
  currPageTotalElements: 0,
  first: false,
  last: false,
  sizePerPage: 0,
  totalElements: 0,
  totalPages: 0,
};

const validateTransferMoney = async (
  transactionRequestDto: TransactionRequestDto
): Promise<any> => {
  return (
    await axios.post(
      `${PREMIERE_API_URL}/transactions/money-transfer/validate`,
      transactionRequestDto
    )
  ).data;
};

const transferMoney = async (transferMoneyRequestDto: TransferMoneyRequestDto): Promise<any> => {
  return (
    await axios.post(`${PREMIERE_API_URL}/transactions/money-transfer`, transferMoneyRequestDto)
  ).data;
};

export const ProfileService = {
  getAllReceiversByUserId,
  getReceiverByCreditCardNumber,
  insertReceiver,
  deleteReceiver,
  updateReceiver,
  getCreditCardByUserId,
  getTransactionByCustomerId,
  paginationInit: paginationInits,
  validateTransferMoney,
  transferMoney,
  transactionValidationSchemas,
};
