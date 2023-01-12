import React, {FC, useEffect, useState} from 'react';
import { toAbsoluteUrl } from '@_metronic/helpers';
import { TransactionStatus } from '@/app/models/model';
import moment from 'moment';
import TransactionDetailsModal from '@_metronic/partials/modals/transactions/TransactionDetailsModal';
import { NavLink } from 'react-bootstrap';
import {useThemeMode} from "@_metronic/partials";

interface Props {
  badgeColor: string;
  status: TransactionStatus;
  transactionType: string;
  description: string;
  date: string;
  budget: string;
  type: string;
  senderCreditCard: string;
  receiverCreditCard: string;
  senderBankId: number;
  receiverBankId: number;
}

const Card6: FC<Props> = ({
  badgeColor,
  status,
  transactionType,
  description,
  date,
  budget,
  type,
  receiverCreditCard,
  senderCreditCard,
  senderBankId,
  receiverBankId
}) => {
  const [isShow, setIsShow] = React.useState<boolean>(false);
  const {mode} = useThemeMode();
  const [style, setStyle] = useState({});
  useEffect(() => {
    mode === 'dark' ? setStyle({
      filter: 'invert(100%)'
    }) : setStyle('');
  }, [mode]);
  const onCardClick = () => {
    console.log('clicked');
    setIsShow(true);
  };

  return (
    <>
      <NavLink onClick={onCardClick} className='card border border-2 border-gray-300 border-hover'>
        <div className='card-header border-0 pt-9'>
          <div className='card-title m-0'>
            <div className='symbol symbol-50px w-50px bg-light'>
              {
                senderBankId === 1 ? (
                    <img src={toAbsoluteUrl('/media/logos/custom-2.svg')} alt='card2' className='p-3' />
                ) : (
                    <img src={toAbsoluteUrl('/media/logos/tai-xiu.svg')} alt='card2' className='p-3' />
                )
              }
            </div>
            <div className='w-50px' style={{...style}}>
              <img src={toAbsoluteUrl('/media/icons/duotune/arrows/arr024.svg')} alt='arrow' className='p-3' />
            </div>
            <div className='symbol symbol-50px w-50px bg-light'>
              {
                receiverBankId === 1 ? (
                    <img src={toAbsoluteUrl('/media/logos/custom-2.svg')} alt='card2' className='p-3' />
                ) : (
                    <img src={toAbsoluteUrl('/media/logos/tai-xiu.svg')} alt='card2' className='p-3' />
                )
              }
            </div>
          </div>

          <div className='card-toolbar'>
            <span className={`badge badge-light-${badgeColor} fw-bolder me-auto px-4 py-3`}>
              {status}
            </span>
          </div>
        </div>

        <div className='card-body p-9'>
          <div className='fs-3 fw-bolder text-dark'>
            {type}  {transactionType}
          </div>
          <p className='text-gray-400 fw-bold fs-5 mt-1 mb-7'>{description}</p>

          <div className='d-flex flex-wrap justify-content-between mb-5'>
            <div
              className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-7 mb-3'
              style={{ flex: '1' }}>
              <div className='fs-6 text-gray-800 fw-bolder'>Created At</div>
              <div className='fw-bold text-gray-400'>
                {moment(date).local().format('h:mm:ss A')}
                <br />
                {moment(date).local().format('ll')}
              </div>
            </div>

            <div
              className='border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 mb-3'
              style={{ flex: '1' }}>
              <div className='fs-6 text-gray-800 fw-bolder'>Total Amount</div>
              <div className='fw-bold text-gray-400'>{budget}</div>
            </div>
          </div>
        </div>
      </NavLink>
      <TransactionDetailsModal
        isShow={isShow}
        setIsShow={setIsShow}
        badgeColor={badgeColor}
        status={status}
        transactionType={transactionType}
        description={description}
        date={date}
        budget={budget}
        type={type}
        receiverCreditCard={receiverCreditCard}
        senderCreditCard={senderCreditCard}
        senderBankId={senderBankId}
        receiverBankId={receiverBankId}
      />
    </>
  );
};

export { Card6 };
