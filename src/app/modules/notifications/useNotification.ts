import { useContext } from 'react';
import { NotificationContext } from '@/app/modules/notifications/NotificationContext';

const useNotification = () => useContext(NotificationContext);

export default useNotification;
