/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { toAbsoluteUrl } from '../../../helpers';
import { Link } from 'react-router-dom';

type Props = {
  className: string;
  image: string;
  title: string;
  time: string;
  description: string;
  destination?: string;
};

const StatisticsWidget1: React.FC<Props> = ({
  className,
  image,
  title,
  time,
  description,
  destination = '#',
}) => {
  return (
    <div
      className={`card bgi-no-repeat ${className}`}
      style={{
        backgroundPosition: 'right top',
        backgroundSize: '30% auto',
        backgroundImage: `url(${toAbsoluteUrl('/media/svg/shapes/' + image)})`,
      }}
    >
      {/* begin::Body */}
      <div className='card-body'>
        <Link to={destination} className='card-title fw-bold text-muted text-hover-primary fs-4'>
          {title}
        </Link>

        <div className='fw-bold text-primary my-6'>{time}</div>

        <p
          className='text-dark-75 fw-semibold fs-5 m-0'
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      </div>
      {/* end::Body */}
    </div>
  );
};

export { StatisticsWidget1 };
