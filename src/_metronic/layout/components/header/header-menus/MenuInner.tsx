import {useIntl} from 'react-intl';
import {MenuItem} from './MenuItem';
import {MenuInnerWithSub} from './MenuInnerWithSub';
import {useAuth} from '@/app/modules/auth';
import {PremiereRole} from '@/app/models/model';
import React from "react";

export function MenuInner() {
  const intl = useIntl();
  const {currentUser} = useAuth();
  return (
    <>
      <MenuItem title={intl.formatMessage({id: 'MENU.DASHBOARD'})} to='/dashboard' />
      {/*<MenuItem title='Layout Builder' to='/builder' />*/}
      <MenuInnerWithSub
        title='Crafted'
        to='/crafted'
        menuPlacement='bottom-start'
        menuTrigger='click'>
        {/* PAGES */}
        <MenuInnerWithSub
          title='Pages'
          to='/crafted/pages'
          fontIcon='bi-archive'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}>
          <MenuInnerWithSub
            title='Profile'
            to='/crafted/pages/profile'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}>
            <MenuItem
              to='/crafted/pages/profile/spend_account'
              title='Spend Account'
              hasBullet={true}
            />
            <MenuInnerWithSub
                to='/crafted/pages/profile/transactions'
                title='Transactions'
                hasBullet={true}
                hasArrow={true}
                menuPlacement='right-start'
                menuTrigger={`{default:'click', lg: 'hover'}`}>
              <MenuItem
                  to='/crafted/pages/profile/transactions'
                  title='Transactions History'
                  hasBullet={true}
              />
              <MenuItem
                  to='/crafted/pages/profile/create-transaction'
                  title='Create Transaction'
                  hasBullet={true}
              />
            </MenuInnerWithSub>
            <MenuItem to='/crafted/pages/profile/receivers' title='Receivers' hasBullet={true} />
          </MenuInnerWithSub>
        </MenuInnerWithSub>

        {/* ACCOUNT */}
        <MenuInnerWithSub
          title='Accounts'
          to='/crafted/accounts'
          fontIcon='bi-person'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}>
          <MenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
          <MenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub>

      {
        currentUser?.role === PremiereRole.EMPLOYEE.toString() && (
        <MenuInnerWithSub title='Apps' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
          {/* PAGES */}
          <MenuItem
            icon='/media/icons/duotune/general/gen051.svg'
            to='/apps/user-management/users'
            title='User management'
          />
          <MenuItem
              icon='/media/icons/duotune/finance/fin010.svg'
              to='/apps/deposit-management/deposit-money'
              title='Deposit Money'
          />
        </MenuInnerWithSub>
      )}

      {currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() && (
          <MenuInnerWithSub title='Apps' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
            {/* PAGES */}
            <MenuItem
                icon='/media/icons/duotune/general/gen051.svg'
                to='/apps/admin-management/employees'
                title='Employee Management'
            />
            <MenuInnerWithSub
                title='Transaction Management'
                to='/apps/admin-management/transactions/'
                fontIcon='bi-person'
                hasArrow={true}
                menuPlacement='right-start'
                menuTrigger={`{default:'click', lg: 'hover'}`}>
              <MenuItem to='/apps/admin-management/transactions/lists' title='Lists' hasBullet={true} />
              <MenuItem to='/apps/admin-management/transactions/statistics' title='Statistics' hasBullet={true} />
            </MenuInnerWithSub>
          </MenuInnerWithSub>
      )}

    </>
  );
}
