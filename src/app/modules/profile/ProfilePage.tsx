import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import {PageLink, PageTitle} from '@_metronic/layout/core';
import {Overview} from './components/Overview';
import {Projects} from './components/Projects';
import {Campaigns} from './components/Campaigns';
import {Documents} from './components/Documents';
import {Receivers} from './components/Receivers';
import {ProfileHeader} from './ProfileHeader';
import {Transactions} from '@/app/modules/profile/components/Transactions';
import CreateInternalTransaction from "@/app/modules/profile/components/CreateInternalTransaction";
import CreateTransaction from "@/app/modules/profile/components/CreateTransaction";

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/crafted/pages/profile/spend_account',
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

const ProfilePage = () => (
  <Routes>
    <Route
      element={
        <>
          <ProfileHeader />
          <Outlet />
        </>
      }
    >
      <Route
        path='spend_account'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Spend Account</PageTitle>
            <Overview />
          </>
        }
      />
      <Route
        path='projects'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Projects</PageTitle>
            <Projects />
          </>
        }
      />
      <Route
        path='campaigns'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Campaigns</PageTitle>
            <Campaigns />
          </>
        }
      />
      <Route
        path='transactions'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Transactions</PageTitle>
            <Transactions />
          </>
        }
      />
      <Route
          path='create-transaction'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Create Transaction</PageTitle>
              <CreateTransaction />
            </>
          }
      />
      <Route
          path='create-transaction/internal'
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}>Internal Transaction</PageTitle>
              <CreateInternalTransaction />
            </>
          }
      />
      <Route
        path='documents'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Documents</PageTitle>
            <Documents />
          </>
        }
      />
      <Route
        path='receivers'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Receivers</PageTitle>
            <Receivers />
          </>
        }
      />
      <Route index element={<Navigate to='/crafted/pages/profile/spend_account' />} />
    </Route>
  </Routes>
);

export default ProfilePage;
