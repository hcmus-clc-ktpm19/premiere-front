import React from 'react';
import { Toast } from '@_metronic/partials/toasts/Toast';
import useNotification from '../notifications/useNotification';

const Notification = (): JSX.Element => {
  const { isShow, content, type, onClose, destination } = useNotification();
  if (!isShow) {
    return <></>;
  }
  return (
    <>
      <Toast
        isShow={isShow}
        content={content}
        type={type}
        onClose={onClose}
        destination={destination}
      />
    </>
  );
};

export default Notification;
