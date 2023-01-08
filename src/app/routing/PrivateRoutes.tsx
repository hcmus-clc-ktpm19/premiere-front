import { lazy, FC, Suspense } from 'react';
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { MasterLayout } from '@_metronic/layout/MasterLayout';
import TopBarProgress from 'react-topbar-progress-indicator';
import { DashboardWrapper } from '@pages/dashboard/DashboardWrapper';
import { MenuTestPage } from '@pages/MenuTestPage';
import { getCSSVariableValue } from '@_metronic/assets/ts/_utils';
import { WithChildren } from '@_metronic/helpers';
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper';
import LoanManagementPage from '@/app/modules/loan-management/LoanManagementPage';
import { useAuth } from '@/app/modules/auth';
import { DepositMoneyPage } from '@/app/modules/apps/deposit-management/DepositMoneyPage';
import { PremiereRole } from '@/app/models/model';

const PrivateRoutes = () => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'));
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'));
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'));
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'));
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'));
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'));
  const AdminPage = lazy(() => import('../modules/apps/admin-management/AdminPage'));
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<DashboardWrapper />} />
        <Route path='builder' element={<BuilderPageWrapper />} />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <ProtectedRoute
              redirectPath='/dashboard'
              isAllowed={
                currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() ||
                currentUser?.role === PremiereRole.EMPLOYEE.toString()
              }
            >
              <SuspensedView>
                <UsersPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path='apps/admin-management/*'
          element={
            <ProtectedRoute
              redirectPath='/dashboard'
              isAllowed={currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString()}
            >
              <SuspensedView>
                <AdminPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path='apps/deposit-management/*'
          element={
            <ProtectedRoute
              redirectPath='/dashboard'
              isAllowed={
                currentUser?.role === PremiereRole.PREMIERE_ADMIN ||
                currentUser?.role === PremiereRole.EMPLOYEE
              }
            >
              <SuspensedView>
                <DepositMoneyPage />
              </SuspensedView>
            </ProtectedRoute>
          }
        />
        <Route
          path='/loan-management/*'
          element={
            <SuspensedView>
              <LoanManagementPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  );
};

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--kt-primary');
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  });
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>;
};

// eslint-disable-next-line react/prop-types
interface ProtectedRouteProps {
  isAllowed: boolean;
  redirectPath: string;
  children: JSX.Element;
}
const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/dashboard',
  children,
}: ProtectedRouteProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children || <Outlet />;
};

export { PrivateRoutes };
