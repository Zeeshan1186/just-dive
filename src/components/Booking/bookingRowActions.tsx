import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Edit, Eye, MoreHorizontal } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import type { ICoupon } from '@/interface/coupon';
import { useNavigate } from 'react-router-dom';
import type { IBooking } from '@/interface/booking';
import { useState } from 'react';
import BookingView from './bookingView';

export default function BookingRowActions({ row }: { row: Row<IBooking> }) {
    const navigate = useNavigate();
    const [isViewOpen, setIsViewOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <BookingView
                    sheetOpen={isViewOpen}
                    setSheetOpen={setIsViewOpen}
                    booking={row.original}
                />
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
                            setIsViewOpen(true);
                        }}
                    >
                        <Eye className="h-2 w-2" /> View
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu >
        </>
    )
}
