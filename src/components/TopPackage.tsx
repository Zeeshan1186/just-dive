import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type VisibilityState } from '@tanstack/react-table';
import { Card, CardContent } from './ui/card'
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Loader2 } from 'lucide-react';

export default function TopPackage({ packages, isLoading }: { packages: any[], isLoading: boolean }) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "index",
            header: "#",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: "package.name",
            header: "Package Name",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.package?.name || "-"}
                </div>
            ),
        },
        {
            accessorKey: "total_bookings",
            header: "Sales",
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.original.total_bookings || "0"}
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: packages,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        globalFilterFn: "includesString",
        state: {
            columnVisibility,
        },
    });

    return (
        <Card className="mx-2 border-gray-300 mb-0">
            <CardContent className="pt-0 pb-0">
                <div className='mb-1 text-lg font-semibold'>
                    Top Package
                </div>
                <Table className="w-full border-collapse">
                    <TableHeader className="px-12">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-black px-12">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody className="px-12">
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="border-b border-gray-200 Poppins"
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-12">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
