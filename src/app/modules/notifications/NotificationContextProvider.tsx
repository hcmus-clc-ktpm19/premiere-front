import React, {SyntheticEvent, useState} from "react";
import {AlertColor} from "@mui/material";
import {
  NOTIFICATION_TIMEOUT,
  NotificationContext
} from "@/app/modules/notifications/NotificationContext";

export const NotificationContextProvider = ({children}: { children: React.ReactNode }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<AlertColor>('info');
  const [onClose, setOnClose] = useState<(event: Event | SyntheticEvent<Element, Event>) => void>(() => () => {});
  const [destination, setDestination] = useState<string>('/');

  const setNotification = (isShow: boolean, content: string, type: AlertColor, onClose: (event: Event | SyntheticEvent<Element, Event>) => void, destination: string = '/') => {
    setIsShow(isShow);
    setContent(content);
    setType(type);
    setOnClose(onClose);
    setDestination(destination);
    setTimeout(() => {
      setIsShow(false);
      setContent('');
      setType('info');
      setOnClose(onClose);
      setDestination(destination);
    }, NOTIFICATION_TIMEOUT);
  }

  return (
      <NotificationContext.Provider value={{
        isShow,
        content,
        type,
        onClose,
        destination,
        setNotification
      }}>
        {children}
      </NotificationContext.Provider>
  );
}