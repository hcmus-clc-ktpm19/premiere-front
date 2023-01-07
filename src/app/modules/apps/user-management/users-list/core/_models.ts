import {ID, Response} from '@_metronic/helpers';
import {FullInfoUserDto} from "@/app/models/model";
export type User = {
  id?: ID;
  name?: string;
  username?: string;
  avatar?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: string;
  panNumber?: string;
  address?: string;
  password?: string;
  role?: string;
  position?: string;
  last_login?: string;
  two_steps?: boolean;
  joined_day?: string;
  online?: boolean;
  initials?: {
    label: string;
    state: string;
  };
};

export type UsersQueryResponse = Response<Array<User>>;
export type CustomerQueryResponse = FullInfoUserDto[];

export const initialUser: User = {
  avatar: 'avatars/300-6.jpg',
  position: 'Art Director',
  role: 'Administrator',
  name: '',
  email: '',
};
