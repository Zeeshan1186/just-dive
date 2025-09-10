import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { HTTP_CODE } from '@/constants/http-codes';
import {
    getBlogscategories,
    createBlogCategory,
    updateBlogCategory,
} from '@/services/apiService';
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
    type Row,
    type SortingState,
    type VisibilityState,
} from '@tanstack/react-table';
import { PAGINATION_COUNT } from '@/constants/const-variables';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Loader2, Plus, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import BlogCategoryRowActions from '../admin/BlogCategoryRowActions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedCallback } from 'use-debounce';

type BlogCategory = {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
};

const AddCategorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
});

export default function BlogsCategories() {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: PAGINATION_COUNT,
    });
    const [searchValue, setSearchValue] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<BlogCategory | null>(null);

    const form = useForm<z.infer<typeof AddCategorySchema>>({
        resolver: zodResolver(AddCategorySchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (editMode && currentCategory) {
            form.setValue("name", currentCategory.name);
        } else {
            form.reset();
        }
    }, [editMode, currentCategory, form]);

    const columns: ColumnDef<BlogCategory>[] = [
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
                        Name <ArrowUpDown className="ml-1" />
                    </Button>
                );
            },
            cell: ({ row }) => <div>{row.getValue("name")}</div>,
        },
        {
            accessorKey: "created_at",
            header: "Created Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"));
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            accessorKey: "updated_at",
            header: "Updated Date",
            cell: ({ row }) => {
                const date = new Date(row.getValue("updated_at"));
                return <div>{date.toLocaleDateString()}</div>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }: { row: Row<BlogCategory>; }) => (
                <BlogCategoryRowActions
                    row={row}
                    onDeleted={fetchCategories}
                    onEdit={(category) => {
                        setShowForm(true);
                        setEditMode(true);
                        setCurrentCategory(category);
                    }}
                />
            ),
        },
    ];

    const table = useReactTable({
        data: categories,
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
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
    });

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await getBlogscategories();
            if (response.data.status === HTTP_CODE.SUCCESS_CODE) {
                setCategories(response?.data?.data || []);
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: { name: string; }) => {
        setIsLoading(true);
        try {
            if (editMode && currentCategory) {
                // Update category
                const res = await updateBlogCategory(currentCategory.id, { name: data.name });
                if (res.data.status === HTTP_CODE.SUCCESS_CODE) {
                    toast.success("Category updated successfully");
                }
            } else {
                // Create category
                const res = await createBlogCategory({ name: data.name });
                if (res.data.status === HTTP_CODE.SUCCESS_CODE) {
                    toast.success("Category added successfully");
                }
            }
            setEditMode(false);
            setCurrentCategory(null);
            form.reset();
            fetchCategories(); // refresh list
        } catch (error) {
            console.error(error);
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, [searchValue]);

    const handleFilter = useDebouncedCallback((value: string) => {
        table.setGlobalFilter(value);
    }, 300);

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="text-[#181E4B] font-semibold text-lg Poppins">
                    Manage Blog Categories
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center border border-gray-200 rounded-md shadow-md px-2">
                        <Search className="h-5 w-5 text-gray-500" />
                        <Input
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                                handleFilter(e.target.value);
                            }}
                            placeholder="Search category..."
                            className="border-none outline-none w-full px-2"
                        />
                    </div>
                    <Button
                        onClick={() => {
                            if (showForm) {
                                setEditMode(false);
                                setCurrentCategory(null);
                                form.reset();
                            }
                            setShowForm(!showForm);
                        }}
                        className="flex gap-1"
                    >
                        {showForm ? <X /> : <Plus />}
                        {showForm ? "Cancel" : "Add Category"}
                    </Button>
                </div>
            </div>

            {/* Add/Edit Category Form */}
            {showForm && (
                <div className="py-4 px-6 mt-4 border-[#eaeaea] border rounded-md shadow-sm bg-gray-50">
                    <div className="text-[#181E4B] font-semibold Poppins text-md mb-4">
                        {editMode ? "Edit Category" : "Add New Category"}
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 Poppins">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className='flex'>
                                            <FormLabel className='w-40 '>Category Name </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter category name"
                                                    {...field}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#509CDB] text-white"
                                >
                                    {editMode ? "Update" : "Submit"}
                                    {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            )}

            {/* Table */}
            <div className="rounded-md mt-4">
                <Table>
                    <TableHeader className="bg-[#FFF6E2]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row, idx) => (
                                <TableRow
                                    key={row.id}
                                    className={idx % 2 === 0 ? 'bg-gray-50' : ''}
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
                                <TableCell colSpan={columns.length} className="text-center py-6">
                                    {!isLoading ? "No categories found." :
                                        <Loader2 className="h-5 w-5 animate-spin mx-auto" />}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
