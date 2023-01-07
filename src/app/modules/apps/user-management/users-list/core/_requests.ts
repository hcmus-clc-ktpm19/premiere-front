import axios, {AxiosResponse} from 'axios';
import {ID} from '@_metronic/helpers';
import {ErrorDto, FullInfoUserDto} from "@/app/models/model";
import {CustomerQueryResponse} from "@/app/modules/apps/user-management/users-list/core/_models";

const PREMIERE_API_URL = process.env.PREMIERE_API_URL!;
const GET_CUSTOMERS_URL = `${PREMIERE_API_URL}/auth/get-customers`;
const CUSTOMER_URL = `${PREMIERE_API_URL}/auth/save-customer`;

const getCustomers = (): Promise<CustomerQueryResponse> => {
  return axios
    .get(`${GET_CUSTOMERS_URL}`)
    .then((response: AxiosResponse<CustomerQueryResponse>) => response.data);
};

const getCustomerById = (id: number | null | undefined): Promise<FullInfoUserDto | ErrorDto> => {
  return axios
    .get(`${GET_CUSTOMERS_URL}/${id}`)
    .then((response: AxiosResponse<FullInfoUserDto | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        return Promise.reject(res);
      }
      return response.data as FullInfoUserDto;
    })
};

const createCustomer = (customer: FullInfoUserDto): Promise<number> => {
  return axios
  .post(CUSTOMER_URL, customer)
  .then((response: AxiosResponse<number>) => response.data);
};

const updateCustomer = (customer: FullInfoUserDto): Promise<number> => {
  return axios
  .post(CUSTOMER_URL, customer)
  .then((response: AxiosResponse<number>) => response.data);
};

const deleteCustomer = (userId: ID): Promise<void> => {
  return axios.delete(`${CUSTOMER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${CUSTOMER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {getCustomers, deleteCustomer, deleteSelectedUsers, getCustomerById, createCustomer, updateCustomer};
