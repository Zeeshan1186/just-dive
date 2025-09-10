import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import { getPackages } from '@/services/apiService';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type Row, type SortingState, type VisibilityState } from '@tanstack/react-table';
import { PAGINATION_COUNT } from '@/constants/const-variables';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import type { IPackage } from '@/interface/package';
import { simpleDate } from '@/utils/date-format';
import PackageRowActions from '@/components/Package/PackageRowActions';

export default function PackagePage() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [packages, setPackages] = useState<IPackage[]>([]);
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

    const columns: ColumnDef<IPackage>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="hover:text-primary"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Name
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div>{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "location.location_name",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="hover:text-primary"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Diving Sight
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.location.location_name}
                </div>
            ),
        },
        {
            accessorKey: "price",
            header: "Package Price",
            cell: ({ row }) => (
                <div className="capitalize">
                    ₹ {row.getValue('price')}
                </div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Package Creation Date",
            cell: ({ row }) => (
                <div className="capitalize">
                    {simpleDate(row.getValue('created_at'))}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: any }) => (
                <PackageRowActions row={row as Row<IPackage>} />
            ),
        },
    ];

    const table = useReactTable({
        data: packages,
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

    const packagesAPI = async () => {
        setIsLoading(true);
        try {
            const response = await getPackages();
            if (response.data.status === HTTP_CODE.SUCCESS_CODE) {
                setPackages(response.data.data);
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        packagesAPI();
    }, []);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchValue]);

    return (
        <div className="p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
                <div className="text-[#181E4B] font-semibold text-lg sm:text-xl Poppins">Packages</div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <div className="flex items-center border border-gray-200 rounded-md shadow-md bg-white w-full sm:w-auto max-w-[300px]">
                        <Search className="h-5 w-5 text-gray-500 ml-2" />
                        <Input
                            type="text"
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                table.setGlobalFilter(e.target.value);
                            }}
                            placeholder="Search packages..."
                            className="border-none Poppins outline-none focus:ring-0 w-full px-2"
                        />
                    </div>
                    <Button onClick={() => navigate('/admin/add-package')} className="w-full sm:w-auto">
                        <Plus className="mr-1" /> Add Package
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-gray-100 mt-4 overflow-x-auto">
                <Table className="min-w-[800px] border border-gray-200">
                    <TableHeader className="bg-[#FFF6E2]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    className={`Poppins ${index % 2 === 0 ? 'bg-[#FAFAFC]' : ''}`}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {!isLoading ? "No results" : (
                                        <Loader2 className="animate-spin mx-auto h-6 w-6" />
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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
        </div>
    );
}
