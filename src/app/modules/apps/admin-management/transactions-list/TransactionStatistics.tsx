import React, {useEffect, useRef, useState} from 'react';
import {KTSVG} from "@_metronic/helpers";
import {useThemeMode} from "@_metronic/partials";
import {getCSS, getCSSVariableValue} from "@_metronic/assets/ts/_utils";
import ApexCharts, {ApexOptions} from "apexcharts";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs, {Dayjs} from "dayjs";
import {
  TransactionService
} from "@/app/modules/apps/admin-management/transactions-list/core/_requests";
import useNotification from "@/app/modules/notifications/useNotification";
import moment from "moment";

const TransactionStatistics = () => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const {mode} = useThemeMode();
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs().subtract(12, 'months'));
  const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs());
  const [color, setColor] = useState<string[]>(['#f5f8fa', '#151521']);
  const [syncState, setSyncState] = useState<boolean>(false);
  const {setNotification} = useNotification();
  const [amounts, setAmounts] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [bankId, setBankId] = useState<number>(1);

  const formatDay = (date: Dayjs) => {
    return dayjs(date).format('YYYY-MM-DD');
  }

  const createMonths = (fromDate: Dayjs, toDate: Dayjs): string[] => {
    const startDate = moment(formatDay(fromDate));
    const endDate = moment(formatDay(toDate));
    console.log(startDate, endDate);

    const dates = [];
    // endDate.subtract(1, "month"); //Substract one month to exclude endDate itself

    let month = moment(startDate); //clone the startDate
    while( month <= endDate ) {
      console.log(month.format("YYYY-MM"));
      dates.push(month.format('MM/YYYY'));
      month.add(1, "month");
    }

    console.log(dates);
    return dates;
  }

  useEffect(() => {
    TransactionService.getTotalAmountInDateRange(formatDay(fromDate!), formatDay(toDate!), bankId).then((res) => {
      setAmounts(res);
      TransactionService.getTotalAmountOfAllTime().then((res) => {
        setTotalAmount(res);
      }).catch((err) => {
        console.log(err);
      })
    }).catch((err) => {
      console.log(err);
    });
  }, [syncState]);

  useEffect(() => {
    setColor(mode === 'light' ? ['#f5f8fa' ,'#151521'] : ['#151521' ,'#f5f8fa']);
    const chart = refreshChart();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [chartRef, mode, amounts]);


  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }

    const height = parseInt(getCSS(chartRef.current, 'height'));

    const chart = new ApexCharts(chartRef.current, getChartOptions(height, amounts, createMonths(fromDate!, toDate!)));
    if (chart) {
      chart.render();
    }

    return chart;
  };
  const resetData = () => {
    setFromDate(dayjs().subtract(12, 'months'));
    setToDate(dayjs());
    setSyncState(!syncState);
  }

  const validateDateRange = (fromDate: Dayjs, toDate: Dayjs) => {
    if (fromDate.isAfter(dayjs())) { // if fromDate is after today
      return false;
    }
    if (fromDate.isAfter(toDate)) {
      return false;
    }
    if (toDate.subtract(12, 'months').isAfter(fromDate)) {
      return false;
    }
    return true;
  }

  const applyFilter = () => {
    if (!validateDateRange(fromDate!, toDate!)) { // date range is invalid
      setNotification(true, 'Invalid date range.', 'error', () => {
      });
      setFromDate(dayjs().subtract(12, 'months'));
      setToDate(dayjs());
      console.log('Invalid date range.');
    }
    console.log('valid');
    setSyncState(!syncState);
  }

  console.log({amounts});

  return (
      <>
        <div className='row'>
          <div className='col'>
            <div className={'card card-xxl-stretch mb-5 mb-xl-10'}>
              {/* begin::Header */}
              <div className='card-header border-0 pt-5'>
                {/* begin::Title */}
                <h3 className='card-title align-items-start flex-column'>
                  <span className='card-label fw-bold fs-3 mb-1'>
                    Total Transfer Amount: &nbsp;
                    {totalAmount.toLocaleString('it-IT', {
                    style: 'currency',
                    currency: 'VND',
                  })}
                  </span>

                  <span className='text-muted fw-semibold fs-7'>You are viewing statistics from:
                    {
                      fromDate && toDate ? ` ${formatDay(fromDate)} to ${formatDay(toDate)}` : ''
                    }
                  </span>
                  <span className='text-muted fw-semibold fs-7'>Total statistics in this range: &nbsp;
                    <strong>
                      {
                        amounts.reduce((a, b) => a + b, 0).toLocaleString('it-IT', {
                          style: 'currency',
                          currency: 'VND',
                        })
                      }
                    </strong>
                  </span>
                </h3>
                {/* end::Title */}

                {/* begin::Toolbar */}
                <div className='card-toolbar'>
                  {/* begin::Menu */}
                  <button
                      type='button'
                      className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                      data-kt-menu-trigger='click'
                      data-kt-menu-placement='bottom-end'
                      data-kt-menu-flip='top-end'
                  >
                    <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2'/>
                  </button>
                  {/* begin::Dropdown*/}
                  <div className='menu menu-sub menu-sub-dropdown w-250px w-md-300px'
                       data-kt-menu='true'>
                    <div className='px-7 py-5'>
                      <div className='fs-5 text-dark fw-bolder'>Filter Options</div>
                    </div>

                    <div className='separator border-gray-200'></div>



                    <div className='px-7 py-5' data-kt-user-table-filter='form'>
                      <div className='mb-5'>
                        <label className='form-label fs-6 fw-bold'>Bank:</label>
                        <select
                            name='status'
                            data-control='select2'
                            data-hide-search='true'
                            className='form-select form-select-solid fw-bolder'
                            onChange={(e) => setBankId(+e.target.value)}
                            defaultValue='none'>
                          <option value='1'>Premierebank</option>
                          <option value='5'>Taixiubank</option>
                        </select>
                      </div>
                      <div className='mb-10'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                              value={fromDate}
                              onChange={(newValue) => {
                                setFromDate(newValue);
                                // setToDate(newValue!.add(12, 'months'));
                              }}
                              renderInput={(params) => (
                                  <div className='mb-5'>
                                    <label className='form-label fs-6 fw-bold'>From Date:</label>
                                    <TextField {...params}
                                               className='form-select form-select-solid fw-bolder'
                                               sx={{
                                                 svg: {color: color[1]},
                                                 input: {color: color[1]},
                                               }}
                                    />
                                  </div>
                              )}
                          />

                          <DatePicker
                              value={toDate}
                              onChange={(newValue) => {
                                setToDate(newValue);
                              }}
                              renderInput={(params) => (
                                  <div className='mb-10'>
                                    <label className='form-label fs-6 fw-bold'>To Date:</label>
                                    <TextField {...params}
                                               className='form-select form-select-solid fw-bolder'
                                               sx={{
                                                 svg: {color: color[1]},
                                                 input: {color: color[1]},
                                               }}
                                    />
                                  </div>
                              )}
                          />
                        </LocalizationProvider>
                      </div>

                      <div className='d-flex justify-content-end'>
                        <button
                            type='button'
                            className='btn btn-sm btn-light btn-active-light-primary me-2'
                            data-kt-menu-dismiss='true'
                            onClick={resetData}
                        >
                          Reset
                        </button>

                        <button type='button' className='btn btn-sm btn-primary'
                                onClick={applyFilter}
                                data-kt-menu-dismiss='true'>
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* end::Dropdown*/}

                  {/* end::Menu */}
                </div>
                {/* end::Toolbar */}
              </div>
              {/* end::Header */}

              {/* begin::Body */}
              <div className='card-body'>
                {/* begin::Chart */}
                  <div ref = {chartRef} id='kt_charts_widget_1_chart_3' style={{height: '350px'}}/>
                {/* end::Chart */}
              </div>
              {/* end::Body */}
            </div>
          </div>
        </div>
      </>
  );
};

function getChartOptions(height: number, amounts: number[], months: string[]): ApexOptions {
  const labelColor = getCSSVariableValue('--kt-gray-500');
  const borderColor = getCSSVariableValue('--kt-gray-200');
  const baseColor = getCSSVariableValue('--kt-primary');
  const secondaryColor = getCSSVariableValue('--kt-gray-300');

  return {
    series: [
      {
        name: 'Transfer Amount',
        data: amounts,
      },

    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45,
        rotateAlways: true,
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return val.toLocaleString('it-IT', {
            style: 'currency',
            currency: 'VND',
          });
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}


export default TransactionStatistics;