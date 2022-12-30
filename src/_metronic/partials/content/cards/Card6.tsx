import {FC} from 'react';
import {Link} from 'react-router-dom';
import {toAbsoluteUrl} from '@_metronic/helpers';
import {TransactionStatus} from '@/app/models/model';
import moment from 'moment';

interface Props {
  badgeColor: string;
  status: TransactionStatus;
  transactionType: string;
  description: string;
  date: string;
  budget: string;
}

const Card6: FC<Props> = ({badgeColor, status, transactionType, description, date, budget}) => {
  return (
    <Link
      to='/crafted/pages/profile/overview'
      className='card border border-2 border-gray-300 border-hover'
    >
      <div className='card-header border-0 pt-9'>
        <div className='card-title m-0'>
          <div className='symbol symbol-50px w-50px bg-light'>
            <img src={toAbsoluteUrl('/media/logos/custom-2.svg')} alt='card2' className='p-3' />
          </div>
        </div>

        <div className='card-toolbar'>
          <span className={`badge badge-light-${badgeColor} fw-bolder me-auto px-4 py-3`}>
            {status}
          </span>
        </div>
      </div>

      <div className='card-body p-9'>
        <div className='fs-3 fw-bolder text-dark'>{transactionType}</div>
        <p className='text-gray-400 fw-bold fs-5 mt-1 mb-7'>{description}</p>

        <div className='d-flex flex-wrap justify-content-between mb-5'>
          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3' style={{flex: '1'}}>
            <div className='fs-6 text-gray-800 fw-bolder'>Created At</div>
            <div className='fw-bold text-gray-400'>
              {moment(date).local().format('h:mm:ss A')}
              <br/>
              {moment(date).local().format('ll')}
            </div>
          </div>

          <div className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3' style={{flex: '1'}}>
            <div className='fs-6 text-gray-800 fw-bolder'>Total Amount</div>
            <div className='fw-bold text-gray-400'>
              {budget}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export {Card6};
