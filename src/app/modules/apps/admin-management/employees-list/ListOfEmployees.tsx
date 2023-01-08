import React from 'react';
import {KTCard} from "@_metronic/helpers";
import {
  EmployeesListHeader
} from "@/app/modules/apps/admin-management/employees-list/components/header/EmployeesListHeader";
import {
  EmployeesTable
} from "@/app/modules/apps/admin-management/employees-list/table/EmployeesTable";
import {
  EmployeeEditModal
} from "@/app/modules/apps/admin-management/employees-list/employee-edit-modal/EmployeeEditModal";
import {
  ListViewProvider,
  useListView
} from "@/app/modules/apps/admin-management/employees-list/core/ListViewProvider";
import {
  QueryRequestProvider
} from "@/app/modules/apps/admin-management/employees-list/core/QueryRequestProvider";
import {
  QueryResponseProvider
} from "@/app/modules/apps/admin-management/employees-list/core/QueryResponseProvider";

const ListOfEmployees = () => {
  const {itemIdForUpdate} = useListView();
  return (
      <>
        <KTCard>
          <EmployeesListHeader />
          <EmployeesTable />
        </KTCard>
        {itemIdForUpdate !== undefined && <EmployeeEditModal />}
      </>
  );
};

const EmployeesListWrapper = () => (
    <QueryRequestProvider>
      <QueryResponseProvider>
        <ListViewProvider>
          <ListOfEmployees />
        </ListViewProvider>
      </QueryResponseProvider>
    </QueryRequestProvider>
);

export {EmployeesListWrapper};