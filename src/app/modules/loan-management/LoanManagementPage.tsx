import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {PageLink, PageTitle} from '@_metronic/layout/core';
import {CreateLoanReminder} from '@/app/modules/loan-management/components/CreateLoanReminder';

const wizardsBreadCrumbs: Array<PageLink> = [
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
                <PageTitle breadcrumbs={wizardsBreadCrumbs}>Create Loan Reminder</PageTitle>
                <CreateLoanReminder />
              </>
            }
        />
        <Route index element={<Navigate to='/loan-management/create-loan-reminder' />} />
      </Route>
    </Routes>
);

export default WizardsPage;
