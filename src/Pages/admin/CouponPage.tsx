import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import { getCoupons } from '@/services/apiService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type Row, type SortingState, type VisibilityState } from '@tanstack/react-table';
import { PAGINATION_COUNT } from '@/constants/const-variables';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import type { ICoupon } from '@/interface/coupon';
import CouponRowActions from '@/components/Coupon/CouponRowActions';

export default function CouponPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [address, setAddress] = useState<ICoupon[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState<unknown>([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGINATION_COUNT,
    });
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const columns: ColumnDef<ICoupon>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className='hover:text-primary'
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="" >
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "package.name",
            header: "Package Name",
            cell: ({ row }) => {
                const packageName = row.original?.package?.name;
                return (
                    <div className="capitalize" >
                        {
                            packageName ?
                                packageName?.length > 30 ? `${packageName.slice(0, 30)}...` : packageName :
                                'All'
                        }
                    </div >
                );
            },
        },
        {
            accessorKey: "discount",
            header: "Discount",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original?.discount}%
                </div>
            ),
        },
        {
            accessorKey: "validity",
            header: "Validity",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('validity') === 'life_time' ? "Life Time" : row.getValue('validity')}
                </div>
            ),
        },
        {
            accessorKey: "times_use",
            header: "Times Use",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue('times_use') === 'life_time' ? "Life Time" : row.getValue('times_use')}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: any; }) => {
                return (
                    <CouponRowActions
                        row={row as Row<ICoupon>}
                    />
                );
            },
        },
    ];

    const table = useReactTable({
        data: address,
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
        onPaginationChange: setPagination
    });

    const getCouponDetails = async () => {
        setIsLoading(true);
        try {
            const response = await getCoupons();
            if (response.data.status === HTTP_CODE.SUCCESS_CODE) {
                setAddress(response?.data?.data);
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCouponDetails();
    }, []);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchValue]);

    return (
        <div className='p-4'>
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* Title */}
                <div className="text-[#181E4B] font-semibold text-lg Poppins">
                    Manage Coupon
                </div>

                {/* Search and Add Button */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    {/* Search Box */}
                    <div className="border border-gray-200 flex items-center bg-white rounded-md shadow-md w-full sm:w-auto max-w-full sm:max-w-[200px] md:max-w-[300px]">
                        <Search className="h-5 w-5 text-gray-500 ml-2 cursor-pointer" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                table.setGlobalFilter(e.target.value);
                            }}
                            placeholder="Search coupon..."
                            className="border-none Poppins outline-none focus:outline-none focus:ring-0 focus:border-transparent shadow-none w-full px-2"
                        />
                    </div>

                    {/* Add Coupon Button */}
                    <div className="sm:ml-0">
                        <Button
                            className="w-full sm:w-auto"
                            onClick={() => navigate('/admin/coupon/add')}
                        >
                            <Plus className="mr-1" /> Add Coupon
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-md border !border-gray-100 mt-4">
                <Table className='border border-gray-200'>
                    <TableHeader className='bg-[#FFF6E2]'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className='text-black'>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table && table.getRowModel() && table?.getRowModel()?.rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    className={`border-b border-gray-200 Poppins ${index % 2 === 0
                                        ? 'bg-[#FAFAFC]'
                                        : ''
                                        }`}
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {!isLoading ? "No results" :
                                        <div className='flex items-center justify-center'>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        </div>
                                    }
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>

                <div className="space-x-2">
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
        </div>
    );
}
