/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub';
import { SidebarMenuItem } from './SidebarMenuItem';
import { useAuth } from '@/app/modules/auth';
import { AlertColor } from '@mui/material';
import useNotification from '@/app/modules/notifications/useNotification';
import { useSubscription } from 'react-stomp-hooks';
import { PremiereRole, WebSocketAction } from '@/app/models/model';

const SidebarMenuMain = () => {
  const intl = useIntl();
  const {currentUser} = useAuth();

  // listen and handle notification, we need to put it here because we need to listen to the topic in the whole application
  const type: AlertColor = 'info';
  const [lastMessage, setLastMessage] = React.useState<string>('No message received yet');
  const { setNotification } = useNotification();
  useSubscription('/topic/messages', (message) => setLastMessage(message.body));

  const onClose = () => {
    setLastMessage("No message received yet"); // reset the message to receive the next one
  }

  useEffect(() => {
    setLastMessage(lastMessage);
    if (lastMessage !== "No message received yet") {
      const messageToParse = JSON.parse(lastMessage);
      // check if we have a message and if it's for the current user
      if (currentUser?.id === messageToParse.receiverId) {
        setNotification(true, messageToParse.message, type, onClose, messageToParse.destination);
      }
      if (messageToParse.action === WebSocketAction.DEPOSIT_MONEY) {
        setNotification(true, messageToParse.message, type, onClose);
      }
    }
  }, [lastMessage]);

  return (
    <>
      <SidebarMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />
      <SidebarMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Layout Builder'
        fontIcon='bi-layers'
      />
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>

      <SidebarMenuItemWithSub
        to='/loan-management'
        title='Loan Management'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/abstract/abs027.svg'>
        <SidebarMenuItem
          to='/loan-management/create-loan-reminder'
          title='Create Loan Reminder'
          hasBullet={true}
        />
        <SidebarMenuItem
          to='/loan-management/list-of-loan-reminders'
          title='List of Loan Reminders'
          hasBullet={true}
        />
      </SidebarMenuItemWithSub>

      <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'>
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/profile/spend_account'
            title='Spend Account'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItemWithSub
            to='/crafted/pages/profile/transactions'
            title='Transactions'
            hasBullet={true}>
            <SidebarMenuItem
              to='/crafted/pages/profile/transactions'
              title='Transactions History'
              hasBullet={true}
            />
            <SidebarMenuItem
              to='/crafted/pages/profile/create-transaction'
              title='Create Transaction'
              hasBullet={true}
            />
          </SidebarMenuItemWithSub>
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/receivers'
            title='Receivers'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'>
        <SidebarMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <SidebarMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub>
      <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'>
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub>
      {(currentUser?.role === PremiereRole.PREMIERE_ADMIN ||
        currentUser?.role === PremiereRole.EMPLOYEE) && (
        <>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Employee</span>
            </div>
          </div>
          <SidebarMenuItem
            to='/apps/user-management/users'
            icon='/media/icons/duotune/general/gen051.svg'
            title='User Management'
            fontIcon='bi-layers'
          />
          <SidebarMenuItem
            to='/apps/deposit-management/deposit-money'
            icon='/media/icons/duotune/finance/fin010.svg'
            title='Deposit Money'
            fontIcon='bi-layers'
          />
        </>
      )}

      {currentUser?.role === PremiereRole.PREMIERE_ADMIN && (
          <>
            <div className='menu-item'>
              <div className='menu-content pt-8 pb-2'>
                <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Admin</span>
              </div>
            </div>
            <SidebarMenuItemWithSub
                to='/apps/admin-management/employee-management'
                title='Employee Management'
                fontIcon='bi-archive'
                icon='/media/icons/duotune/communication/com014.svg'>
              <SidebarMenuItem to='/apps/admin-management/employees' title='List of Employees' hasBullet={true} />
              <SidebarMenuItem to='/apps/admin-management/create-employee' title='Create Employee' hasBullet={true} />
            </SidebarMenuItemWithSub>
          </>
      )}
    </>
  );
};

export {SidebarMenuMain};
