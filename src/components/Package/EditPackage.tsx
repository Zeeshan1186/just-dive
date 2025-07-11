import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { editPackage, getLocations, getPackageById } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { IAddress } from '@/interface/address';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import type { IPackage } from '@/interface/package';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const packageSchema = z.object({
    image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Image size must be less than 5MB",
        })
        .optional()
        .or(z.literal(undefined)),
    name: z
        .string()
        .min(1, "Package name is required"),
    seats: z
        .coerce.number({ invalid_type_error: "Seat must be a number" })
        .min(1, "Seat cannot be negative or zero"),
    location: z
        .string()
        .min(1, "Dive sight is required"),
    price: z
        .coerce.number({ invalid_type_error: "Price must be a number" })
        .min(1, "Price cannot be negative or zero"),
    duration: z
        .coerce.number({ invalid_type_error: "Duration must be a number" })
        .min(1, "Duration cannot be negative or zero"),
    slots: z
        .array(z.object({
            time: z.string().min(1, "Slot time is required"),
            startTime: z.string().min(1, "Slot time is required"),
            endTime: z.string().min(1, "Slot time is required"),
        }))
        .min(1, "At least one slot is required"),
    schedule: z
        .array(z.object({
            title: z.string().min(1, "Schedule title is required"),
        }))
        .min(1, "At least one schedule item is required"),
    mustReads: z
        .array(
            z.object({
                description: z.string().optional(),
                photo: z
                    .union([
                        z.instanceof(File),
                        z.undefined(),
                        z.literal(null),
                    ])
                    .optional(),
                id: z.number().optional(),
                existing_photo: z.string().optional(),
            })
        )
        .optional(),
    whyChooseUs: z
        .array(z.object({
            title: z.string().min(1, "Title is required"),
            description: z.string().min(1, "Description is required"),
        }))
        .min(1, "At least one item is required"),
    note: z
        .array(z.object({
            title: z.string().min(1, "Note title is required"),
        }))
        .optional(),
    page_image: z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, {
            message: "Image size must be less than 5MB",
        })
        .optional()
        .or(z.literal(undefined)),
    services: z.string().optional(),
    iternary: z.string().optional(),
});

type FormData = z.infer<typeof packageSchema>

