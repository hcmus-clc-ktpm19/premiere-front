import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { I18nProvider } from '@_metronic/i18n/i18nProvider';
import { LayoutProvider, LayoutSplashScreen } from '@_metronic/layout/core';
import { MasterInit } from '@_metronic/layout/MasterInit';
import { AuthInit } from './modules/auth';
import { StompSessionProvider } from 'react-stomp-hooks';
import { NotificationContextProvider } from '@/app/modules/notifications/NotificationContextProvider';

const PREMIERE_SOCKET_ENDPOINT: string = import.meta.env.VITE_PREMIERE_SOCKET_ENDPOINT;
const App = () => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <I18nProvider>
        <LayoutProvider>
          <AuthInit>
            <StompSessionProvider
              url={PREMIERE_SOCKET_ENDPOINT}
              onConnect={() => console.log('Connected to socket')}
              onDisconnect={() => console.log('Disconnected from socket')}
              // debug={(stomp) => console.log(stomp)}
              onWebSocketError={(e) => console.log('error: ', e)}>
              <NotificationContextProvider>
                <Outlet />
                <MasterInit />
              </NotificationContextProvider>
            </StompSessionProvider>
          </AuthInit>
        </LayoutProvider>
      </I18nProvider>
    </Suspense>
  );
};

export { App };
