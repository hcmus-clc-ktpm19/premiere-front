// @ts-nocheck
import {FC} from 'react';
import {ColumnInstance} from 'react-table';
import {FullInfoUserDto} from "@/app/models/model";

type Props = {
  column: ColumnInstance<FullInfoUserDto>;
};

const CustomHeaderColumn: FC<Props> = ({column}) => (
    <>
      {column.Header && typeof column.Header === 'string' ? (
          <th {...column.getHeaderProps()}>{column.render('Header')}</th>
      ) : (
          column.render('Header')
      )}
    </>
);

export {CustomHeaderColumn};
