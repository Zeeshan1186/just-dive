import BookingRowActions from '@/components/Booking/bookingRowActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BOOKING_STATUS, PAGINATION_COUNT } from '@/constants/const-variables';
import type { IBooking } from '@/interface/booking';
import type { IPackage } from '@/interface/package';
import { getActiveBooking, getactivePackages } from '@/services/apiService';
import { bookingDateFormat } from '@/utils/date-format';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, type VisibilityState } from '@tanstack/react-table';
import { HttpStatusCode } from 'axios';
import { format, parseISO } from 'date-fns';
import { ArrowUpDown, Loader2, Plus, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
        return format(parsedDate, 'd MMMM yyyy');
    }

    const refreshBookings = () => {
        booking();
    }

    const columns: ColumnDef<IBooking>[] = [
        {
            accessorKey: "booking_id",
            header: "Booking ID",
            cell: ({ row }) => (
                <div className={`${row.original?.status === BOOKING_STATUS.CANCEL && "text-destructive"} font-medium`} >
                    {row.original?.booking_id ? row.original?.booking_id : "J8K5G"}
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
                        onClick={() =>
                            column.toggleSorting(isSorted === "asc")
                        }
                    >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        Booking Package
                    </Button>
                );
            },
            cell: ({ row }) => {
                const packageName = row.original?.package?.name;
                return (
                    <div
                        className={` ml-6 font-medium`}
                    >
                        {packageName}
                    </div>
                );
            },
        },
        {
            accessorKey: "date_of_scuba",
            header: "Date Of Scuba",
            cell: ({ row }) => (
                <div className={`font-medium`} >
                    {bookingDateFormat(row.original?.date_of_scuba)}
                </div>
            ),
        },
        {
            accessorKey: "full_name",
            header: "Name",
            cell: ({ row }) => (
                <div className={` font-medium`} >
                    {row.original?.full_name}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Date Of Booking",
            cell: ({ row }) => {
                return (
                    <div className={` font-medium`}  >
                        {bookingCreatedAtFormat(row.original?.created_at)}
                    </div>
                )
            },
        },
        {
            accessorKey: "package.location.location_name",
            header: "Location",
            cell: ({ row }) => {
                return (
                    <div className={` font-medium`} >
                        {row.original?.package?.location?.location_name}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: any }) => {
                return (
                    <BookingRowActions
                        row={row}
                        refreshBookings={refreshBookings}
                        statusData={activeBooking}
                    />
                );
            },
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
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            pagination,
            globalFilter
        },
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
            console.log('error occur during get active booking:', error);
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
            console.log('error occur in package:', error);
        }
    }

    useEffect(() => {
        booking();
        packageAPI();
    }, []);

    useEffect(() => {
        booking();
    }, [activeBooking, selectedPackage]);

    const renderTable = () => {
        return (
            <Table className="border border-gray-200">
                <TableHeader className='bg-[#FFF6E2]'>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="border-b border-gray-200">
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id} className="text-black">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody className='border border-gray-200'>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="py-6 text-center">
                                <div className="flex justify-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow
                                key={row.id}
                                className={`border border-gray-200 Poppins ${index % 2 === 0
                                    ? 'bg-[#FAFAFC]'
                                    : ''
                                    }`}>
                                {row.getVisibleCells().map((cell, cellIndex) => (
                                    <TableCell key={cell.id} className="relative py-2">
                                        {cellIndex === 0 && row.original.status === BOOKING_STATUS.CANCEL && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[90%] w-[3px] bg-red-500 rounded" />
                                        )}
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-gray-500 py-4">
                                No results
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        )
    };

    return (
        <div className='p-4'>
            <div className='flex justify-between'>
                <div className='text-[#181E4B] font-semibold text-lg Poppins'>Manage Bookings</div>
                <div className='flex'>
                    <div className="border border-gray-200 flex items-center justify-center bg-white rounded-md shadow-md w-full max-w-[200px] md:max-w-[300px]">
                        <Search className="h-5 w-5 text-gray-500 ml-2 cursor-pointer" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                table.setGlobalFilter(e.target.value);
                            }}
                            placeholder="Search bookings..."
                            className="border-none Poppins outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:border-transparent shadow-none w-full px-2"
                        />
                    </div>
                    <div className='ml-2'>
                        <Button onClick={() => { navigate('/admin/booking/add') }}>
                            <Plus /> Add Booking
                        </Button>
                    </div>
                    <div className='ml-2 flex'>
                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                            <SelectTrigger className="w-[180px] bg-white">
                                <SelectValue placeholder="Search by package" />
                            </SelectTrigger>
                            <SelectContent className='border-gray-300'>
                                <SelectGroup className='border-gray-300'>
                                    {packages?.map((packageData, index) => (
                                        <SelectItem key={index} value={packageData.id.toString()}>{packageData.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className='flex items-center justify-center ml-2'>
                            {selectedPackage &&
                                <Button size={'icon'} onClick={() => setSelectedPackage("")} className='bg-destructive hover:bg-destructive'>
                                    <X className='h-5 w-5' />
                                </Button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Tabs value={activeBooking}
                    onValueChange={setActiveBooking}
                    className="w-full"
                >
                    <TabsList className="bg-transparent mb-4">
                        <TabsTrigger value="confirm">Confirm Bookings</TabsTrigger>
                        <TabsTrigger value="cancel">Cancel Bookings</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeBooking}>
                        {renderTable()}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
