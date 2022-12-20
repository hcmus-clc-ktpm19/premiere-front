import axios, {AxiosResponse} from 'axios';
import {ID, Response} from '@_metronic/helpers';
import {User, UsersQueryResponse} from './_models';
import {ResponseDto, UserDto} from '@/app/modules/apps/user-management/users-list/core/dtos';
import {REGISTER_CUSTOMER_URL, REGISTER_EMPLOYEE_URL} from '@/app/modules/auth/core/_requests';

const PREMIERE_API_URL = process.env.PREMIERE_API_URL!;
const GET_USERS_URL = `${PREMIERE_API_URL}/users/query`;
const USER_URL = `${PREMIERE_API_URL}/user`;

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
};

const getUserById = (id: ID): Promise<UserDto | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<UserDto>>) => response.data)
    .then((response: Response<UserDto>) => response.data);
};

const createUser = (user: UserDto): Promise<ResponseDto> => {
  if (user.role === 'CUSTOMER') {
    return axios
      .post(REGISTER_CUSTOMER_URL, user)
      .then((response: AxiosResponse<ResponseDto>) => response.data);
  } else {
    return axios
      .post(REGISTER_EMPLOYEE_URL, user)
      .then((response: AxiosResponse<ResponseDto>) => response.data);
  }
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {getUsers, deleteUser, deleteSelectedUsers, getUserById, createUser, updateUser};
