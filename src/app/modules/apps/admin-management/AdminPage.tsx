import React from 'react';
import {PageLink, PageTitle} from "@_metronic/layout/core";
import {Navigate, Outlet, Route, Routes} from "react-router-dom";
import ListOfEmployees from "@/app/modules/apps/admin-management/components/ListOfEmployees";
import CreateEmployee from "@/app/modules/apps/admin-management/components/CreateEmployee";
import EmployeeManagement from "@/app/modules/apps/admin-management/components/EmployeeManagement";

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
              path='/employee-management'
              element={
                <>
                  <PageTitle breadcrumbs={loanBreadCrumbs}>Employee Management</PageTitle>
                  <EmployeeManagement />
                </>
              }
          />
            <Route
                path='/employees'
                element={
                  <>
                    <PageTitle breadcrumbs={loanBreadCrumbs}>Employees List</PageTitle>
                    <ListOfEmployees />
                  </>
                }
            />
            <Route
                path='/create-employee'
                element={
                  <>
                    <PageTitle breadcrumbs={loanBreadCrumbs}>List of Employees</PageTitle>
                    <CreateEmployee />
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