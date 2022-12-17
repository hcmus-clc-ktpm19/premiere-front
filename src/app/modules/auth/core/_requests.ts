import axios from 'axios';
import {AuthModel, UserModel} from './_models';
import qs from 'qs';

const API_URL = process.env.REACT_APP_API_URL;
const KEYCLOAK_ACCESS_TOKEN_URL: string = process.env.KEYCLOAK_ACCESS_TOKEN_URL!!;
const KEYCLOAK_SCOPE: string = process.env.KEYCLOAK_SCOPE!!;
const KEYCLOAK_CLIENT_ID: string = process.env.KEYCLOAK_CLIENT_ID!!;
const KEYCLOAK_CLIENT_SECRET: string = process.env.KEYCLOAK_CLIENT_SECRET!!;
const KEYCLOAK_GRANT_TYPE: string = process.env.KEYCLOAK_GRANT_TYPE!!;
const PREMIERE_API_URL: string = process.env.PREMIERE_API_URL!!;

const keycloakAuthRequestAttributes = {
  grant_type: KEYCLOAK_GRANT_TYPE,
  scope: KEYCLOAK_SCOPE,
  client_id: KEYCLOAK_CLIENT_ID,
  client_secret: KEYCLOAK_CLIENT_SECRET,
};

const keycloakConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/verify_token`;
export const LOGIN_URL = `${API_URL}/login`;
export const REGISTER_URL = `${PREMIERE_API_URL}/auth/register`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
export const GET_CURR_USER_API = `${PREMIERE_API_URL}/auth/token/user`;

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post<AuthModel>(LOGIN_URL, {
    email,
    password,
  });
}

// Server should return AuthModel
// export function register(
//   email: string,
//   firstname: string,
//   lastname: string,
//   password: string,
//   password_confirmation: string
// ) {
//   return axios.post(REGISTER_URL, {
//     email,
//     first_name: firstname,
//     last_name: lastname,
//     password,
//     password_confirmation,
//   });
// }

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken() {
  return axios.get<UserModel>(GET_CURR_USER_API);
}

export const AuthService = {
  login,

  // register,

  requestPassword,

  getUserByToken,

  loginKeycloak(username: string, password: string) {
    return axios.post<AuthModel>(
      KEYCLOAK_ACCESS_TOKEN_URL,
      qs.stringify({
        ...keycloakAuthRequestAttributes,
        username,
        password,
      }),
      keycloakConfig
    );
  },
};
