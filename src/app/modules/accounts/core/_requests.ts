import axios from 'axios';
import {PasswordDto} from '@/app/modules/accounts/core/_dtos';

const PREMIERE_API_URL: string = import.meta.env.VITE_PREMIERE_API_URL;

const changePassword = async (passwordDto: PasswordDto): Promise<void> => {
  return await axios.put(`${PREMIERE_API_URL}/auth/change-password`, passwordDto);
};

export {changePassword};
