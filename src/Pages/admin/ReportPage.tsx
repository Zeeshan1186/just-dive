import BookingStatusChart from "@/components/BookingStatusChart";
import RevenueChart from "@/components/RevenueChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { IPackage } from "@/interface/package";
import { getactivePackages, getReport } from "@/services/apiService";
import { exportToExcel } from "@/utils/exportToExcel";
import { exportToExcelPackage } from "@/utils/exportToExcelPackage";
import { HttpStatusCode } from "axios";
import { BookmarkX, Check, DownloadIcon, FileSpreadsheet, HandCoins, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";

type RevenueEntry = {
    total_revenue: number;
    confirm_booking?: number;
    cancel_booking?: number;
};

export default function ReportPage() {
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalBooking, setTotalBooking] = useState<number | undefined>(undefined);
    const [cancelBooking, setCancelBooking] = useState<number | undefined>(undefined);
    const [confirmBooking, setConfirmBooking] = useState<number | undefined>(undefined);
    const [totalRevenue, setTotalRevenue] = useState<number | undefined>(undefined);
    const [totalBookingList, setTotalBookingList] = useState<any[]>([]);
    const [cancelBookingList, setCancelBookingList] = useState<any[]>([]);
    const [confirmBookingList, setConfirmBookingList] = useState<any[]>([]);
    const [packageData, setPackage] = useState<IPackage[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<string>(packageData[0]?.id.toString());
    const [lineChartData, setLineChartData] = useState<any>();
    const [chartData, setChartData] = useState<any>();
    const [mode, setMode] = useState<string>("");
    const [packageCancelCount, setPackageCancelCount] = useState<number | undefined>(undefined);
    const [packageConfirmCount, setPackageConfirmCount] = useState<number | undefined>(undefined);
    const [packageTotalCount, setPackageTotalCount] = useState<number | undefined>(undefined);
    const [packageTotalRevenue, setPackageTotalRevenue] = useState<number | undefined>(undefined);
    const [packageBookingList, setPackageBookingList] = useState<IPackage[]>([]);

    const selectedPackageName = packageData.filter((item) => item.id === packageBookingList[0]?.package_id);

    const search = async (data: any) => {
        if (!data.data) {
            setStartDate(data.range.from);
            setEndDate(data.range.to);
        }
        setMode(data.data);
        const formatDate = (date: Date) =>
            `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        await report(data.data, formatDate(data.range.from), formatDate(data.range.to), selectedPackage);
    };

    const report = async (mode?: string, startDate?: string, endDate?: string, packageId?: string) => {
        setIsLoading(true);
        try {
            const res = await getReport(mode, startDate, endDate, packageId);
            if (res.data.status === HttpStatusCode.Ok) {
                const data = res.data.data;
                setTotalBooking(data.total_booking);
                setTotalBookingList(data.total_booking_list);
                setCancelBooking(data.cancel_booking);
                setCancelBookingList(data.cancel_booking_list);
                setConfirmBooking(data.confirm_booking);
                setConfirmBookingList(data.confirm_booking_list);
                setTotalRevenue(data.total_revenue);
                const transformedLineData = Object.entries(data.package_grouped).map(([key, value]) => {
                    const typedValue = value as RevenueEntry;
                    return {
                        month: key,
                        revenue: typedValue.total_revenue
                    };
                });
                setLineChartData(transformedLineData);

                const transformedData = Object.entries(data.package_grouped).map(([key, value]) => {
                    const typedValue = value as RevenueEntry;
                    return {
                        month: key,
                        confirm: typedValue.confirm_booking,
                        cancel: typedValue.cancel_booking,
                    };
                });
                setChartData(transformedData);

                // For specific package download
                setPackageCancelCount(data.package?.cancel_booking);
                setPackageConfirmCount(data.package?.confirm_booking);
                setPackageTotalCount(data.package?.total_booking);
                setPackageTotalRevenue(data.package?.total_revenue);
                setPackageBookingList(data.package?.total_booking_list);

            }
        } catch (error) {
            console.log('error occur in report api: ', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Download Excel 
    const handleDownload = async (title?: string) => {
        let data, rows;
        if (title === 'confirm') {
            data = confirmBookingList;
        } else if (title === 'cancel') {
            data = cancelBookingList;
        } else {
            data = totalBookingList;
        }

        if (title !== 'revenue') {
            rows = data?.map((booking, i) => {
                const baseRow = {
                    "Sr No": i + 1,
                    "Booking ID": booking?.booking_id,
                    "Package": booking?.package?.name,
                    "Date Of Scuba": booking?.date_of_scuba,
                    "Location": booking?.package?.location?.location_name,
                    "Customer Name": booking?.full_name,
                    "Customer Gender": booking?.gender,
                    "Customer Age": booking?.age,
                    "Customer Email": booking?.email,
                    "Customer No.": booking?.whatsapp_no,
                    "Number Of Participants": booking?.number_of_participants,
                    "Customer Apply Coupon": booking?.coupon_id ? "Yes" : "No",
                    "Price": booking?.price,
                    "Slot Time": booking?.slot?.time,
                    "Booking Status": booking?.status,
                    "Is Booking From Admin": booking?.is_admin_booking ? "Yes" : "No",
                };
                return {
                    ...baseRow,
                    ...(booking?.coupon_id && {
                        "Coupon Name": booking?.coupon?.name || "N/A"
                    }),
                };
            });
        } else {
            rows = confirmBookingList?.map((booking, i) => ({
                "Sr No": i + 1,
                "Booking ID": booking?.booking_id,
                "Package": booking?.package?.name,
                "Price": booking?.price,
                "Is Booking From Admin": booking?.is_admin_booking ? "Yes" : "No",
                "Coupon Name": booking?.coupon?.name || "N/A"
            }));
        }

        exportToExcel(rows, await fileName(title ?? ''));
    };

    const fileName = async (title: string) => {
        let fileName;
        if (title === 'confirm') {
            fileName = 'confirm_booking.xlsx';
        } else if (title === 'cancel') {
            fileName = 'cancel_booking.xlsx';
        } else if (title === 'revenue') {
            fileName = 'booking_revenue.xlsx';
        } else {
            fileName = 'booking.xlsx';
        }
        return fileName;
    };

    const summaryData = [
        {
            text: "Total Bookings",
            count: totalBooking,
            icon: Users,
            bgColor: '#FFE2E5',
            iconBg: '#B576FE',
            iconColor: '#FFFFFF',
            download: () => handleDownload()
        },
        {
            text: "Confirm Bookings",
            count: confirmBooking,
            icon: Check,
            bgColor: '#FFF4DE',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2',
            download: () => handleDownload('confirm')
        },
        {
            text: "Total Revenue",
            count: totalRevenue,
            icon: HandCoins,
            bgColor: '#DCFCE7',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2',
            download: () => handleDownload('revenue')
        },
        {
            text: "Canceled Bookings",
            count: cancelBooking,
            icon: BookmarkX,
            bgColor: '#F3E8FF',
            iconBg: '#FFFFFF',
            iconColor: '#347AE2',
            download: () => handleDownload('cancel')
        }
    ];

    const handleDownloadPackage = () => {
        const row = [{
            "Package Name": selectedPackageName[0]?.name,
            "Total Bookings": packageTotalCount,
            "Confirm Bookings": packageConfirmCount,
            "Cancel Bookings": packageCancelCount,
            "Total Revenue": packageTotalRevenue
        }];
        exportToExcelPackage(row, `${selectedPackageName[0]?.name}.xlsx`);
    };

    useEffect(() => {
        const packageAPI = async () => {
            setIsLoading(true);
            try {
                const res = await getactivePackages();
                if (res.data.status === HttpStatusCode.Ok) {
                    const packages = res.data.data;
                    setPackage(packages);

                    if (packages.length > 0) {
                        setSelectedPackage(packages[0].id);
                    }
                }
            } catch (error) {
                console.log('Error calling package API:', error);
            } finally {
                setIsLoading(false);
            }
        };

        packageAPI();
    }, []);

    useEffect(() => {
        if (selectedPackage) {
            report(mode ?? "", startDate?.toISOString() ?? "", endDate?.toISOString() ?? "", selectedPackage);
        }
    }, [selectedPackage]);

    return (
        <div className='p-4'>
            <div className='flex justify-between'>
                <div className='text-[#181E4B] font-semibold text-xl'>Reports</div>
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
                                onClick={item.download}
                                className="hover:cursor-pointer mb-3 bg-white border border-gray-300 rounded-sm  p-[3px] ">
                                <DownloadIcon className="h-4 w-4 text-gray-700" />
                            </div>

                            {/* Main Icon Circle */}
                            <div
                                className="w-11 h-11 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: item.iconBg }}
                            >
                                <item.icon className="h-6 w-6" style={{ color: item.iconColor }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div className="mt-4">
                <Card className='border-gray-300'>
                    <div className="flex flex-col md:flex-row w-full items-start px-5 md:items-center justify-between gap-4 md:gap-0 pr-0 md:pr-4">
                        {/* Header Title */}
                        <CardHeader className="p-0">
                            <CardTitle className="whitespace-nowrap">Booking Overview</CardTitle>
                        </CardHeader>

                        {/* Actions: Download Button & Select Dropdown */}
                        <div className="flex flex-col sm:flex-row pr-4 gap-3 md:gap-2 w-full md:w-auto">
                            {/* Download Button */}
                            <div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            className="bg-white border border-gray-200 px-2 py-2 hover:bg-white hover:cursor-pointer w-full sm:w-auto"
                                            aria-label="Export to Excel"
                                            onClick={handleDownloadPackage}
                                        >
                                            <FileSpreadsheet className="text-green-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download Excel</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>

                            {/* Package Select Dropdown */}
                            <Select
                                value={selectedPackage?.toString()}
                                onValueChange={(value) => setSelectedPackage(value)}
                            >
                                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                    <SelectValue placeholder="Search by package" />
                                </SelectTrigger>
                                <SelectContent className="border-gray-300">
                                    <SelectGroup>
                                        {packageData?.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="flex flex-col gap-3">
                        <BookingStatusChart
                            chartData={chartData}
                            isLoading={isLoading}
                        />
                        <RevenueChart
                            chartData={lineChartData}
                            isLoading={isLoading}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
