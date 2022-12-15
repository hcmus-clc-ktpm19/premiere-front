import {ReceiverEditModalForm} from './ReceiverEditModalForm';
import {ReceiverDto} from "@/app/modules/profile/core/_dtos";
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import {isNotEmpty, QUERIES} from "@_metronic/helpers";
import {useQuery} from "react-query";
import {useState} from "react";

const ReceiverEditModalFormWrapper = () => {
  const [receiverToUpdate, setReceiverToUpdate] = useState<ReceiverDto>();
  const enabledQuery: boolean = isNotEmpty(receiverToUpdate);
  const {
    isLoading,
    data: receiver,
    error,
  } = useQuery(
      `${QUERIES.RECEIVERS_LIST}-receiver-${receiverToUpdate}`,
      () => {
        return profileService.getReceiverByCreditCardNumber(receiverToUpdate?.cardNumber);
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
    return <ReceiverEditModalForm isReceiverLoading={isLoading} receiver={{
      id: null,
      cardNumber: "",
      nickname: "",
      bankName: "",
      userId: 0,
      fullName: "",
    }} />;
  }

  if (!isLoading && !error && receiver) {
    return <ReceiverEditModalForm isReceiverLoading={isLoading} receiver={receiver} />;
  }

  return null;
}

export {ReceiverEditModalFormWrapper};
