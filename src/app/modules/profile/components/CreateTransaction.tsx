import React from 'react';
import {StatisticsWidget1} from "@_metronic/partials/widgets";

const CreateTransaction = () => {
  return (
      <>
        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className='col-xl-6'>
            <StatisticsWidget1
                className='card-xl-stretch mb-xl-8'
                image='abstract-2.svg'
                title='Internal Transfer'
                time='Affordable Fee'
                description='Transfer money easily and quickly to users who have the same bank account as you.'
                destination={'/crafted/pages/profile/create-transaction/internal'}
            />
          </div>

          <div className='col-xl-6'>
            <StatisticsWidget1
                className='card-xl-stretch mb-xl-8'
                image='abstract-4.svg'
                title='External Transfer'
                time='10% Fee'
                description='Quickly and easily transfer money to people who have accounts other than your bank.'
                destination={'/crafted/pages/profile/create-transaction'}
            />
          </div>

        </div>
        {/* end::Row */}
      </>
  );
};

export default CreateTransaction;