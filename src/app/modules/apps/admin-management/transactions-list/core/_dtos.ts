import {MoneyTransferCriteria, TransactionType} from "@/app/models/model";

export interface TransactionCriteriaDtoCustom {
  page?: number;
  size?: number;
  transactionType?: TransactionType;
  moneyTransferCriteria?: MoneyTransferCriteria;
  fromDate?: string;
  toDate?: string;
  asc?: boolean;
}
