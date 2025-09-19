import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import { getAllLocations, getLocations } from '@/services/apiService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type Row, type SortingState, type VisibilityState } from '@tanstack/react-table';
import { PAGINATION_COUNT } from '@/constants/const-variables';
import type { ILocation } from '@/interface/location';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import LocationRowActions from '@/components/Location/LocationRowActions';
import { useDebouncedCallback } from "use-debounce";

export default function LocationPage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [address, setAddress] = useState<ILocation[]>([]);
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

    const columns: ColumnDef<ILocation>[] = [
        {
            accessorKey: "location_name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className='hover:text-primary'
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Location
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="" >
                    {row.getValue("location_name")}
                </div>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="capitalize" title={row.original.address}>
                    {row.original?.address?.length > 80 ?
                        `${row.original?.address.slice(0, 80)}...` :
                        row.original?.address
                    }
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: any; }) => {
                return (
                    <LocationRowActions
                        row={row as Row<ILocation>}
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

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const response = await getAllLocations();
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
        getCategories();
    }, []);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchValue]);

    const handleFilter = useDebouncedCallback((value: string) => {
        table.setGlobalFilter(value);
    }, 300);

    return (
        <div className='p-4'>
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                {/* Title */}
                <div className="text-[#181E4B] font-semibold text-lg Poppins">
                    Manage Location
                </div>

                {/* Search and Button */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    {/* Search Box */}
                    <div className="border border-gray-200 flex items-center bg-white rounded-md shadow-md w-full sm:w-auto max-w-full sm:max-w-[200px] md:max-w-[300px]">
                        <Search className="h-5 w-5 text-gray-500 ml-2 cursor-pointer" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleFilter(e.target.value);
                            }}
                            placeholder="Search location..."
                            className="border-none Poppins outline-none focus:outline-none focus:ring-0 focus:border-transparent shadow-none w-full px-2"
                        />
                    </div>

                    {/* Add Location Button */}
                    <div className="sm:ml-0">
                        <Button
                            className="w-full sm:w-auto"
                            onClick={() => navigate('/admin/location/add')}
                        >
                            <Plus className="mr-1" /> Add Location
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
