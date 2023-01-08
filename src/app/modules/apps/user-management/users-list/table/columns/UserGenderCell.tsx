import {FC} from "react";
import {Gender} from "@/app/models/model";

type Props = {
  gender?: Gender;
};

const UserGenderCell: FC<Props> = ({gender}) => (
    <>
      {
        gender === 'MALE' ? (
            <div className='badge badge-info fw-bolder'>{gender}</div>
        ) : gender === 'FEMALE' ? (
            <div className='badge badge-primary fw-bolder'>{gender}</div>
        ) : (
            <div className='badge badge-light-warning fw-bolder'>{
              gender}
            </div>
        )
      }
    </>
);

export {UserGenderCell};
