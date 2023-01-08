import { Route, Routes } from 'react-router-dom';
import { Registration } from './components/Registration';
import { ForgotPassword } from './components/ForgotPassword';
import { Login } from './components/Login';
import { AuthLayout } from './AuthLayout';
import { OTP } from '@/app/modules/auth/components/OTP';
import React from 'react';
import { ResetPassword } from '@/app/modules/auth/components/ResetPassword';

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='registration' element={<Registration />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route path='verify-otp' element={<OTP />} />
      <Route path='reset-password' element={<ResetPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
);

export { AuthPage };
