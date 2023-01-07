/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {MenuComponent} from '@_metronic/assets/ts/components';
import {ID, KTSVG, QUERIES} from '@_metronic/helpers';
import {useListView} from '../../core/ListViewProvider';
import {useQueryResponse} from '../../core/QueryResponseProvider';
import {disableEmployeeAccount} from '../../core/_requests';
import useNotification from "@/app/modules/notifications/useNotification";
import {EmployeeStatusDto} from "@/app/models/model";

type Props = {
  id: ID;
  username: string;
  enabled: boolean;
};

const EmployeeActionsCell: FC<Props> = ({id, username, enabled}) => {
  const {setItemIdForUpdate} = useListView();
  const {query} = useQueryResponse();
  const queryClient = useQueryClient();
  const {setNotification} = useNotification();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const deleteItem = useMutation(() => {
    console.log('disable', id);
    const employeeStatus: EmployeeStatusDto = {
      username: username,
      enabled: !enabled
    }
    return disableEmployeeAccount(employeeStatus);
  }, {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.EMPLOYEES_LIST}-${query}`]);
      setNotification(true, 'Disable employee account successfully.', 'success', () => {});
    },
  });

  return (
      <>
        <a
            href='#'
            className='btn btn-light btn-active-light-primary btn-sm'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
        >
          Actions
          <KTSVG path='/media/icons/duotune/arrows/arr072.svg' className='svg-icon-5 m-0' />
        </a>
        {/* begin::Menu */}
        <div
            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
            data-kt-menu='true'
        >
          {/* begin::Menu item */}
          <div className='menu-item px-3'>
            <a className='menu-link px-3' onClick={openEditModal}>
              Edit
            </a>
          </div>
          {/* end::Menu item */}

          {/* begin::Menu item */}
          <div className='menu-item px-3' style={{textAlign: 'left'}}>
            <a
                className='menu-link px-3'
                data-kt-users-table-filter='delete_row'
                onClick={async () => await deleteItem.mutateAsync()}
            >
              Change Account Status
            </a>
          </div>
          {/* end::Menu item */}
        </div>
        {/* end::Menu */}
      </>
  );
};

export {EmployeeActionsCell};
