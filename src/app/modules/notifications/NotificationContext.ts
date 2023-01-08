import { createContext, SyntheticEvent } from 'react';
import { AlertColor } from '@mui/material';

const NOTIFICATION_TIMEOUT = 5000;

type NotificationContextType = {
  isShow: boolean;
  content: string;
  type: AlertColor;
  onClose: (event: Event | SyntheticEvent<Element, Event>) => void;
  destination: string;
};
const initialNotificationContext: NotificationContextType = {
  isShow: false,
  content: '',
  type: 'info',
  onClose: () => {},
  destination: '',
};

const NotificationContext = createContext({
  ...initialNotificationContext,
  setNotification: (
    isShow: boolean,
    content: string,
    type: AlertColor,
    onClose: (event: Event | SyntheticEvent<Element, Event>) => void,
    destination: string = '/'
  ) => {},
});

export { NOTIFICATION_TIMEOUT, NotificationContext, initialNotificationContext };
