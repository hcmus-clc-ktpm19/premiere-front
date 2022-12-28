import axios from 'axios';
import {CreditCardDto, ReceiverDto} from '@/app/modules/profile/core/_dtos';
import {
  PaginationDto,
  PremierePaginationReponseDto,
  TransactionCriteriaDto,
  TransactionDto, TransactionRequestDto, TransferMoneyRequestDto,
} from '@/app/models/model';
import * as Yup from "yup";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const PREMIERE_API_URL: string = process.env.PREMIERE_API_URL!;

const transactionValidationSchemas = [
  Yup.object({
    isCardSelected: Yup.boolean().required(),
  }),
  Yup.object({
    debtorCreditCardNumber: Yup.string().required().label("Debtor's credit card number"),
    debtorName: Yup.string().required().label("Debtor's Name"),
    transferAmount: Yup.number().required().min(100_000).label('Transfer amount'),
  }),
];

const getAllReceiversByUserId = async (userId: number | undefined): Promise<ReceiverDto[]> => {
  return (await axios.get<ReceiverDto[]>(`${PREMIERE_API_URL}/receivers?userId=${userId}`)).data;
};

const getReceiverByCreditCardNumber = async (creditCardNumber: string): Promise<ReceiverDto> => {
  return (await axios.get<ReceiverDto>(`${PREMIERE_API_URL}/receivers/${creditCardNumber}`)).data;
};

const insertReceiver = async (receiver: ReceiverDto): Promise<ReceiverDto> => {
  return (await axios.post<ReceiverDto>(`${PREMIERE_API_URL}/receivers`, receiver)).data;
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
  transactionCriteria: TransactionCriteriaDto
): Promise<PremierePaginationReponseDto<TransactionDto>> => {
  return (
    await axios.post<PremierePaginationReponseDto<TransactionDto>>(
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

const validateTransferMoney = async (transactionRequestDto: TransactionRequestDto): Promise<any> => {
  return (await axios.post(`${PREMIERE_API_URL}/transactions/money-transfer/validate`, transactionRequestDto)).data;
}

const transferMoney = async (transferMoneyRequestDto: TransferMoneyRequestDto): Promise<any> => {
  return (await axios.post(`${PREMIERE_API_URL}/transactions/money-transfer`, transferMoneyRequestDto)).data;
}

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
  transactionValidationSchemas
};
