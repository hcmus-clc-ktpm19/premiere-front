import {FC} from "react";

type Props = {
  role?: string;
};

const EmployeeRoleCell: FC<Props> = ({role}) => (
    <div className='badge badge-light fw-bolder'>{role}</div>
);

export {EmployeeRoleCell};
