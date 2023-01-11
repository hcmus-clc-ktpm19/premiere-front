import { useMemo } from 'react';
import { ColumnInstance, Row, useTable } from 'react-table';
import { CustomHeaderColumn } from '../table/columns/CustomHeaderColumn';
import { CustomRow } from '../table/columns/CustomRow';
import { useQueryResponseData, useQueryResponseLoading } from '../core/QueryResponseProvider';
import { usersColumns } from './columns/_columns';
import { KTCardBody } from '@_metronic/helpers';
import { FullInfoUserDto } from '@/app/models/model';
import { EmployeesListLoading } from '@/app/modules/apps/admin-management/employees-list/components/loading/EmployeesListLoading';
import { EmployeesListPagination } from '@/app/modules/apps/admin-management/employees-list/components/pagination/EmployeesListPagination';

const EmployeesTable = () => {
  const users = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const data = useMemo(() => users, [users]);
  console.log('data', { data });
  const columns = useMemo(() => usersColumns, []);
  const { getTableProps, getTableBodyProps, headers, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <KTCardBody className='py-4'>
      <div className='table-responsive'>
        <table
          id='kt_table_users'
          className='table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer'
          {...getTableProps()}>
          <thead>
            <tr className='text-start text-muted fw-bolder fs-7 text-uppercase gs-0'>
              {headers.map((column: ColumnInstance<FullInfoUserDto>) => (
                <CustomHeaderColumn key={column.id} column={column} />
              ))}
            </tr>
          </thead>
          <tbody className='text-gray-600 fw-bold' {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: Row<FullInfoUserDto>, i) => {
                prepareRow(row);
                return <CustomRow row={row} key={`row-${i}-${row.id}`} />;
              })
            ) : (
              <tr>
                <td colSpan={10} className='text-center'>
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EmployeesListPagination />
      {isLoading && <EmployeesListLoading />}
    </KTCardBody>
  );
};

export { EmployeesTable };
