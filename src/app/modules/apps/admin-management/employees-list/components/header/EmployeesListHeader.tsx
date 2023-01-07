import {useListView} from '../../core/ListViewProvider';
import React from "react";
import {
  EmployeesListSearchComponent
} from "@/app/modules/apps/admin-management/employees-list/components/header/EmployeesListSearchComponent";
import {
  EmployeesListGrouping
} from "@/app/modules/apps/admin-management/employees-list/components/header/EmployeesListGrouping";
import {
  EmployeesListToolbar
} from "@/app/modules/apps/admin-management/employees-list/components/header/EmployeeListToolbar";

const EmployeesListHeader = () => {
  const {selected} = useListView();
  return (
      <div className='card-header border-0 pt-6'>
        <EmployeesListSearchComponent />
        {/* begin::Card toolbar */}
        <div className='card-toolbar'>
          {/* begin::Group actions */}
          {selected.length > 0 ? <EmployeesListGrouping /> : <EmployeesListToolbar />}
          {/* end::Group actions */}
        </div>
        {/* end::Card toolbar */}
      </div>
  );
};

export {EmployeesListHeader};
