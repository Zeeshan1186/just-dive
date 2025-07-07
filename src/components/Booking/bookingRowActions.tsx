import { Button } from '../ui/button';
import { Check, Eye, Loader, Loader2, MoreHorizontal, Pen, RotateCcw, ThumbsUp, X } from 'lucide-react';
import type { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import type { IBooking } from '@/interface/booking';
import { useEffect, useState } from 'react';
import BookingView from './bookingView';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { toast } from 'sonner';
import { GENERIC_ERROR_MESSAGE } from '@/constants/error-message';
import { getPackageSlotsByDate, updateBookingStatus } from '@/services/apiService';
import { HTTP_CODE } from '@/constants/http-codes';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Label } from '@radix-ui/react-label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const schema = z.object({
    slot: z.number().min(1, 'Slot is required'),
    dateOfScuba: z.string().min(1, "Date is required"),
});

export default function BookingRowActions({ row, refreshBookings, statusData }:
    {
        row: Row<IBooking>,
        refreshBookings: () => void,
        statusData: string
    }) {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            dateOfScuba: "",
        },
    });

    const navigate = useNavigate();
    const bookingId = row.original.id;
    const selectedPackage = row.original?.package?.id;
    const date = row.original?.date_of_scuba;
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [confirmationOpen, setConfirmationOpen] = useState<boolean>(false);
    const [status, setStatus] = useState<string>("");
    const [dynamicSlots, setDynamicSlots] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [open, setOpen] = useState(false)

    // messages
    const getLabel = () => (status === "cancel" ? "Cancel" : "Confirm");
    const getLoadingLabel = () => (status === "cancel" ? "Cancelling Booking" : "Confirm");
    const getSuccessVariant = () => (status === "cancel" ? "destructive" : "default");
    const getSuccessLabel = () => (status === "cancel" ? "Cancel Booking" : "Confirm");

    const updateStatus = async () => {
        setIsLoading(true);
        try {
            const response = await updateBookingStatus(bookingId, status);
            if (response?.data.status === HTTP_CODE.SUCCESS_CODE) {
                toast.success(response.data.message);
                refreshBookings();
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    }

    const onSubmit = async (data: any) => {
        // console.log('data', data);
    }

    const fetchSlotsAndSeats = async () => {
        if (selectedPackage && date) {
            try {
                const formattedDate = format(date, 'd/M/yyyy');
                const res = await getPackageSlotsByDate(Number(selectedPackage), formattedDate);

                // ✅ Ensure it's always an array before setting
                const slots = Array.isArray(res?.data?.data) ? res.data.data : [];
                setDynamicSlots(slots);

            } catch (error) {
                console.error("Failed to fetch slots", error);
            }
        }
    };

    useEffect(() => {
        fetchSlotsAndSeats();
    }, [selectedPackage, date]);

    return (
        <>
            {/* Change booking status */}
            <ConfirmationDialog
                isOpen={confirmationOpen}
                setIsOpen={setConfirmationOpen}
                title={`${getLabel()} this booking`}
                description={
                    <>
                        <p>Are you sure you want {status === "confirm" ? "Confirm" : "Cancel"} this booking?</p>
                    </>
                }
                isLoading={isLoading}
                isDisabled={isLoading}
                successAction={updateStatus}
                successLabel={getSuccessLabel()}
                successLoadingLabel={getLoadingLabel()}
                successVariant={getSuccessVariant()}
            />

            {/* Reschedule */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reschedule Booking</DialogTitle>
                        <DialogDescription>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className=" mb-2 mt-3 space-y-4">
                                    {/* Date */}
                                    <FormField
                                        control={form.control}
                                        name="dateOfScuba"
                                        render={({ field }) => (
                                            <FormItem className=" ">
                                                <div className="flex flex-col gap-1">
                                                    <Label htmlFor="date" className="text-black">
                                                        Date of Scuba
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger className='border-gray-200' asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal bg-white",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "dd MMMM yyyy")
                                                                ) : (
                                                                    <span>Select Date</span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto border-gray-200 p-0 bg-white" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value ? new Date(field.value) : undefined}
                                                                onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                                                                initialFocus
                                                                className="bg-white border-gray-300"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* slots */}
                                    <FormField
                                        control={form.control}
                                        name="slot"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="gap-4">
                                                    <div className="col-span-12 md:col-span-6">
                                                        <div className="relative w-full">
                                                            <ThumbsUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                                    value={field.value ? field.value.toString() : ""}
                                                                    disabled={!row.original?.package?.id && !row.original?.date_of_scuba}
                                                                >
                                                                    <SelectTrigger className="w-full bg-white pl-10">
                                                                        <SelectValue className="Poppins" placeholder="Select Slot">
                                                                            {
                                                                                dynamicSlots?.find(s => s.slot_id === Number(field.value))?.slot_time || "Select Slot"
                                                                            }
                                                                        </SelectValue>

                                                                    </SelectTrigger>
                                                                    <SelectContent className="border Poppins border-gray-200 bg-white">
                                                                        <SelectGroup>
                                                                            {dynamicSlots?.map((slot) => (
                                                                                <SelectItem key={slot.slot_id} value={slot.slot_id.toString()}>
                                                                                    {slot.slot_time} - Avaialbility ({slot.available})
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectGroup>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                        </div>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <Button type="submit" disabled={isLoading} className="mr-4 bg-[#509CDB] hover:bg-[#509CDB]">
                                            {isLoading ? (
                                                <div className="flex items-center">
                                                    Rescheduling
                                                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                                </div>
                                            ) : (
                                                "Reschedule"
                                            )}
                                        </Button>
                                        <Button type="button" disabled={isLoading} onClick={() => { setOpen(false) }}
                                            className="bg-[#152259] hover:bg-[#152259] text-white">
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
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
                {statusData === 'confirm' ?
                    <DropdownMenuContent align="end" className='border border-gray-200'>
                        <DropdownMenuItem
                            className="mb-1 Poppins"
                            onClick={() => {
                                setIsViewOpen(true);
                            }}
                        >
                            <Eye className="h-2 w-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="mb-1 Poppins"
                            onClick={() => {
                                setOpen(true);
                            }}
                        >
                            <RotateCcw className="h-2 w-2" /> Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="mb-1"
                            onClick={() => {
                                setStatus("cancel");
                                setConfirmationOpen(true);
                            }}
                        >
                            <X className="h-3 w-3" /> Cancel
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    : statusData === "cancel" ?
                        <DropdownMenuContent align="end" className='border border-gray-200'>
                            <DropdownMenuItem
                                className="mb-1 Poppins"
                                onClick={() => {
                                    setIsViewOpen(true);
                                }}
                            >
                                <Eye className="h-2 w-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="mb-1"
                                onClick={() => {
                                    setStatus("confirm");
                                    setConfirmationOpen(true);
                                }}
                            >
                                <Check className="h-2 w-2" /> Confirm
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        :
                        <DropdownMenuContent align="end" className='border border-gray-200'>
                            <DropdownMenuItem
                                className="mb-1 Poppins"
                                onClick={() => {
                                    setIsViewOpen(true);
                                }}
                            >
                                <Eye className="h-2 w-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="mb-1"
                                onClick={() => {
                                    setStatus("cancel");
                                    () => setConfirmationOpen(true);
                                }}
                            >
                                <X className="h-3 w-3" /> Cancel
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                }
            </DropdownMenu >
        </>
    )
}
