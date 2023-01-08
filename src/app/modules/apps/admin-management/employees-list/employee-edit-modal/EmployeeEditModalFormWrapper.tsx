import {useQuery} from 'react-query';
import {EmployeeEditModalForm} from './EmployeeEditModalForm';
import {isNotEmpty, QUERIES} from '@_metronic/helpers';
import {useListView} from '../core/ListViewProvider';
import {getEmployeeById} from '../core/_requests';
import React from "react";

const EmployeeEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.EMPLOYEES_LIST}-user-${itemIdForUpdate}`,
    () => {
      return getEmployeeById(itemIdForUpdate);
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
      <EmployeeEditModalForm
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
    return <EmployeeEditModalForm isUserLoading={isLoading} user={user} />;
  }

  return null;
};

export {EmployeeEditModalFormWrapper};
