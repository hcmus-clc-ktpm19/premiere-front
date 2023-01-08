// @ts-nocheck
import {Column} from 'react-table';
import {FullInfoUserDto} from "@/app/models/model";
import {
  EmployeeSelectionCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeSelectionCell";
import {
  EmployeeSelectionHeader
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeSelectionHeader";
import React from "react";
import {
  EmployeeCustomHeader
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeCustomHeader";
import {
  EmployeeInfoCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeInfoCell";
import {
  EmployeeActionsCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeActionsCell";
import {
  EmployeeTwoStepsCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeTwoStepsCell";
import {
  EmployeeGenderCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeGenderCell";
import {
  EmployeeRoleCell
} from "@/app/modules/apps/admin-management/employees-list/table/columns/EmployeeRoleCell";

const usersColumns: ReadonlyArray<Column<FullInfoUserDto>> = [
  {
    Header: (props) => <EmployeeSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <EmployeeSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <EmployeeCustomHeader tableProps={props} title='Username' className='min-w-100px' />,
    accessor: 'username',
  },
  {
    Header: (props) => <EmployeeCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    Cell: ({...props}) => <EmployeeInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <EmployeeCustomHeader tableProps={props} title='Phone Number' className='min-w-125px' />,
    accessor: 'phone',
  },
  {
    Header: (props) => (
        <EmployeeCustomHeader tableProps={props} title='Role' className='min-w-125px' />
    ),
    id: 'role',
    Cell: ({...props}) => <EmployeeRoleCell role={props.data[props.row.index].role} />,
  },
  {
    Header: (props) => (
        <EmployeeCustomHeader tableProps={props} title='Gender' className='min-w-100px' />
    ),
    id: 'gender',
    Cell: ({...props}) => <EmployeeGenderCell gender={props.data[props.row.index].gender} />,
  },
  {
    Header: (props) => (
        <EmployeeCustomHeader tableProps={props} title='Account Status' className='min-w-100px' />
    ),
    id: 'enabled',
    Cell: ({...props}) => <EmployeeTwoStepsCell two_steps={props.data[props.row.index].enabled} />,
  },
  {
    Header: (props) => <EmployeeCustomHeader tableProps={props} title='Pan Number' className='min-w-125px' />,
    accessor: 'panNumber',
  },
  {
    Header: (props) => (
        <EmployeeCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
    ),
    accessor: 'createdAt',
  },
  {
    Header: (props) => (
        <EmployeeCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <EmployeeActionsCell
        id={props.data[props.row.index].id }
        username={props.data[props.row.index].username }
        enabled={props.data[props.row.index].enabled }
    />,
  },
];

export {usersColumns};
