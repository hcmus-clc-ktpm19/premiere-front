/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {FC, useEffect} from 'react';
import {useMutation, useQueryClient} from 'react-query';
import {MenuComponent} from '@_metronic/assets/ts/components';
import {ID, KTSVG, QUERIES} from '@_metronic/helpers';
import {useListView} from '../../core/ListViewProvider';
import {useQueryResponse} from '../../core/QueryResponseProvider';
import {disableCustomerCreditCard, enableCustomerCreditCard} from '../../core/_requests';
import {ProfileService as profileService} from "@/app/modules/profile/core/_requests";
import useNotification from "@/app/modules/notifications/useNotification";
import {useNavigate} from "react-router-dom";
import {ConfirmModal} from "@_metronic/partials/modals/confirm/ConfirmModal";

type Props = {
  id: ID;
  cardStatus: boolean;
};

const UserActionsCell: FC<Props> = ({id, cardStatus}) => {
  const {setItemIdForUpdate} = useListView();
  const {query} = useQueryResponse();
  const queryClient = useQueryClient();
  const {setNotification} = useNotification();
  const navigate = useNavigate();
  const [isDisableModalOpen, setIsDisableModalOpen] = React.useState<boolean>(false);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    setItemIdForUpdate(id);
  };

  const onTransactionBtnHandler = () => {
    navigate(`/apps/user-management/users/transactions?userId=${id}`);
  }

  const onDisableBtnHandler = () => {
    setIsDisableModalOpen(true);
  }

  const onConfirmDisable = async (value: any) => {
    await disableUserCreditCard.mutateAsync();
    setIsDisableModalOpen(false);
  }

  const disableUserCreditCard = useMutation(() => {
    console.log('disable', id);
    const userId = id as number;
    profileService.getCreditCardByUserId(userId).then((res) => {
      console.log('res', res);
      if (cardStatus) {
        return disableCustomerCreditCard(res.cardNumber);
      } else {
        return enableCustomerCreditCard(res.cardNumber);
      }
    });
    return Promise.resolve();
  }, {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
      const message = cardStatus ? 'Disable credit card successfully.' : 'Enable credit card successfully.';
      const type = cardStatus ? 'error' : 'success';
      setNotification(true, message, type, () => {
      });
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
          <KTSVG path='/media/icons/duotune/arrows/arr072.svg' className='svg-icon-5 m-0'/>
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
                onClick={onDisableBtnHandler}
            >
              {
                cardStatus ? 'Disable Card' : 'Enable Card'
              }
            </a>
          </div>
          {/* end::Menu item */}
        </div>
        {/* end::Menu */}
        <ConfirmModal
            isShow={isDisableModalOpen}
            header={
              cardStatus ? 'Disable Card' : 'Enable Card'
            }
            content={
              cardStatus ? 'Are you sure you want to disable this card?' : 'Are you sure you want to enable this card?'
            }
            onConfirm={onConfirmDisable}
            onCancel={() => setIsDisableModalOpen(false)}
            value={null}
            isShowCancelBtn={true}
        />
      </>
  );
};

export {UserActionsCell};
