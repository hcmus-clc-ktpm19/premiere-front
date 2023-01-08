import { useIntl } from 'react-intl';
import { MenuItem } from './MenuItem';
import { MenuInnerWithSub } from './MenuInnerWithSub';
import { MegaMenu } from './MegaMenu';
import { useAuth } from '@/app/modules/auth';
import { PremiereRole } from '@/app/models/model';
import React from 'react';

export function MenuInner() {
  const intl = useIntl();
  const { currentUser } = useAuth();
  return (
    <>
      <MenuItem title={intl.formatMessage({ id: 'MENU.DASHBOARD' })} to='/dashboard' />
      <MenuItem title='Layout Builder' to='/builder' />
      <MenuInnerWithSub
        title='Crafted'
        to='/crafted'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        {/* PAGES */}
        <MenuInnerWithSub
          title='Pages'
          to='/crafted/pages'
          fontIcon='bi-archive'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuInnerWithSub
            title='Profile'
            to='/crafted/pages/profile'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem
              to='/crafted/pages/profile/spend_account'
              title='Spend Account'
              hasBullet={true}
            />
            <MenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
            <MenuInnerWithSub
              to='/crafted/pages/profile/transactions'
              title='Transactions'
              hasBullet={true}
              hasArrow={true}
              menuPlacement='right-start'
              menuTrigger={`{default:'click', lg: 'hover'}`}
            >
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
            <MenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
            <MenuItem to='/crafted/pages/profile/receivers' title='Receivers' hasBullet={true} />
          </MenuInnerWithSub>
          <MenuInnerWithSub
            title='Wizards'
            to='/crafted/pages/wizards'
            hasArrow={true}
            hasBullet={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/crafted/pages/wizards/horizontal' title='Horizontal' hasBullet={true} />
            <MenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
          </MenuInnerWithSub>
        </MenuInnerWithSub>

        {/* ACCOUNT */}
        <MenuInnerWithSub
          title='Accounts'
          to='/crafted/accounts'
          fontIcon='bi-person'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
          <MenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
        </MenuInnerWithSub>

        {/* ERRORS */}
        <MenuInnerWithSub
          title='Errors'
          to='/error'
          fontIcon='bi-sticky'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/error/404' title='Error 404' hasBullet={true} />
          <MenuItem to='/error/500' title='Error 500' hasBullet={true} />
        </MenuInnerWithSub>

        {/* Widgets */}
        <MenuInnerWithSub
          title='Widgets'
          to='/crafted/widgets'
          fontIcon='bi-layers'
          hasArrow={true}
          menuPlacement='right-start'
          menuTrigger={`{default:'click', lg: 'hover'}`}
        >
          <MenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
          <MenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
          <MenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
          <MenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
          <MenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
          <MenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
        </MenuInnerWithSub>
      </MenuInnerWithSub>

      {(currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() ||
        currentUser?.role === PremiereRole.EMPLOYEE.toString()) && (
        <MenuInnerWithSub title='Apps' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>
          {/* PAGES */}
          <MenuInnerWithSub
            title='Chat'
            to='/apps/chat'
            icon='/media/icons/duotune/communication/com012.svg'
            hasArrow={true}
            menuPlacement='right-start'
            menuTrigger={`{default:'click', lg: 'hover'}`}
          >
            <MenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
            <MenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
            <MenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
          </MenuInnerWithSub>
          <MenuItem
            icon='/media/icons/duotune/general/gen051.svg'
            to='/apps/user-management/users'
            title='User management'
          />
        </MenuInnerWithSub>
      )}

      {/*{currentUser?.role === PremiereRole.PREMIERE_ADMIN.toString() && (*/}
      {/*    <MenuInnerWithSub title='Apps4' to='/apps' menuPlacement='bottom-start' menuTrigger='click'>*/}
      {/*      /!* PAGES *!/*/}
      {/*      <MenuInnerWithSub*/}
      {/*          title='Chat'*/}
      {/*          to='/apps/chat'*/}
      {/*          icon='/media/icons/duotune/communication/com012.svg'*/}
      {/*          hasArrow={true}*/}
      {/*          menuPlacement='right-start'*/}
      {/*          menuTrigger={`{default:'click', lg: 'hover'}`}>*/}
      {/*        <MenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />*/}
      {/*        <MenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />*/}
      {/*        <MenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />*/}
      {/*      </MenuInnerWithSub>*/}
      {/*      <MenuItem*/}
      {/*          icon='/media/icons/duotune/general/gen051.svg'*/}
      {/*          to='/apps/admin-management/employees'*/}
      {/*          title='Admin Management'*/}
      {/*      />*/}
      {/*    </MenuInnerWithSub>*/}
      {/*)}*/}

      <MenuInnerWithSub
        isMega={true}
        title='Mega menu'
        to='/mega-menu'
        menuPlacement='bottom-start'
        menuTrigger='click'
      >
        <MegaMenu />
      </MenuInnerWithSub>
    </>
  );
}
