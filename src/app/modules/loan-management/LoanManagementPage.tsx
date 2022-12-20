import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {PageLink, PageTitle} from '@_metronic/layout/core';
import {CreateLoanReminder} from '@/app/modules/loan-management/components/CreateLoanReminder';
import ListOfLoanReminders from "@/app/modules/loan-management/components/ListOfLoanReminders";

const loanBreadCrumbs: Array<PageLink> = [
  {
    title: 'Loan Management',
    path: '/loan-management/create-loan-reminder',
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

const WizardsPage = () => (
  <Routes>
    <Route element={<Outlet />}>
      <Route
        path='/create-loan-reminder'
        element={
          <>
            <PageTitle breadcrumbs={loanBreadCrumbs}>Create Loan Reminder</PageTitle>
            <CreateLoanReminder />
          </>
        }
      />
      <Route
          path='/list-of-loan-reminders'
          element={
            <>
              <PageTitle breadcrumbs={loanBreadCrumbs}>List of Loan Reminders</PageTitle>
              <ListOfLoanReminders />
            </>
          }
      />
      <Route index element={<Navigate to='/loan-management/create-loan-reminder' />} />
    </Route>
  </Routes>
);

export default WizardsPage;
