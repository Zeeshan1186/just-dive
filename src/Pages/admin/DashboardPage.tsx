import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getDashboard } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import { BookmarkX, Check, HandCoins, Loader2, Users } from 'lucide-react'
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalBooking, setTotalBooking] = useState<number | undefined>(undefined);
    const [cancelBooking, setCancelBooking] = useState<number | undefined>(undefined);
    const [confirmBooking, setConfirmBooking] = useState<number | undefined>(undefined);
    const [totalRevenue, setTotalRevenue] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);

    const dashboard = async (mode?: string, startDate?: string, endDate?: string) => {
        setIsLoading(true);
        try {
            const res = await getDashboard(mode, startDate, endDate);
            if (res.data.status === HttpStatusCode.Ok) {
                const data = res.data.data;
                setTotalBooking(data.total_booking);
                setCancelBooking(data.cancel_booking);
                setConfirmBooking(data.confirm_package);
                setTotalRevenue(data.total_revenue);
            }
        } catch (error) {
            console.log('error occur in dashboard api: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    const summaryData = [
        {
            text: "Total Bookings",
            count: totalBooking,
            icon: Users,
            bgColor: '#FFE2E5',
            iconBg: '#B576FE',
            iconColor: '#FFFFFF'
        },
        {
            text: "Confirm Bookings",
            count: confirmBooking,
            icon: Check,
            bgColor: '#FFF4DE',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2'
        },
        {
            text: "Total Revenue",
            count: totalRevenue,
            icon: HandCoins,
            bgColor: '#DCFCE7',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2'
        },
        {
            text: "Canceled Bookings",
            count: cancelBooking,
            icon: BookmarkX,
            bgColor: '#F3E8FF',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2'
        }
    ]

    const search = async (data: any) => {
        if (!data.data) {
            setStartDate(data.range.from);
            setEndDate(data.range.to);
        }
        const formatDateForAPI = (date: Date) =>
            date.toISOString().split('T')[0];
        await dashboard(data.data, formatDateForAPI(data.range.from), formatDateForAPI(data.range.to));

    }

    useEffect(() => {
        dashboard("", "", "");
    }, []);

    return (
        <div className='px-2'>
            <div className='px-4 mt-3 font-semibold text-lg flex justify-between'>
                <div>Admin Dashboard</div>
                <div className='flex gap-2'>
                    <DateRangePicker
                        onUpdate={(values) => search(values)}
                        initialDateFrom={startDate}
                        initialDateTo={endDate}
                        align="start"
                        locale="en-GB"
                        showCompare={false}
                        btnStyle={`border-black`}
                    />
                </div>
            </div>
            <div className="my-3 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-1">
                {summaryData.map((item, index) => (
                    <div
                        key={index}
                        className="h-32 border border-gray-200 shadow-lg rounded-lg p-4 flex items-center justify-between"
                        style={{ backgroundColor: item.bgColor }}
                    >
                        {/* Left Side */}
                        <div>
                            <div className="text-2xl font-bold">{isLoading ? <Loader2 className='animate-spin' /> : item.count?.toLocaleString()}</div>
                            <p className="pt-1 text-sm text-gray-700">{item.text}</p>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-center justify-center relative w-12">
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                <item.icon className="h-6 w-6"
                                    style={{ color: item.iconColor }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
