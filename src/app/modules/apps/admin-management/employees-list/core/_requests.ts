import axios, { AxiosResponse } from 'axios';
import { ID } from '@_metronic/helpers';
import { EmployeeStatusDto, ErrorDto, FullInfoUserDto } from '@/app/models/model';
import { EmployeeQueryResponse } from '@/app/modules/apps/admin-management/employees-list/core/_models';

const PREMIERE_API_URL = import.meta.env.VITE_PREMIERE_API_URL;
const GET_EMPLOYEES_URL = `${PREMIERE_API_URL}/auth/get-employees`;
const EMPLOYEE_URL = `${PREMIERE_API_URL}/auth/save-employee`;
const EMPLOYEE_STATUS_URL = `${PREMIERE_API_URL}/auth/change-employee-status`;

const getEmployees = (): Promise<EmployeeQueryResponse> => {
  return axios
    .get(`${GET_EMPLOYEES_URL}`)
    .then((response: AxiosResponse<EmployeeQueryResponse>) => response.data);
};

const getEmployeeById = (id: number | null | undefined): Promise<FullInfoUserDto | ErrorDto> => {
  return axios
    .get(`${GET_EMPLOYEES_URL}/${id}`)
    .then((response: AxiosResponse<FullInfoUserDto | ErrorDto>) => {
      if (response.status === 202) {
        const res = response.data as ErrorDto;
        return Promise.reject(res);
      }
      return response.data as FullInfoUserDto;
    });
};

const createEmployee = (customer: FullInfoUserDto): Promise<number> => {
  return axios
    .post(EMPLOYEE_URL, customer)
    .then((response: AxiosResponse<number>) => response.data);
};

const updateEmployee = (customer: FullInfoUserDto): Promise<number> => {
  return axios
    .post(EMPLOYEE_URL, customer)
    .then((response: AxiosResponse<number>) => response.data);
};

const disableEmployeeAccount = (employeeStatusDto: EmployeeStatusDto): Promise<void> => {
  return axios.post(`${EMPLOYEE_STATUS_URL}`, employeeStatusDto).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${EMPLOYEE_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getEmployees,
  disableEmployeeAccount,
  deleteSelectedUsers,
  getEmployeeById,
  createEmployee,
  updateEmployee,
};
