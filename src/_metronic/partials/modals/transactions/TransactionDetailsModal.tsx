import React, {FC} from 'react';
import {KTSVG} from "@_metronic/helpers";
import {TransactionStatus} from "@/app/models/model";
import moment from "moment/moment";

type Props = {
  isShow: boolean;
  setIsShow: (isShow: boolean) => void;
  badgeColor: string;
  status: TransactionStatus;
  transactionType: string;
  description: string;
  date: string;
  budget: string;
  type: string;
  senderCreditCard: string;
  receiverCreditCard: string;
}
const TransactionDetailsModal: FC<Props> = ({
                                              isShow, setIsShow, badgeColor, status,
                                              transactionType, description,
                                              date, budget, type,
                                              receiverCreditCard, senderCreditCard
                                            }) => {

  if (!isShow) return null;

  const color: string = status === 'COMPLETED' ? 'success' : status === 'CHECKING' ? 'warning' : 'danger';

  return (
      <>
        <div
            className='modal fade show d-block'
            id='kt_modal_add_user'
            role='dialog'
            tabIndex={-1}
            aria-modal='true'
        >
          {/* begin::Modal dialog */}
          <div className='modal-dialog modal-dialog-centered mw-650px'>
            {/* begin::Modal content */}
            <div className='modal-content'>
              {/* begin::Modal body */}
              <div className={'card card card-xl-stretch mb-xl-8'}>
                {/* begin::Body */}
                <div className='card-body p-0'>
                  {/* begin::Header */}
                  <div className={`px-9 pt-7 card-rounded h-275px w-100 bg-${color}`}>
                    {/* begin::Heading */}
                    <div className='d-flex flex-stack'>
                      <h3 className='m-0 text-white fw-bold fs-3'>Transaction Summary</h3>
                      <div className='ms-1'>
                        {/* begin::Menu */}
                        <div
                            className='btn btn-icon btn-sm btn-active-icon-primary'
                            data-kt-users-modal-action='close'
                            onClick={() => setIsShow(false)}
                            style={{cursor: 'pointer'}}
                        >
                          <KTSVG path='/media/icons/duotune/arrows/arr061.svg'
                                 className='svg-icon-1'/>
                        </div>
                        {/* end::Menu */}
                      </div>
                    </div>
                    {/* end::Heading */}
                    {/* begin::Balance */}
                    <div className='d-flex text-center flex-column text-white pt-8'>
                      <span className='fw-semibold fs-7'>Total Amount</span>
                      <span className='fw-bold fs-2x pt-1'>{budget}</span>
                    </div>
                    {/* end::Balance */}
                  </div>
                  {/* end::Header */}
                  {/* begin::Items */}
                  <div
                      className='shadow-xs card-rounded mx-9 mb-9 px-6 py-9 position-relative z-index-1 bg-body'
                      style={{marginTop: '-100px'}}
                  >
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/maps/map004.svg' className='svg-icon-1'/>
              </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Sender Credit Card
                          </a>
                          <div className='text-gray-400 fw-semibold fs-7'>{senderCreditCard}</div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-1'/>
              </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Receiver Credit Card
                          </a>
                          <div className='text-gray-400 fw-semibold fs-7'>{receiverCreditCard}</div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}
                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/electronics/elc005.svg' className='svg-icon-1'/>
              </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Transaction Type
                          </a>
                          <div
                              className='text-gray-400 fw-semibold fs-7'>{type}  {transactionType}</div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
              <span className='symbol-label bg-lighten'>
                <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-1'/>
              </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Status
                          </a>
                          <div className='card-toolbar'>
                            <span className={`badge badge-light-${badgeColor} fw-bolder me-auto px-4 py-3`}>
                              {status}
                            </span>
                          </div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}
                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center mb-6'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
                        <span className='symbol-label bg-lighten'>
                          <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-1'/>
                        </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Transaction Remarks
                          </a>
                          <div className='text-gray-400 fw-semibold fs-7'>{description}</div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}

                    </div>
                    {/* end::Item */}
                    {/* begin::Item */}
                    <div className='d-flex align-items-center'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
                        <span className='symbol-label bg-lighten'>
                          <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-1'/>
                        </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            Created At
                          </a>
                          <div className='fw-bold text-gray-400'>
                            {moment(date).local().format('ll')}  {moment(date).local().format('h:mm:ss A')}
                          </div>
                        </div>
                        {/* end::Title */}
                      </div>
                      {/* end::Description */}

                    </div>
                    {/* end::Item */}


                  </div>
                  {/* end::Items */}
                </div>
                {/* end::Body */}
              </div>
              {/* end::Modal body */}
            </div>
            {/* end::Modal content */}
          </div>
          {/* end::Modal dialog */}
        </div>
        {/* begin::Modal Backdrop */}
        <div className='modal-backdrop fade show'></div>
        {/* end::Modal Backdrop */}
      </>
  );
};

export default TransactionDetailsModal;