import { KTSVG } from '@_metronic/helpers';
import { useListView } from '../../core/ListViewProvider';
import { EmployeesListFilter } from '@/app/modules/apps/admin-management/employees-list/components/header/EmployeesListFilter';

const EmployeesListToolbar = () => {
  const { setItemIdForUpdate } = useListView();
  const openAddUserModal = () => {
    setItemIdForUpdate(null);
  };

  return (
    <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
      <EmployeesListFilter />

      {/* begin::Export */}
      <button type='button' className='btn btn-light-primary me-3'>
        <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
        Export
      </button>
      {/* end::Export */}

      {/* begin::Add user */}
      <button type='button' className='btn btn-primary' onClick={openAddUserModal}>
        <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
        Add Employee
      </button>
      {/* end::Add user */}
    </div>
  );
};

export { EmployeesListToolbar };
