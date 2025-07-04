import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { getactivePackages, getPackageSlotsByDate } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import type { IPackage } from '@/interface/package';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Check, File, Mail, Phone, ThumbsUp, User } from 'lucide-react';

const schema = z.object({
    fullName: z.string().min(1, "Name is required"),
    package_id: z.number().min(1, "Package is required"),
    whatsappNo: z.string().min(1, "Number is required").max(10, 'Number should be 10 digits'),
    email: z.string().min(1, "Email is required").email('Email should be valid'),
    slot: z.number().min(1, 'Slot is required'),
    age: z.number().min(1, "Age is required"),
    numberOfParticipants: z.number().min(1, "Number of person is required"),
    gender: z.string().min(1, "Gender is required"),
    nationality: z.string().min(1, "Nationality is required"),
    dateOfScuba: z.string().min(1, "Date is required"),
    document: z.any().optional(),
})

export default function AddAdminBooking() {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            fullName: "",
            package_id: undefined,
            whatsappNo: undefined,
            email: "",
            age: undefined,
            numberOfParticipants: undefined,
            gender: "",
            nationality: "",
            dateOfScuba: "",
        },
    });

    type FormData = z.infer<typeof schema>
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [dynamicSlots, setDynamicSlots] = useState<any[]>([]);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const selectedPackage = form.watch('package_id');
    const date = form.watch('dateOfScuba');

    const packageAPI = async () => {
        try {
            const res = await getactivePackages();
            if (res.data.status === HttpStatusCode.Ok) {
                setPackages(res.data.data);
            }
        } catch (error) {
            console.log('error occur in package:', error);
        }
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

    const onSubmit = async (data: FormData) => {
        const selectedSlot = dynamicSlots.find(slot => slot.slot_id === data.slot);

        if (selectedSlot && data.numberOfParticipants > selectedSlot.available) {
            form.setError("numberOfParticipants", {
                type: "manual",
                message: `Only ${selectedSlot.available} participant(s) allowed for this slot.`,
            });
            return; // ⛔ Stop here if validation fails
        }

        // ✅ Proceed with API submission
        // console.log("Validated successfully:", data);
    }

    useEffect(() => {
        packageAPI();
    }, []);

    useEffect(() => {
        fetchSlotsAndSeats();
    }, [selectedPackage, date]);

    return (
        <div className='mt-2'>
            <div className='text-center font-semibold text-2xl'>Add Booking</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-12 mb-6 mt-6 space-y-4">
                    {/* Package Name */}
                    <FormField
                        control={form.control}
                        name="package_id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <Select
                                            onValueChange={(value) => field.onChange(Number(value))}
                                            value={field.value ? field.value.toString() : ""}
                                        >
                                            <SelectTrigger className="w-full bg-white">
                                                <SelectValue className="Poppins" placeholder="Select Package" />
                                            </SelectTrigger>
                                            <SelectContent className="border Poppins border-gray-200 bg-white">
                                                <SelectGroup>
                                                    {packages?.map((item) => (
                                                        <SelectItem key={item.id} value={item.id.toString()}>
                                                            {item.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>

                        )}
                    />

                    {/* Date */}
                    <FormField
                        control={form.control}
                        name="dateOfScuba"
                        render={({ field }) => (
                            <FormItem className="mt-4 ">
                                <div className="col-span-12 md:col-span-6 ">
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
                                                    disabled={!selectedPackage && !date}
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

                    {/* Number of people */}
                    <FormField
                        control={form.control}
                        name="numberOfParticipants"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="relative w-full">
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    placeholder="Number Of People"
                                                    className="rounded-sm bg-white w-full "
                                                    value={field.value ?? ""}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        field.onChange(val === "" ? undefined : Number(val));
                                                    }}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="relative w-full">
                                            {/* Icon positioned inside input */}
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Name"
                                                    className="rounded-sm bg-white w-full pl-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Phone No */}
                    <FormField
                        control={form.control}
                        name="whatsappNo"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="relative w-full">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                                            <FormControl>
                                                <Input
                                                    placeholder="Enter WhatsApp No."
                                                    className="rounded-sm bg-white w-full pl-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="relative w-full">
                                            {/* Icon positioned inside input */}
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                                            <FormControl>
                                                <Input
                                                    placeholder="Enter Email"
                                                    className="rounded-sm bg-white w-full pl-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* age and gender */}
                    <div className='grid grid-cols-2 gap-3'>
                        <FormField
                            control={form.control}
                            name="age"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="gap-4">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="relative w-full">
                                                {/* Icon positioned inside input */}
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                                                <FormControl>
                                                    <Input
                                                        type='number'
                                                        placeholder="Enter Age"
                                                        className="rounded-sm bg-white w-full pl-10"
                                                        value={field.value ?? ""}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            field.onChange(val === "" ? undefined : Number(val));
                                                        }}
                                                    />
                                                </FormControl>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="gap-4">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="relative w-full">
                                                <FormControl>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(value)}
                                                        value={field.value || ""}
                                                    >
                                                        <SelectTrigger className="w-full bg-white">
                                                            <SelectValue className="Poppins" placeholder="Select Gender" />
                                                        </SelectTrigger>
                                                        <SelectContent className="border Poppins border-gray-200 bg-white">
                                                            <SelectGroup>
                                                                <SelectItem value="Male">Male</SelectItem>
                                                                <SelectItem value="Female">Female</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
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
                    </div>

                    {/* Nationality */}
                    <FormField
                        control={form.control}
                        name="nationality"
                        render={({ field }) => (
                            <FormItem>
                                <div className="gap-4">
                                    <div className="col-span-12 md:col-span-6">
                                        <div className="relative w-full">
                                            <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                                            <FormControl>
                                                <Input
                                                    placeholder="Nationality"
                                                    className="rounded-sm bg-white w-full pl-10"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </div>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Document Upload */}
                    <FormField
                        control={form.control}
                        name="document"
                        render={({ field: { onChange, ref } }) => (
                            <FormItem>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg"
                                        className="rounded-sm bg-white w-full p-2"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                onChange(file);        // Send file to RHF
                                                setDocumentFile(file); // Store in state
                                            }
                                        }}
                                        ref={ref}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <Button type='submit'>
                        Submit
                    </Button>
                </form>
            </Form>
        </div>
    )
}
