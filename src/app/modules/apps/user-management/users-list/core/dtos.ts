import {ID} from '@_metronic/helpers';

export interface UserDto {
  id?: ID;
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
}
