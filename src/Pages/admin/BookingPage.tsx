import BookingRowActions from '@/components/Booking/bookingRowActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BOOKING_STATUS, PAGINATION_COUNT } from '@/constants/const-variables';
import type { IBooking } from '@/interface/booking';
import type { IPackage } from '@/interface/package';
import { getActiveBooking, getactivePackages } from '@/services/apiService';
import { bookingDateFormat } from '@/utils/date-format';
import { exportToExcel } from '@/utils/exportToExcel';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, type VisibilityState } from '@tanstack/react-table';
import { HttpStatusCode } from 'axios';
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, FileSpreadsheet, Loader2, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';

export default function AdminBookingPage() {
    const [bookingData, setBooking] = useState<IBooking[]>([]);
    const [activeBooking, setActiveBooking] = useState<string>("confirm");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [searchValue, setSearchValue] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [globalFilter, setGlobalFilter] = useState<unknown>([]);
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGINATION_COUNT,
    });
    const navigate = useNavigate();

    const bookingCreatedAtFormat = (dateString: string | undefined): string => {
        if (!dateString) return '';
        const parsedDate = parseISO(dateString);
        return format(parsedDate, 'd MMM yyyy');
    }

    const refreshBookings = () => booking();

    const columns: ColumnDef<IBooking>[] = [
        {
            accessorFn: (row) => row.booking_id ?? "",
            accessorKey: "booking_id",
            header: "Booking ID",
            cell: ({ row }) => (
                <div className={`${row.original?.status === BOOKING_STATUS.CANCEL && "text-destructive"} font-medium`}>
                    {row.original?.booking_id || "J8K5G"}
                </div>
            ),
        },
        {
            accessorKey: "package.name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="hover:text-primary hover:cursor-pointer hover:bg-transparent"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Booking Package
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="ml-2 md:ml-6 font-medium">
                    {row.original?.package?.name}
                </div>
            ),
        },
        {
            accessorKey: "date_of_scuba",
            header: "Date Of Scuba",
            cell: ({ row }) => (
                <div className="font-medium">
                    {bookingDateFormat(row.original?.date_of_scuba)}
                </div>
            ),
        },
        {
            accessorKey: "full_name",
            // header: "Name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="hover:text-primary hover:cursor-pointer hover:bg-transparent"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Name
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original?.full_name}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Date Of Booking",
            cell: ({ row }) => (
                <div className="font-medium">
                    {bookingCreatedAtFormat(row.original?.created_at)}
                </div>
            ),
        },
        {
            accessorKey: "package.location.location_name",
            header: "Location",
            cell: ({ row }) => (
                <div className="font-medium">
                    {row.original?.package?.location?.location_name}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <BookingRowActions
                    row={row}
                    refreshBookings={refreshBookings}
                    statusData={activeBooking}
                />
            ),
        }
    ];

    const table = useReactTable({
        data: bookingData,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: "includesString",
        state: { sorting, columnVisibility, rowSelection, pagination, globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
    });

    const booking = async () => {
        setIsLoading(true);
        try {
            const res = await getActiveBooking(activeBooking, selectedPackage);
            if (res.data.status === HttpStatusCode.Ok) {
                setBooking(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const packageAPI = async () => {
        try {
            const res = await getactivePackages();
            if (res.data.status === HttpStatusCode.Ok) {
                setPackages(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    }

    useEffect(() => {
        booking();
        packageAPI();
    }, []);

    useEffect(() => {
        booking();
    }, [activeBooking, selectedPackage]);

    const handleDownload = () => {
        const rows = table.getRowModel().rows.map((booking, i) => ({
            "Sr No": i + 1,
            "Booking ID": booking.original.booking_id,
            "Package": booking.original.package?.name,
            "Date Of Scuba": booking.original.date_of_scuba,
            "Location": booking.original.package?.location?.location_name,
            "Customer Name": booking.original.full_name,
            "Customer Gender": booking.original.gender,
            "Customer Age": booking.original.age,
            "Customer Email": booking.original.email,
            "Customer No.": booking.original.whatsapp_no,
            "Number Of Participants": booking.original.number_of_participants,
            "Customer Apply Coupon": booking.original.coupon_id ? "Yes" : "No",
            "Price": booking.original.price,
            "Slot Time": booking.original.slot?.time,
            "Booking Status": booking.original.status,
            "Is Booking From Admin": booking.original.is_admin_booking ? "Yes" : "No",
            ...(booking.original.coupon_id && { "Coupon Name": booking.original.coupon?.name || "N/A" })
        }));
        exportToExcel(rows);
    }

    const handleFilter = useDebouncedCallback((value: string) => {
        table.setGlobalFilter(value);
    }, 300);

    const renderTable = () => (
        <>
            <div className="overflow-x-auto">
                <Table className="border border-gray-200 min-w-[800px]">
                    <TableHeader className="bg-[#FFF6E2]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center">
                                    <Loader2 className="animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, i) => (
                                <TableRow key={row.id} className={`Poppins ${i % 2 === 0 ? 'bg-[#FAFAFC]' : ''}`}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="text-center text-gray-500">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>


        </>
    );

    return (
        <div className="p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
                <h1 className="text-[#181E4B] font-semibold text-lg Poppins">Manage Bookings</h1>
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center bg-white border rounded-md shadow-md w-full sm:w-auto max-w-[200px] md:max-w-[300px]">
                        <Search className="h-5 w-5 text-gray-500 ml-2" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleFilter(e.target.value);
                            }}
                            placeholder="Search bookings..."
                            className="border-none Poppins outline-none focus:ring-0 shadow-none w-full px-2"
                        />
                    </div>
                    <Button onClick={() => navigate('/admin/booking/add')}>
                        <Plus /> Add Booking
                    </Button>
                    <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                        <SelectTrigger className="w-[150px] sm:w-[180px] bg-white">
                            <SelectValue placeholder="Search by package" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {packages.map((pkg) => (
                                    <SelectItem key={pkg.id} value={pkg.id.toString()}>{pkg.name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {selectedPackage && (
                        <Button size="icon" onClick={() => setSelectedPackage("")} className="bg-destructive">
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" onClick={handleDownload} className="bg-white border hover:bg-white">
                                <FileSpreadsheet className="text-green-500" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Download Excel</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeBooking} onValueChange={setActiveBooking}>
                <TabsList className="bg-transparent mb-2 sm:mb-4">
                    <TabsTrigger value="confirm">Confirm Bookings</TabsTrigger>
                    <TabsTrigger value="cancel">Cancel Bookings</TabsTrigger>
                </TabsList>
                <TabsContent value={activeBooking}>
                    {renderTable()}
                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 px-2">
                        <div className="text-sm text-muted-foreground">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
