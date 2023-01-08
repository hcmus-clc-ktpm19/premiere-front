import { Column } from 'react-table';
import { UserInfoCell } from './UserInfoCell';
import { UserTwoStepsCell } from './UserTwoStepsCell';
import { UserActionsCell } from './UserActionsCell';
import { UserSelectionCell } from './UserSelectionCell';
import { UserCustomHeader } from './UserCustomHeader';
import { UserSelectionHeader } from './UserSelectionHeader';
import { FullInfoUserDto } from '@/app/models/model';
import { UserRoleCell } from '@/app/modules/apps/user-management/users-list/table/columns/UserRoleCell';
import { UserGenderCell } from '@/app/modules/apps/user-management/users-list/table/columns/UserGenderCell';

const usersColumns: ReadonlyArray<Column<FullInfoUserDto>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Username' className='min-w-100px' />
    ),
    accessor: 'username',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Phone Number' className='min-w-125px' />
    ),
    accessor: 'phone',
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />,
    id: 'role',
    Cell: ({ ...props }) => <UserRoleCell role={props.data[props.row.index].role} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Gender' className='min-w-100px' />
    ),
    id: 'gender',
    Cell: ({ ...props }) => <UserGenderCell gender={props.data[props.row.index].gender} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Account Status' className='min-w-100px' />
    ),
    id: 'enabled',
    Cell: ({ ...props }) => <UserTwoStepsCell two_steps={props.data[props.row.index].enabled} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Card Status' className='min-w-100px' />
    ),
    id: 'cardEnabled',
    Cell: ({ ...props }) => (
      <UserTwoStepsCell two_steps={props.data[props.row.index].cardEnabled} />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessor: 'createdAt',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => (
      <UserActionsCell
        id={props.data[props.row.index].id}
        cardStatus={props.data[props.row.index].cardEnabled}
      />
    ),
  },
];

export { usersColumns };
