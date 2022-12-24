import {createContext, SyntheticEvent} from "react";
import {AlertColor} from "@mui/material";

const NOTIFICATION_TIMEOUT = 5000;

type NotificationContextType = {
  isShow: boolean;
  content: string;
  type: AlertColor;
  onClose: (event: Event | SyntheticEvent<Element, Event>) => void;
}
const initialNotificationContext: NotificationContextType = {
  isShow: false,
  content: '',
  type: 'info',
  onClose: () => {},
}

const NotificationContext = createContext({
  ...initialNotificationContext,
  setNotification: (isShow: boolean, content: string, type: AlertColor, onClose: (event: Event | SyntheticEvent<Element, Event>) => void) => {},
});

export {
  NOTIFICATION_TIMEOUT,
  NotificationContext,
  initialNotificationContext,
}