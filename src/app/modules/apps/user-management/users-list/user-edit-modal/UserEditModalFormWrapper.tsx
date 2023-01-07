import {useQuery} from 'react-query';
import {UserEditModalForm} from './UserEditModalForm';
import {isNotEmpty, QUERIES} from '@_metronic/helpers';
import {useListView} from '../core/ListViewProvider';
import {getCustomerById} from '../core/_requests';

const UserEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.USERS_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getCustomerById(itemIdForUpdate);
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined);
        console.error(err);
      },
    }
  );

  if (!itemIdForUpdate) {
    return (
      <UserEditModalForm
        isUserLoading={isLoading}
        user={{
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          phone: '',
          gender: '',
          panNumber: '',
          address: '',
          password: '',
          role: '',
          enabled: true,
          version: 0,
        }}
      />
    );
  }

  if (!isLoading && !error && user) {
    return <UserEditModalForm isUserLoading={isLoading} user={user} />;
  }

  return null;
};

export {UserEditModalFormWrapper};
