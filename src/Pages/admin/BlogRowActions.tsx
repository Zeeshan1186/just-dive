import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import type { IBlog } from '../../interface/blog';
import { toast } from 'sonner';
import { deleteBlog } from '@/services/apiService';
import { HTTP_CODE } from '@/constants/http-codes';
import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';

export default function BlogRowActions({ row, onDeleted }: { row: Row<IBlog>; onDeleted: () => void; }) {
    const navigate = useNavigate();
    const blogId = row.original.id;

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await deleteBlog(blogId);
            if (res.data.status === HTTP_CODE.SUCCESS_CODE) {
                toast.success("Blog deleted successfully!");
                onDeleted(); // Refresh list in parent
            } else {
                toast.error(res.data.message || "Failed to delete blog.");
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        }
    };

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
                    className="mb-1 Poppins"
                    onClick={() => {
                        navigate(`/admin/edit-blog/${blogId}`);
                    }}
                >
                    <Edit className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="mb-1 Poppins text-red-600"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
