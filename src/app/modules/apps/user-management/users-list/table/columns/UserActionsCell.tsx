/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC, useEffect} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {MenuComponent} from '@_metronic/assets/ts/components';
import {ID, KTSVG, QUERIES} from '@_metronic/helpers';
import {useListView} from '../../core/ListViewProvider';
import {useQueryResponse} from '../../core/QueryResponseProvider';
import {disableCustomerCreditCard} from '../../core/_requests';
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import useNotification from "@/app/modules/notifications/useNotification";
import {useNavigate} from "react-router-dom";

type Props = {
  id: ID;
};

const UserActionsCell: FC<Props> = ({id}) => {
  const {setItemIdForUpdate} = useListView();
  const {query} = useQueryResponse();
  const queryClient = useQueryClient();
  const {setNotification} = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const onTransactionBtnHandler = () => {
    navigate(`/apps/user-management/users/transactions?userId=${id}`);
  }

  const deleteItem = useMutation(() => {
    console.log('disable', id);
    const userId = id as number;
    profileService.getCreditCardByUserId(userId).then((res) => {
      console.log('res', res);
      return disableCustomerCreditCard(res.cardNumber);
    });
    return Promise.resolve();
  }, {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
      setNotification(true, 'Disable user credit card successfully.', 'success', () => {});
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
          <a className='menu-link px-3' onClick={onTransactionBtnHandler}>
            Transactions
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            Edit
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={async () => await deleteItem.mutateAsync()}
          >
            Disable Card
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  );
};

export {UserActionsCell};
