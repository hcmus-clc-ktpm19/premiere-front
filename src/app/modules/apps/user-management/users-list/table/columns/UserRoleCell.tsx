import {FC} from "react";

type Props = {
  role?: string;
};

const UserRoleCell: FC<Props> = ({role}) => (
    <div className='badge badge-light fw-bolder'>{role}</div>
);

export {UserRoleCell};
