import axios from 'axios';
import {AuthModel, UserModel} from './_models';

const API_URL = process.env.REACT_APP_API_URL;
const KEYCLOAK_ACCESS_TOKEN_URL: string = process.env.KEYCLOAK_ACCESS_TOKEN_URL!!;
const KEYCLOAK_SCOPE = process.env.KEYCLOAK_SCOPE;
const KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
const KEYCLOAK_GRANT_TYPE = process.env.KEYCLOAK_GRANT_TYPE;

console.log(
  axios.post(KEYCLOAK_ACCESS_TOKEN_URL, {
    grant_type: KEYCLOAK_GRANT_TYPE,
    username: 'customer',
    password: 'customer',
    scope: KEYCLOAK_SCOPE,
    client_id: KEYCLOAK_CLIENT_ID,
    client_secret: '',
  })
);

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${API_URL}/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  });
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    api_token: token,
  });
}
