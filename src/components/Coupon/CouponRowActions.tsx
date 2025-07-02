import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, MoreHorizontal } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import type { ICoupon } from '@/interface/coupon';
import { useNavigate } from 'react-router-dom';

export default function CouponRowActions({ row }: { row: Row<ICoupon> }) {
    const navigate = useNavigate();

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className='border border-gray-200'>
                    <DropdownMenuItem
                        className="mb-1 Poppins"
                        onClick={() => {
                            navigate(`/admin/coupon/edit/${row.original.id}`);
                        }}
                    >
                        <Edit className="h-2 w-2" /> Edit
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}
