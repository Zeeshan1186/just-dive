import React, { useState } from 'react'
import { Sheet, SheetContent } from '../ui/sheet'
import type { IBooking } from '@/interface/booking';
import { format, parse } from 'date-fns';
import { bookingDateFormat } from '@/utils/date-format';

interface ViewBookingProps {
    sheetOpen: boolean;
    setSheetOpen: (open: boolean) => void;
    booking: IBooking | null;
}

const BookingView: React.FC<ViewBookingProps> = ({ sheetOpen, setSheetOpen, booking }) => {
    const tabs = ['Personal Info', 'Payment Detail'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    const formatProperDate = (rawDate?: string) => {
        if (!rawDate) return '';
        const parsedDate = parse(rawDate, 'd/M/yyyy', new Date());
        const formattedDate = format(parsedDate, 'd MMM yyyy');
        return formattedDate;
    }
    return (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetContent className="w-full p-4 !max-w-full  md:w-[550px] md:!max-w-[550px] overflow-y-auto">
                <div className='mt-4 px-4'>
                    <div className='flex justify-start gap-4'>
                        <img src={booking?.package?.package_image} className='w-28 h-28 rounded-full' />
                        <div className='mt-2'>
                            <p className=' font-semibold'>Booking Id - J8K5G</p>
                            <p className='text-[#000000B2] font-semibold text-lg'>{booking?.package?.name}</p>
                            <div className="mt-2 grid grid-cols-2 gap-x-4 text-sm text-[#000000B2] font-medium">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Slot</span>
                                    <span>{booking?.slot?.time}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500">Date Of Adventure</span>
                                    <span>{bookingDateFormat(booking?.date_of_scuba ?? '')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Header */}
                    <div className="flex space-x-6  border-gray-300 mt-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 text-sm font-medium ${activeTab === tab
                                    ? 'border-b-2 border-black text-black'
                                    : 'text-gray-500'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4 text-sm text-gray-700">
                        {activeTab === 'Personal Info' && (
                            <div className='bg-[#EEEEEE] rounded-xl p-4'>
                                {/* Name */}
                                <div className="grid grid-cols-3 py-1">
                                    <span className="text-left text-gray-700 font-medium">Name</span>
                                    <span className="text-center text-gray-900">{booking?.full_name}</span>
                                    <span /> {/* empty right column */}
                                </div>
                                <hr className="border-white my-1" />

                                {/* Dive Sight */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Dive Sight</span>
                                    <span className='text-center text-gray-900'>{booking?.package?.location?.location_name}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* People */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Group Of People</span>
                                    <span className='text-center text-gray-900'>{booking?.number_of_participants}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* People */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Date Of Booking</span>
                                    <span className='text-center text-gray-900'>{format(new Date(booking?.created_at ?? ''), 'd MMMM yyyy')}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* WhatsApp No */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>WhatsApp No</span>
                                    <span className='text-center text-gray-900'>+91{booking?.whatsapp_no}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* Email */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Email</span>
                                    <span className='text-center text-gray-900'>{booking?.email}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* Age */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Age</span>
                                    <span className='text-center text-gray-900'>{booking?.age}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* Gender */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Gender</span>
                                    <span className='text-center text-gray-900'>{booking?.gender}</span>
                                </div>
                                <hr className="border-white my-1" />

                                {/* Nationality */}
                                <div className='grid grid-cols-3 py-1'>
                                    <span className='text-gray-700 font-medium'>Nationality</span>
                                    <span className='text-center text-gray-900'>{booking?.nationality}</span>
                                </div>

                                {booking?.document &&
                                    <div className='mt-3'>
                                        <div className='mb-1 font-semibold'>Attachemnts</div>
                                        <img src={booking?.document} className='w-40 h-40' />
                                    </div>
                                }
                            </div>
                        )}

                        {activeTab === 'Payment Detail' && <p>Payment Page</p>}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default BookingView;