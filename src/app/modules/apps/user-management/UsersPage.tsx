import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { PageLink, PageTitle } from '@_metronic/layout/core';
import { UsersListWrapper } from './users-list/UsersList';
import { Transactions } from '@/app/modules/profile/components/Transactions';

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: 'User Management',
    path: '/apps/user-management/users',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
];

const UsersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='users'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>Users list</PageTitle>
              <UsersListWrapper />
            </>
          }
        />
        <Route
          path='users/transactions'
          element={
            <>
              <PageTitle breadcrumbs={usersBreadcrumbs}>User transactions</PageTitle>
              <Transactions />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/user-management/users' />} />
    </Routes>
  );
};

export default UsersPage;
