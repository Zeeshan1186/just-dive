import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
import type { Row } from "@tanstack/react-table";
import type { BlogCategory } from "../../interface/blogCategory";
import { deleteBlogCategory } from "@/services/apiService";

export default function BlogCategoryRowActions({
    row,
    onDeleted,
    onEdit,
}: {
    row: Row<BlogCategory>;
    onDeleted: () => void;
    onEdit: (category: BlogCategory) => void;
}) {
    const categoryId = row.original.id;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border border-gray-200">
                <DropdownMenuItem
                    onClick={() => onEdit(row.original)}
                >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this category?")) {
                            await deleteBlogCategory(categoryId);
                            onDeleted();
                        }
                    }}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
