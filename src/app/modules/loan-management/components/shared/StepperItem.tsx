import React from 'react';

interface Props {
  current?: boolean;
  stepperNumber: number;
  stepperTitle: string;
  stepperDescription: string;
}

const StepperItem: React.FC<Props> = (props: Props) => {
  const {current, stepperNumber, stepperTitle, stepperDescription} = props;

  return (
    <div className={`stepper-item ${current && 'current'}`} data-kt-stepper-element='nav'>
      {/* begin::Wrapper*/}
      <div className='stepper-wrapper'>
        {/* begin::Icon*/}
        <div className='stepper-icon w-40px h-40px'>
          <i className='stepper-check fas fa-check'></i>
          <span className='stepper-number'>{stepperNumber}</span>
        </div>
        {/* end::Icon*/}

        {/* begin::Label*/}
        <div className='stepper-label'>
          <h3 className='stepper-title'>{stepperTitle}</h3>

          <div className='stepper-desc fw-semibold'>{stepperDescription}</div>
        </div>
        {/* end::Label*/}
      </div>
      {/* end::Wrapper*/}
    </div>
  );
};

export default StepperItem;
