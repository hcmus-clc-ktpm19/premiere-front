import React from 'react';
import {Toast} from "@_metronic/partials/toasts/Toast";
import useNotification from "../notifications/useNotification";


const Notification = (): JSX.Element => {
  const {isShow, content, type, onClose} = useNotification();
  console.log("notification", isShow, content, type, onClose);
  if (!isShow) {
    return <></>;
  }
  return (
      <>
        <Toast isShow={isShow} content={content} type={type} onClose={onClose}/>
      </>
  )
};

export default Notification;