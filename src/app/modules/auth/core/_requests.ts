import axios from 'axios';
import { AuthModel, OTPModel, PasswordResetModel, UserModel } from './_models';
import qs from 'qs';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const KEYCLOAK_ACCESS_TOKEN_URL: string = import.meta.env.VITE_KEYCLOAK_ACCESS_TOKEN_URL;
const KEYCLOAK_SCOPE: string = import.meta.env.VITE_KEYCLOAK_SCOPE;
const KEYCLOAK_CLIENT_ID: string = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const KEYCLOAK_CLIENT_SECRET: string = import.meta.env.VITE_KEYCLOAK_CLIENT_SECRET;
const PREMIERE_API_URL: string = import.meta.env.VITE_PREMIERE_API_URL;

interface KeycloakAuthRequestAttributes {
  grant_type?: string;
  scope: string;
  client_id: string;
  client_secret: string;
}

const keycloakAuthRequestAttributes: KeycloakAuthRequestAttributes = {
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
export const REGISTER_URL = `${API_URL}/register`;
export const REGISTER_CUSTOMER_URL = `${PREMIERE_API_URL}/auth/register-customer`;
export const REGISTER_EMPLOYEE_URL = `${PREMIERE_API_URL}/auth/register-employee`;
export const REQUEST_PASSWORD_URL = `${API_URL}/forgot_password`;
export const GET_CURR_USER_API = `${PREMIERE_API_URL}/auth/token/user`;
export const BASE_AUTH_URL = `${PREMIERE_API_URL}/auth`;

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
  return axios.post<{ result: boolean }>(REQUEST_PASSWORD_URL, {
    email,
  });
}

export function getUserByToken() {
  return axios.get<UserModel>(GET_CURR_USER_API);
}

export function requestOTP(otp: OTPModel) {
  return axios.post(`${BASE_AUTH_URL}/request-otp`, otp);
}

export function verifyOTP(otp: OTPModel) {
  return axios.post(`${BASE_AUTH_URL}/verify-otp`, otp);
}

export function resetPassword(passwordResetModel: PasswordResetModel) {
  return axios.put(`${BASE_AUTH_URL}/reset-password`, passwordResetModel);
}

export const AuthService = {
  login,

  register,

  requestPassword,

  getUserByToken,

  loginKeycloak(username: string, password: string) {
    keycloakAuthRequestAttributes.grant_type = 'password';
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

  getToken(refreshToken: string) {
    keycloakAuthRequestAttributes.grant_type = 'refresh_token';
    return axios.post<AuthModel>(
      KEYCLOAK_ACCESS_TOKEN_URL,
      qs.stringify({ ...keycloakAuthRequestAttributes, refresh_token: refreshToken }),
      keycloakConfig
    );
  },
};
