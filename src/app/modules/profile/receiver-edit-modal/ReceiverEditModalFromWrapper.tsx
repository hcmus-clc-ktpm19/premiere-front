import { ReceiverEditModalForm } from './ReceiverEditModalForm';
import { ProfileService as profileService } from '@/app/modules/profile/core/_requests';
import { isNotEmpty, QUERIES } from '@_metronic/helpers';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import { ReceiverModalContext } from '@/app/modules/profile/components/Receivers';
import { useAuth } from '@/app/modules/auth';

const ReceiverEditModalFormWrapper = () => {
  const { receiverToUpdate, setReceiverToUpdate } = useContext(ReceiverModalContext);
  const enabledQuery: boolean = isNotEmpty(receiverToUpdate);
  const { currentUser } = useAuth();
  const {
    isLoading,
    data: receiver,
    error,
  } = useQuery(
    `${QUERIES.RECEIVERS_LIST}-receiver-${receiverToUpdate}`,
    () => {
      return profileService.getReceiverByCreditCardNumber(
        currentUser?.id,
        receiverToUpdate?.cardNumber
      );
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setReceiverToUpdate(undefined);
        console.error(err);
      },
    }
  );
  if (!receiverToUpdate) {
    return (
      <ReceiverEditModalForm
        isReceiverLoading={isLoading}
        receiver={{
          id: null,
          cardNumber: '',
          nickname: '',
          bankName: '',
          userId: 0,
          fullName: '',
        }}
      />
    );
  }

  if (!isLoading && !error && receiver) {
    return <ReceiverEditModalForm isReceiverLoading={isLoading} receiver={receiver} />;
  }

  return null;
};

export { ReceiverEditModalFormWrapper };