export default function EditPackage() {
    const { id } = useParams();
    const [packageData, setPackage] = useState<IPackage>();

    const form = useForm<FormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: packageData?.name,
            image: undefined,
            page_image: undefined,
            seats: undefined,
            location: "",
            price: undefined,
            duration: undefined,
            slots: [{ time: "", startTime: "", endTime: "" }],
            schedule: [{ title: "" }],
            mustReads: [{ description: "", photo: undefined, id: undefined, existing_photo: packageData?.mustReads?.[0]?.photo }],
            whyChooseUs: [{ title: "", description: "" }],
            note: [{ title: '' }],
            services: "",
            // vehicle: "",
            iternary: "",
        },
    });

    const parseTo24Hour = (timeStr: string) => {
        if (!timeStr) return "";
        const match = timeStr.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
        if (!match) return "";
        let hour = parseInt(match[1], 10);
        const minute = parseInt(match[2] || "00", 10);
        const ampm = match[3].toUpperCase();
        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;
        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    };

    console.log('packageData', packageData);
    console.log('form', form.getValues());
    useEffect(() => {
        if (packageData) {
            // slots
            const parsedSlots = packageData.slots.map(slot => {
                const [startRaw, endRaw] = slot.time.split("-").map(s => s.trim());
                return {
                    time: slot.time,
                    startTime: parseTo24Hour(startRaw),
                    endTime: parseTo24Hour(endRaw),
                };
            });

            form.setValue('name', packageData.name);
            form.setValue('location', packageData.location.toString());
            form.setValue('slots', parsedSlots);
            form.setValue('seats', packageData.seats);
            form.setValue('price', packageData.price);
            form.setValue('duration', packageData.duration);
            form.setValue('services', packageData.services);
            form.setValue('iternary', packageData.iternary);
            form.setValue('schedule', packageData.schedules.map(schedule => ({ title: schedule.title })));
            const mustRead = packageData.mustReads[0];
            // form.reset({
            //     ...form.getValues(),
            //     mustReads: [{
            //         description: mustRead?.description || ""
            //     }]
            // })
            form.setValue('mustReads', [{
                description: mustRead?.description || "",
            }]);
            form.setValue('whyChooseUs', packageData.whyChooseUs.map(item => ({
                title: item.title,
                description: item.description,
            })));
            form.setValue('note', packageData.notes.map(note => ({
                title: note.title,
            })));
        }
    }, [packageData])

    const [image, setImage] = useState<File | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageImage, setPageImage] = useState<File | undefined>(undefined);
    const [address, setAddress] = useState<IAddress[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pageFileInputRef = useRef<HTMLInputElement>(null);
    const mustReadFileInputRef = useRef<HTMLInputElement>(null);
    const startRefs = useRef<Array<HTMLInputElement | null>>([]);
    const endRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [mustReadImage, setMustReadImage] = useState<File | undefined>();
    const navigate = useNavigate();

    const handleClick = () => {
        fileInputRef.current?.click();
    };
    const handlePageImageClick = () => {
        pageFileInputRef.current?.click();
    };
    // extract control
    const { control } = form;

    // Field array for slots
    const {
        fields: slotFields,
        append: appendSlot,
        remove: removeSlot,
    } = useFieldArray({
        control,
        name: "slots",
    });

    // Field array for schedule
    const {
        fields: scheduleFields,
        append: appendSchedule,
        remove: removeSchedule,
    } = useFieldArray({
        control,
        name: "schedule",
    });

    // Why choose us
    const {
        fields: whyChooseUsFields,
        append: appendWhyChooseUs,
        remove: removeWhyChooseUs,
    } = useFieldArray({
        control,
        name: "whyChooseUs",
    });

    // note
    const {
        fields: noteFields,
        append: appendNote,
        remove: removeNote,
    } = useFieldArray({
        control,
        name: "note",
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            form.setValue('image', file);
            form.clearErrors('image');
        }
    };

    // Page image
    const handlePageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPageImage(file);
            form.setValue('page_image', file);
            form.clearErrors('image');
        }
    };

    // must read image
    const handleMustReadImageClick = () => {
        mustReadFileInputRef.current?.click();
    };

    const handleMustReadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMustReadImage(file);
            form.setValue("mustReads.0.photo", file, { shouldValidate: true });
            form.clearErrors("mustReads.0.photo");
        }
    };

    const handleMustReadRemoveImage = () => {
        setMustReadImage(undefined);
        form.setValue("mustReads.0.photo", undefined as any, { shouldValidate: true, shouldDirty: true });
        if (mustReadFileInputRef.current) mustReadFileInputRef.current.value = "";
    };

    const buildFormData = (data: any) => {
        const formData = new FormData();

        // Simple fields
        formData.append("name", data.name);
        formData.append("seats", data.seats.toString());
        formData.append("price", data.price.toString());
        formData.append("location", data.location);
        formData.append("duration", data.duration);
        formData.append("services", data.services);
        formData.append("iternary", data.iternary);

        // Image (single file)
        if (data.image instanceof File) {
            formData.append("package_image", data.image);
        }

        // Image (single file)
        if (data.page_image instanceof File) {
            formData.append("page_image", data.page_image);
        }

        // Slots array (strings like "09:00 to 10:00")
        data.slots?.forEach((slot: any, index: number) => {
            formData.append(`slots[${index}][time]`, slot.time);
        });

        // Schedule array
        data.schedule?.forEach((item: any, index: number) => {
            formData.append(`schedule[${index}][title]`, item.title);
        });

        // WhyChooseUs array
        data.whyChooseUs?.forEach((item: any, index: number) => {
            formData.append(`whyChooseUs[${index}][title]`, item.title);
            formData.append(`whyChooseUs[${index}][description]`, item.description);
        });

        data.mustReads?.forEach((item: any, index: number) => {
            const mustReadId = packageData?.mustReads[0]?.id;
            if (mustReadId !== undefined && mustReadId !== null) {
                formData.append(`mustReads[${index}][id]`, mustReadId.toString()); // ✅ Include ID
            }

            formData.append(`mustReads[${index}][description]`, item.description);
            if (item.photo instanceof File) {
                formData.append(`mustReads[${index}][photo]`, item.photo);
            } else {
                formData.append(`mustReads[${index}][existing_photo]`, packageData?.mustReads?.[0]?.photo ?? "");
            }
        });


        // note array
        data.note?.forEach((item: any, index: number) => {
            formData.append(`note[${index}][title]`, item.title);
        });

        return formData;
    };

    const onSubmit = async (data: any) => {
        setLoading(true);
        const formData = buildFormData(data);
        try {
            const res = await editPackage(Number(id), formData);
            if (res.data.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
                navigate('/admin/package')
            }
        } catch (error) {
            console.log('error addnig package', error);
        } finally {
            setLoading(false);
        }
    }

    const getLocation = async () => {
        const res = await getLocations();
        if (res.data.status === HttpStatusCode.Ok) {
            setAddress(res.data.data);
        }
    }

    const getPackage = async () => {
        const res = await getPackageById(Number(id));
        if (res.data.status === HttpStatusCode.Ok) {
            setPackage(res.data.data);
        }
    }

    useEffect(() => {
        getLocation();
        getPackage();
    }, []);

    return (
        <div className="py-4 px-8">
            <div className="text-[#181E4B] font-semibold text-xl Poppins">
                Add Package
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 mb-6 mt-6 space-y-6">
                    <div className="flex w-full">
                        {/* 30% empty space */}
                        <div className="w-[30%]"></div>

                        {/* 70% for the image upload */}
                        <div className="w-[70%] md:pr-40 pr-0">
                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="Poppins">Select and upload the files with your choice</FormLabel>
                                        <div
                                            className=" border border-[#2A85FF] mt-2 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                                            onClick={handleClick}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                ref={fileInputRef}
                                                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                                                onChange={handleFileChange}
                                            />
                                            {image || packageData?.package_image ? (
                                                <img
                                                    src={
                                                        image ? URL.createObjectURL(image) :
                                                            packageData?.package_image
                                                    } alt="Selected"
                                                    className="h-52 w-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center space-y-1 px-4 text-gray-500">
                                                    <div className="Poppins">File type is JPEG, PNG, JPG</div>
                                                    <div className="Poppins">Recommended File Size 240 X 350 Pixels</div>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                        <div className="mt-3 flex items-center justify-center">
                                            {/* {image && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-[#152259] mr-4 bg-white tracking-wider border-1 hover:cursor-pointer"
                                                    onClick={handleRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            )} */}
                                            <Button
                                                type="button"
                                                className="px-4 py-4 bg-[#509CDB] hover:bg-[#509CDB] font-medium border-1 hover:cursor-pointer"
                                                onClick={handleClick}
                                            >
                                                <Plus className="h-4 w-4 Poppins" /> Edit Product Image
                                            </Button>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />

                    {/* Package Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Enter Package Name *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type Package Name"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Location */}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Select Dive Sight *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full bg-white">
                                                <SelectValue className='Poppins' placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className='border Poppins border-gray-200 bg-white'>
                                                <SelectGroup >
                                                    {address?.map((addr) => (
                                                        <SelectItem key={addr.id} value={addr?.id.toString()}>{addr?.location_name}</SelectItem>
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

                    {/* Slots */}
                    <FormField
                        control={control}
                        name="slots"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Slots *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%] flex flex-col gap-2">
                                        {slotFields.map((slot, index) => {
                                            const startTime = form.watch(`slots.${index}.startTime` as const) || "";
                                            const endTime = form.watch(`slots.${index}.endTime` as const) || "";

                                            const formatTime = (time24: string) => {
                                                if (!time24) return "";
                                                const [hourStr, minute] = time24.split(":");
                                                let hour = parseInt(hourStr, 10);
                                                const ampm = hour >= 12 ? "PM" : "AM";
                                                hour = hour % 12 || 12;
                                                return `${hour}:${minute} ${ampm}`;
                                            };

                                            const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const newStart = e.target.value;
                                                const currentEnd = form.getValues(`slots.${index}.endTime`);
                                                form.setValue(`slots.${index}.startTime`, newStart);
                                                form.setValue(`slots.${index}.time`,
                                                    `${formatTime(newStart)} - ${formatTime(currentEnd)}`);
                                            };

                                            const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                                                const newEnd = e.target.value;
                                                const currentStart = form.getValues(`slots.${index}.startTime`);
                                                form.setValue(`slots.${index}.endTime`, newEnd);
                                                form.setValue(`slots.${index}.time`,
                                                    `${formatTime(currentStart)} - ${formatTime(newEnd)}`);
                                            };

                                            return (
                                                <div key={slot.id} className="flex items-center gap-2">
                                                    <FormField
                                                        key={slot.id}
                                                        control={form.control}
                                                        name={`slots.${index}.time`}
                                                        render={() => (
                                                            <FormItem>
                                                                <div className="flex items-center gap-2 w-full">
                                                                    {/* Start Time */}
                                                                    <Input
                                                                        ref={(el) => { startRefs.current[index] = el; }}
                                                                        type="time"
                                                                        name={`slots.${index}.startTime`}
                                                                        value={startTime}
                                                                        onClick={() => startRefs.current[index]?.showPicker?.()}
                                                                        onChange={handleStartTimeChange}
                                                                        className="w-[45%] bg-white"
                                                                    />

                                                                    <span className="text-sm">to</span>

                                                                    {/* End Time */}
                                                                    <Input
                                                                        ref={(el) => { endRefs.current[index] = el; }}
                                                                        type="time"
                                                                        name={`slots.${index}.endTime`}
                                                                        value={endTime}
                                                                        onClick={() => endRefs.current[index]?.showPicker?.()}
                                                                        onChange={handleEndTimeChange}
                                                                        className="w-[45%] bg-white"
                                                                    />

                                                                    {index !== 0 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeSlot(index)}
                                                                            className="text-red-500"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )
                                        })}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendSlot({ time: "", startTime: "", endTime: "" })}
                                            className="w-fit mt-1 rounded-md text-[#152259]"
                                        >
                                            <Plus className='h-3 w-3' /> Add More Slot
                                        </Button>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Seats */}
                    <FormField
                        control={form.control}
                        name="seats"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start ">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Seats *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder="Type Number Of Seats"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Price */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Price Per Person *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder="Price Per Person"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Duration */}
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Duration Of Package *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder="Enter Duration Of Package"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* services */}
                    <FormField
                        control={form.control}
                        name="services"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Services *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type Service"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Detail page image */}
                    <div className="flex w-full">
                        {/* 30% empty space */}
                        <div className="w-[30%] mt-6">
                            Upload Detail Page Image *
                        </div>

                        {/* 70% for the image upload */}
                        <div className="w-full md:w-[70%] pr-0 md:pr-40">
                            <FormField
                                control={form.control}
                                name="page_image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="Poppins">Select and upload the files with your choice</FormLabel>
                                        <div
                                            className=" border border-[#2A85FF] mt-1 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                                            onClick={handlePageImageClick}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                ref={pageFileInputRef}
                                                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                                                onChange={handlePageFileChange}
                                            />
                                            {pageImage || packageData?.page_image ? (
                                                <img
                                                    src={pageImage ?
                                                        URL.createObjectURL(pageImage) :
                                                        packageData?.page_image}
                                                    alt="Selected"
                                                    className="h-52 w-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center space-y-1 px-4 text-gray-500">
                                                    <div className="Poppins">File type is JPEG, PNG, JPG</div>
                                                    <div className="Poppins">Recommended File Size 700 X 400 Pixels</div>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                        <div className="mt-3 flex items-center justify-center">
                                            {/* {pageImage && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-[#152259] mr-4 bg-white tracking-wider border-1 hover:cursor-pointer"
                                                    onClick={handlePageRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            )} */}
                                            <Button
                                                type="button"
                                                className="px-4 py-4 bg-[#509CDB] hover:bg-[#509CDB] font-medium border-1 hover:cursor-pointer"
                                                onClick={handlePageImageClick}
                                            >
                                                <Plus className="h-4 w-4 Poppins" /> Add Image
                                            </Button>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Iternary */}
                    <FormField
                        control={form.control}
                        name="iternary"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Iternary *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type Iternary"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* schedule */}
                    <FormField
                        control={form.control}
                        name="schedule"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Schedule *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%] flex flex-col gap-3">
                                        {scheduleFields.map((fieldItem, index) => (
                                            <div key={fieldItem.id} className="flex gap-2 items-start">
                                                <FormControl className="w-full">
                                                    <Textarea
                                                        placeholder="Type Schedule"
                                                        {...form.register(`schedule.${index}.title`)}
                                                        className="bg-white w-full"
                                                    />
                                                </FormControl>
                                                {index !== 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeSchedule(index)}
                                                        className="text-red-500 mt-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendSchedule({ title: "" })}
                                            className="w-fit text-[#152259] rounded-md"
                                        >
                                            <Plus className='h-3 -3' /> Add More Schedule
                                        </Button>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* must read */}
                    <FormField
                        control={form.control}
                        name="mustReads"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Must Read *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%] flex flex-col gap-3">
                                        <FormControl>
                                            <React.Fragment>
                                                {/* Description */}
                                                <Textarea
                                                    placeholder="Enter description"
                                                    {...form.register("mustReads.0.description")}
                                                    className="rounded-sm bg-white w-full"
                                                />

                                                {/* Photo upload */}
                                                <FormField
                                                    control={form.control}
                                                    name="mustReads.0.photo"
                                                    render={() => (
                                                        <FormItem>
                                                            <FormLabel className="Poppins">Select and upload the files with your choice</FormLabel>
                                                            <div
                                                                className="border border-[#2A85FF] mt-1 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                                                                onClick={handleMustReadImageClick}
                                                            >
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg, image/png, image/jpg"
                                                                    ref={mustReadFileInputRef}
                                                                    className="absolute w-0 h-0 opacity-0 pointer-events-none"
                                                                    onChange={handleMustReadFileChange}
                                                                />
                                                                {mustReadImage || packageData?.mustReads?.[0]?.photo ? (
                                                                    <img
                                                                        src={
                                                                            mustReadImage ?
                                                                                URL.createObjectURL(mustReadImage) :
                                                                                packageData?.mustReads?.[0]?.photo
                                                                        }
                                                                        alt="Selected"
                                                                        className="h-52 w-full object-contain"
                                                                    />
                                                                ) : (
                                                                    <div className="text-center space-y-1 px-4 text-gray-500">
                                                                        <div className="Poppins">File type is JPEG, PNG, JPG</div>
                                                                        <div className="Poppins">Recommended File Size 280 X 380 Pixels</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <FormMessage />
                                                            <div className="mt-3 flex items-center justify-center">
                                                                {mustReadImage && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        className="text-[#152259] mr-4 bg-white tracking-wider border-1 hover:cursor-pointer"
                                                                        onClick={handleMustReadRemoveImage}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    type="button"
                                                                    className="px-4 py-4 bg-[#509CDB] hover:bg-[#509CDB] font-medium border-1 hover:cursor-pointer"
                                                                    onClick={handleMustReadImageClick}
                                                                >
                                                                    <Plus className="h-4 w-4 Poppins" /> Add Image
                                                                </Button>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </React.Fragment>
                                        </FormControl>
                                        {/* Show errors */}
                                        <FormMessage>
                                            {form.formState.errors.mustReads?.[0]?.description?.message ||
                                                form.formState.errors.mustReads?.[0]?.photo?.message}
                                        </FormMessage>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* why choose us */}
                    <FormField
                        control={form.control}
                        name="whyChooseUs"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Why Choose Us *
                                    </FormLabel>

                                    <div className="w-full md:w-[70%] flex flex-col gap-3">
                                        {whyChooseUsFields.map((fieldItem, index) => (
                                            <div key={fieldItem.id} className="flex flex-col gap-2  border-gray-200 rounded-md">
                                                {/* Title Input */}
                                                <FormField
                                                    control={form.control}
                                                    name={`whyChooseUs.${index}.title`}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Enter title" className="bg-white" />
                                                            </FormControl>
                                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Description Textarea */}
                                                <FormField
                                                    control={form.control}
                                                    name={`whyChooseUs.${index}.description`}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Textarea {...field} placeholder="Enter description" className="bg-white" />
                                                            </FormControl>
                                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                                        </FormItem>
                                                    )}
                                                />

                                                {/* Remove Button */}
                                                {index !== 0 && (
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeWhyChooseUs(index)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add More Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendWhyChooseUs({ title: "", description: "" })}
                                            className="w-fit text-[#152259] rounded-md"
                                        >
                                            <Plus className="h-3 w-3 mr-1" /> Add More
                                        </Button>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* note */}
                    <FormField
                        control={form.control}
                        name="note"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Note *
                                    </FormLabel>

                                    <div className="w-full md:w-[70%] flex flex-col gap-3">
                                        {noteFields.map((fieldItem, index) => (
                                            <div key={fieldItem.id} className="flex gap-2 items-start ">
                                                {/* Title Input */}
                                                <div className='w-full'>
                                                    <FormField
                                                        control={form.control}
                                                        name={`note.${index}.title`}
                                                        render={({ field, fieldState }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input {...field} placeholder="Enter note" className="bg-white" />
                                                                </FormControl>
                                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                {/* Remove Button */}
                                                {index !== 0 && (
                                                    <div className="flex justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeNote(index)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add More Button */}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendNote({ title: "" })}
                                            className="w-fit text-[#152259] rounded-md"
                                        >
                                            <Plus className="h-3 w-3 mr-1" /> Add More
                                        </Button>

                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit"
                            disabled={loading}
                            className="bg-[#509CDB] hover:bg-[#509CDB] hover:cursor-pointer text-white">

                            {loading ? <div className='flex items-center'> Update <Loader2 className="w-5 ml-2 animate-spin" /></div> : "Update"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
