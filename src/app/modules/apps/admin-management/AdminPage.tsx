import React from 'react';
import {PageLink, PageTitle} from "@_metronic/layout/core";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import {
  EmployeesListWrapper
} from "@/app/modules/apps/admin-management/employees-list/ListOfEmployees";
import ListOfTransactions
  from "@/app/modules/apps/admin-management/transactions-list/ListOfTransactions";

const loanBreadCrumbs: Array<PageLink> = [
  {
    title: 'Admin Management',
    path: '/apps/admin-management/employees',
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
const AdminPage = () => {
  return (
      <>
        <Routes>
          <Route element={<Outlet />}>
            <Route
                path='/employees'
                element={
                  <>
                    <PageTitle breadcrumbs={loanBreadCrumbs}>Employees List</PageTitle>
                    <EmployeesListWrapper />
                  </>
                }
            />
            <Route
                path='/transactions'
                element={
                  <>
                    <PageTitle breadcrumbs={loanBreadCrumbs}>Transactions List</PageTitle>
                    <ListOfTransactions />
                  </>
                }
            />
            <Route index element={<Navigate to='/apps/admin-management/employees' />} />
          </Route>
        </Routes>
      </>
  );
};

export default AdminPage;