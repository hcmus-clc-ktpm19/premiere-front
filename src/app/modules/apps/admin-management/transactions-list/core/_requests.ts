import axios from 'axios';
import {PaginationDto, PremierePaginationResponseDto, TransactionDto} from "@/app/models/model";
import {
  TransactionCriteriaDtoCustom
} from "@/app/modules/apps/admin-management/transactions-list/core/_dtos";

const PREMIERE_API_URL = import.meta.env.VITE_PREMIERE_API_URL;
const GET_TRANSACTIONS_URL = `${PREMIERE_API_URL}/transactions`;

const getTransactions = async (bankId: number,
                               fromDate: string,
                               toDate: string,
                               transactionCriteriaDto: TransactionCriteriaDtoCustom): Promise<PremierePaginationResponseDto<TransactionDto>> => {
  return (
      await axios.post<PremierePaginationResponseDto<TransactionDto>>(
          `${GET_TRANSACTIONS_URL}/${bankId}/get-transactions/${fromDate}/${toDate}`,
          transactionCriteriaDto
      )
  ).data;
}

const paginationInits: PaginationDto = {
  currPage: 0,
  currPageTotalElements: 0,
  first: false,
  last: false,
  sizePerPage: 0,
  totalElements: 0,
  totalPages: 0,
};

export const TransactionService = {
  paginationInit: paginationInits,
  getTransactions
};