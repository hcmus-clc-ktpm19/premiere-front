/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.0.1157 on 2023-01-14 19:23:44.

export interface BankDto extends PremiereAbstractEntityDto {
    bankName: string;
}

export interface CreateLoanReminderDto {
    creditorCreditCardNumber: string;
    debtorCreditCardNumber: string;
    debtorName: string;
    transferAmount: number;
    loanRemark: string;
    debtorPhone: string;
}

export interface CreditCardDto extends PremiereAbstractEntityDto {
    balance: number;
    openDay: Date;
    cardNumber: string;
    userId: number;
}

export interface CreditCardExternalDto {
    accountNumber: string;
    timestamp: number;
    msgToken: string;
    slug: string;
}

export interface CreditCardExternalResponseDto {
    data: ResponseDataDto;
    statusCode: number;
    message: string;
}

export interface CreditCardNumberDto {
    slug: string;
    accountNumber: string;
}

export interface DepositMoneyExternalRequestDto {
    senderCreditCardNumber: string;
    receiverCreditCardNumber: string;
    amount: number;
    senderBankName: string;
    rsaToken: string;
}

export interface DepositMoneyRequestDto {
    username: string;
    creditCardNumber: string;
    amount: number;
}

export interface EmployeeStatusDto {
    username: string;
    enabled: boolean;
}

export interface ErrorDto {
    message: string;
    i18nPlaceHolder: string;
}

export interface FullInfoUserDto extends PremiereAbstractEntityDto {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
    panNumber: string;
    address: string;
    password?: string;
    role: string;
    enabled: boolean;
    cardEnabled: boolean;
}

export interface LoanReminderDto {
    id: number;
    version: number;
    transferAmount: number;
    status: LoanStatus;
    time: Date;
    updatedTime: Date;
    loanRemark: string;
    senderCreditCardId: number;
    receiverCreditCardId: number;
    senderCreditCardNumber: string;
    senderName: string;
    senderId: number;
    receiverCreditCardNumber: string;
    receiverName: string;
    receiverId: number;
    cancelReason: string;
}

export interface LoanReminderMessageDto {
    senderName: string;
    senderId: number;
    receiverName: string;
    receiverId: number;
    message: string;
    destination: string;
}

export interface MetaDataDto {
    pagination: PaginationDto;
}

export interface OTPDto {
    otp: string;
    email: string;
    createdAt: Date;
}

export interface PaginationDto {
    currPage: number;
    sizePerPage: number;
    currPageTotalElements: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
}

export interface PasswordDto {
    username: string;
    email: string;
    currentPassword: string;
    newPassword: string;
}

export interface PremiereAbstractEntityDto {
    id?: number;
    version: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PremierePaginationResponseDto<T> {
    payload: T[];
    meta: MetaDataDto;
}

export interface ReceiverDto {
    id: number;
    cardNumber: string;
    nickname: string;
    fullName: string;
    userId: number;
    bankName: string;
}

export interface ResponseDataDto {
    accountNumber: string;
    user: { [index: string]: string };
}

export interface TransactionCriteriaDto {
    page?: number;
    size?: number;
    transactionType?: TransactionType;
    moneyTransferCriteria?: MoneyTransferCriteria;
    fromDate?: Date;
    toDate?: Date;
    asc?: boolean;
}

export interface TransactionDto {
    id: number;
    version: number;
    createdAt: Date;
    updatedAt: Date;
    amount: number;
    type: TransactionType;
    time: Date;
    transactionRemark: string;
    totalBalance: number;
    senderCreditCardNumber: string;
    receiverCreditCardNumber: string;
    fee: number;
    status: TransactionStatus;
    senderBankId: number;
    receiverBankId: number;
    selfPaymentFee: boolean;
}

export interface TransactionInfoExternalDto {
    accountDesNumber: string;
    amount: number;
    description: string;
    payTransactionFee: string;
}

export interface TransactionRequestDto {
    senderCardNumber: string;
    receiverCardNumber: string;
    amount: string;
    type: string;
    isInternal: boolean;
    isSelfPaymentFee: boolean;
    remark: string;
    senderBankName: string;
    receiverBankName: string;
    otp: string;
}

export interface TransferExternalHashDto {
    accountDesNumber: string;
    amount: number;
    description: string;
    payTransactionFee: string;
    accountSrcNumber: string;
    slug: string;
}

export interface TransferExternalRequestDto {
    accountNumber: string;
    transactionInfo: TransactionInfoExternalDto;
    timestamp: number;
    msgToken: string;
    slug: string;
    signature: string;
}

export interface TransferExternalResponseDto {
    data: TransferResponseDataDto;
    statusCode: number;
    signature: string;
    message: string;
}

export interface TransferMoneyRequestDto {
    requestID: number;
    otp: string;
}

export interface TransferResponseDataDto {
    accountDesNumber: string;
    amount: number;
    description: string;
    payTransactionFee: string;
    status: number;
    accountSrcNumber: string;
    transactionType: string;
    bankDesId: number;
    id: number;
}

export interface UserDto {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: PremiereRole;
}

export interface WebSocketResponseDto<T> {
    action: WebSocketAction;
    message: string;
    data: T;
}

export const enum AlgorithmType {
    RSA = "RSA",
}

export const enum CardStatus {
    AVAILABLE = "AVAILABLE",
    DISABLED = "DISABLED",
}

export const enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export const enum LoanStatus {
    APPROVED = "APPROVED",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    PAID = "PAID",
}

export const enum MoneyTransferCriteria {
    INCOMING = "INCOMING",
    OUTGOING = "OUTGOING",
}

export const enum PremiereRole {
    CUSTOMER = "CUSTOMER",
    EMPLOYEE = "EMPLOYEE",
    PREMIERE_ADMIN = "PREMIERE_ADMIN",
}

export const enum TransactionStatus {
    CHECKING = "CHECKING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}

export const enum TransactionType {
    MONEY_TRANSFER = "MONEY_TRANSFER",
    LOAN = "LOAN",
}

export const enum WebSocketAction {
    DEPOSIT_MONEY = "DEPOSIT_MONEY",
}
