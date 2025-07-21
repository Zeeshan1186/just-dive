import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import { getBlogs, getBlogscategories } from '@/services/apiService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type SortingState,
    type VisibilityState
} from '@tanstack/react-table';
import { PAGINATION_COUNT } from '@/constants/const-variables';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import type { IBlog } from '../../interface/blog';
import BlogRowActions from './BlogRowActions';

export default function AdminBlogsList() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [blogs, setBlogs] = useState<IBlog[]>([]);
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
    const [categories, setCategories] = useState<{ id: number; name: string; }[]>([]);

    const columns: ColumnDef<IBlog>[] = [
        {
            accessorKey: "title",
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className='hover:text-primary'
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Blog Title
                        <ArrowUpDown />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const title: string = row.getValue("title") || "";
                const words = title.split(" ");
                const shortTitle = words.length > 6 ? words.slice(0, 6).join(" ") + "..." : title;

                return <div>{shortTitle}</div>;
            }
        },
        {
            accessorKey: "category.name", // You can leave this accessorKey or remove it since we're mapping manually
            header: "Category",
            cell: ({ row }) => {
                const categoryId = row.original.category_id;
                const categoryName = categories.find(c => c.id === categoryId)?.name || "No Category";
                return <div>{categoryName}</div>;
            }
        },

        {
            accessorKey: "author_name",
            header: "Author Name",
            cell: ({ row }) => (
                <div>{row.getValue("author_name")}</div>
            ),
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => (
                <div>{new Date(row.getValue('created_at')).toLocaleDateString()}</div>
            ),
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => (
                <div>{new Date(row.getValue('updated_at')).toLocaleDateString()}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => (
                <BlogRowActions
                    row={row}
                    onDeleted={blogsAPI} // refresh list after delete
                />
            ),
        }
    ];


    const fetchCategories = async () => {
        try {
            const response = await getBlogscategories(); // Your categories API
            if (response.data.status === HTTP_CODE.SUCCESS_CODE) {
                setCategories(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    useEffect(() => {
        blogsAPI();
        fetchCategories();
    }, []);


    const table = useReactTable({
        data: blogs,
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

    const blogsAPI = async () => {
        setIsLoading(true);
        try {
            const response = await getBlogs();
            console.log("Categories API:", response.data.data);

            if (response.data.status === HTTP_CODE.SUCCESS_CODE) {
                setBlogs(response.data.data);
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        blogsAPI();
    }, []);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchValue]);

    return (
        <div className='p-4 Poppins'>
            <div className='flex justify-between'>
                <div className='text-[#181E4B] font-semibold text-xl Poppins'>Blogs</div>
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
                            placeholder="Search blogs..."
                            className="border-none Poppins outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-visible:ring-0 focus-visible:border-transparent shadow-none w-full px-2"
                        />
                    </div>
                    <div className='ml-4'>
                        <Button onClick={() => { navigate('/admin/add-blog'); }}>
                            <Plus /> Add Blog
                        </Button>
                    </div>
                </div>
            </div>

            <div className="rounded-md border !border-gray-100 mt-4">
                <Table className='border border-gray-200'>
                    <TableHeader className='bg-[#FFF6E2]'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className='text-black'>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    className={`border-b border-gray-200 Poppins ${index % 2 === 0 ? 'bg-[#FAFAFC]' : ''}`}
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
                                    {!isLoading ? "No results" : (
                                        <div className='flex items-center justify-center'>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
