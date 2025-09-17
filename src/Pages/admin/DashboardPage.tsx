import BookingChart from '@/components/BookingChart';
import CustomerChart from '@/components/CustomerChart';
import TopPackage from '@/components/TopPackage';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getDashboard } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import { BookmarkX, Check, HandCoins, Loader2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

type CustomerWeekData = {
    local: number;
    international: number;
    online: number;
    offline: number;
};

type CustomersWise = Record<string, CustomerWeekData>;

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalBooking, setTotalBooking] = useState<number | undefined>(undefined);
    const [cancelBooking, setCancelBooking] = useState<number | undefined>(undefined);
    const [confirmBooking, setConfirmBooking] = useState<number | undefined>(undefined);
    const [totalRevenue, setTotalRevenue] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [chartData, setChartData] = useState<any>();
    const [LineChartData, setLineChartData] = useState<any>();
    const [topPackages, setTopPackage] = useState<any[]>([]);

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

                const customersWise: CustomersWise = data.customers_wise;
                const transformedData = Object.entries(customersWise).map(([key, value]) => ({
                    month: key,
                    online: value.online,
                    offline: value.offline
                }));
                setChartData(transformedData);

                const transformedLineData = Object.entries(customersWise).map(([key, value]) => ({
                    month: key,
                    local: value.local,
                    international: value.international
                }));
                setLineChartData(transformedLineData);

                setTopPackage(data.top_packages);
            }
        } catch (error) {
            console.log('error occur in dashboard api: ', error);
        } finally {
            setIsLoading(false);
        }
    };

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
            text: "Confirmed Bookings",
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
    ];

    const search = async (data: any) => {
        if (!data.data) {
            setStartDate(data.range.from);
            setEndDate(data.range.to);
        }
        const formatDate = (date: Date) =>
            `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        await dashboard(data.data, formatDate(data.range.from), formatDate(data.range.to));
    };

    useEffect(() => {
        dashboard("", "", "");
    }, []);

    return (
        <div className="px-2 sm:px-4">
            {/* Header */}
            <div className="px-2 sm:px-4 mt-3 font-semibold text-base sm:text-lg flex flex-col sm:flex-row justify-between gap-4">
                <div>Admin Dashboard</div>
                <div className="flex gap-2">
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

            {/* Summary Cards */}
            <div className="my-3 mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryData.map((item, index) => (
                    <div
                        key={index}
                        className="h-28 sm:h-32 border border-gray-200 shadow-lg rounded-lg p-3 sm:p-4 flex items-center justify-between"
                        style={{ backgroundColor: item.bgColor }}
                    >
                        {/* Left Side */}
                        <div>
                            <div className="text-xl sm:text-2xl font-bold">
                                {isLoading ? <Loader2 className="animate-spin" /> : item.count?.toLocaleString()}
                            </div>
                            <p className="pt-1 text-sm sm:text-base text-gray-700">{item.text}</p>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-center justify-center relative w-10 sm:w-12">
                            <div
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                <item.icon
                                    className="h-5 w-5 sm:h-6 sm:w-6"
                                    style={{ color: item.iconColor }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Top Packages */}
            <div className="flex flex-col gap-4 sm:gap-6">
                <BookingChart
                    chartData={chartData}
                    isLoading={isLoading}
                />
                <CustomerChart
                    chartData={LineChartData}
                    isLoading={isLoading}
                />
                <TopPackage
                    packages={topPackages}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
