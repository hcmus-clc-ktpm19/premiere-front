import {useEffect, useState} from 'react';
import {MenuComponent} from '@_metronic/assets/ts/components';
import {initialQueryState, KTSVG} from '@_metronic/helpers';
import {useQueryRequest} from '../../core/QueryRequestProvider';
import {useQueryResponse} from '../../core/QueryResponseProvider';
import {Gender} from "@/app/models/model";

const EmployeesListFilter = () => {
  const {updateState} = useQueryRequest();
  const {isLoading} = useQueryResponse();
  const [gender, setGender] = useState<string | undefined>(Gender.MALE);
  const [enabled, setEnabled] = useState<boolean | undefined>(true);

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const resetData = () => {
    updateState({filter: undefined, ...initialQueryState});
  };

  const filterData = () => {
    updateState({
      filter: {gender, enabled},
      ...initialQueryState,
    });
  };

  return (
      <>
        {/* begin::Filter Button */}
        <button
            disabled={isLoading}
            type='button'
            className='btn btn-light-primary me-3'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
        >
          <KTSVG path='/media/icons/duotune/general/gen031.svg' className='svg-icon-2' />
          Filter
        </button>
        {/* end::Filter Button */}
        {/* begin::SubMenu */}
        <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
          {/* begin::Header */}
          <div className='px-7 py-5'>
            <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
          </div>
          {/* end::Header */}

          {/* begin::Separator */}
          <div className='separator border-gray-200'></div>
          {/* end::Separator */}

          {/* begin::Content */}
          <div className='px-7 py-5' data-kt-user-table-filter='form'>
            {/* begin::Input group */}
            <div className='mb-10'>
              <label className='form-label fs-6 fw-bold'>Gender:</label>
              <select
                  className='form-select form-select-solid fw-bolder'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  data-kt-user-table-filter='gender'
                  data-hide-search='true'
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
              >
                <option value='ALL'>ALL</option>
                <option value={Gender.MALE}>Male</option>
                <option value={Gender.FEMALE}>Female</option>
                <option value={Gender.OTHER}>Other</option>
              </select>
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='mb-10'>
              <label className='form-label fs-6 fw-bold'>Account Status:</label>
              <select
                  className='form-select form-select-solid fw-bolder'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  data-kt-user-table-filter='two-step'
                  data-hide-search='true'
                  onChange={(e) => setEnabled(e.target.value === 'true')}
                  value={enabled!.toString()}
              >
                <option value=''></option>
                <option value='true'>Enabled</option>
                <option value='false'>Disabled</option>
              </select>
            </div>
            {/* end::Input group */}

            {/* begin::Actions */}
            <div className='d-flex justify-content-end'>
              <button
                  type='button'
                  disabled={isLoading}
                  onClick={resetData}
                  className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='reset'
              >
                Reset
              </button>
              <button
                  disabled={isLoading}
                  type='button'
                  onClick={filterData}
                  className='btn btn-primary fw-bold px-6'
                  data-kt-menu-dismiss='true'
                  data-kt-user-table-filter='filter'
              >
                Apply
              </button>
            </div>
            {/* end::Actions */}
          </div>
          {/* end::Content */}
        </div>
        {/* end::SubMenu */}
      </>
  );
};

export {EmployeesListFilter};
