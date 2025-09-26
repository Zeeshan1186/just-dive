import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { addPackage, getLocations } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { IAddress } from '@/interface/address';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const packageSchema = z.object({
    image: z
        .custom<File | undefined>((val) => val instanceof File, {
            message: "Image is required",
        })
        .refine((file) => file && file.size <= MAX_FILE_SIZE, {
            message: "Image size must be less than 5MB",
        }),
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
        .custom<File | undefined>((val) => val instanceof File, {
            message: "Detail page image is required",
        })
        .refine((file) => file && file.size <= MAX_FILE_SIZE, {
            message: "Image size must be less than 5MB",
        }),
    services: z.string().optional(),
    // vehicle: z.string().optional(),
    iternary: z.string().optional(),
});

type FormData = z.infer<typeof packageSchema>;

export default function AddPackage() {
    const form = useForm<FormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: "",
            image: undefined,
            page_image: undefined,
            seats: undefined,
            location: "",
            price: undefined,
            duration: undefined,
            slots: [{ time: "" }],
            schedule: [{ title: "" }],
            mustReads: [{ description: "", photo: undefined }],
            whyChooseUs: [{ title: "", description: "" }],
            note: [{ title: '' }],
            services: "",
            // vehicle: "",
            iternary: "",
        },
    });

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

    const handleRemoveImage = () => {
        setImage(undefined);
        form.setValue('image', undefined, { shouldValidate: true, shouldDirty: true });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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

    const handlePageRemoveImage = () => {
        setPageImage(undefined);
        form.setValue('page_image', undefined, { shouldValidate: true, shouldDirty: true });
        if (pageFileInputRef.current) {
            pageFileInputRef.current.value = "";
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
        // formData.append("vehicle", data.vehicle);
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

        // MustReads (handle file + description)
        data.mustReads?.forEach((item: any, index: number) => {
            formData.append(`mustReads[${index}][description]`, item.description);
            if (item.photo instanceof File) {
                formData.append(`mustReads[${index}][photo]`, item.photo);
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
            const res = await addPackage(formData);
            if (res.data.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
                navigate('/admin/package');
            }
        } catch (error) {
            console.log('error addnig package', error);
        } finally {
            setLoading(false);
        }
    };

    const getLocation = async () => {
        const res = await getLocations();
        if (res.data.status === HttpStatusCode.Ok) {
            setAddress(res.data.data);
        }
    };

    function formatTime(time24: string) {
        if (!time24) return "";
        const [hourStr, minute] = time24.split(":");
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <div className="py-4 px-4 sm:px-6 lg:px-8">
            <div className="text-[#181E4B] font-semibold text-lg sm:text-xl Poppins">
                Add Package
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-2 sm:px-4 mb-6 mt-6 space-y-6"
                >
                    {/* Image Upload */}
                    <div className="flex flex-col md:flex-row w-full">
                        {/* Empty space on desktop */}
                        <div className="hidden md:block w-[30%]"></div>

                        {/* Image upload */}
                        <div className="w-full md:w-[70%] md:pr-40">
                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="Poppins">
                                            Select and upload the files with your choice
                                        </FormLabel>
                                        <div
                                            className="border border-[#2A85FF] mt-2 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                                            onClick={handleClick}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                ref={fileInputRef}
                                                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                                                onChange={handleFileChange}
                                            />
                                            {image ? (
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Selected"
                                                    className="h-52 w-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-center space-y-1 px-4 text-gray-500">
                                                    <div className="Poppins">
                                                        File type is JPEG, PNG, JPG
                                                    </div>
                                                    <div className="Poppins">
                                                        Recommended File Size 240 X 350 Pixels
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <FormMessage />
                                        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                                            {image && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-[#152259] bg-white tracking-wider border hover:cursor-pointer"
                                                    onClick={handleRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                className="px-4 py-2 bg-[#509CDB] hover:bg-[#509CDB] font-medium border hover:cursor-pointer"
                                                onClick={handleClick}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add Package Image
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
                                                placeholder="Type package name"
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
                                                <SelectValue
                                                    className="Poppins"
                                                    placeholder="Select a dive sight"
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="border Poppins border-gray-200 bg-white">
                                                <SelectGroup>
                                                    {address?.map((addr) => (
                                                        <SelectItem
                                                            key={addr.id}
                                                            value={addr?.id.toString()}
                                                        >
                                                            {addr?.location_name}
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

                    {/* Slots */}
                    <FormField
                        control={control}
                        name="slots"
                        render={() => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Slots *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%] flex flex-col gap-2">
                                        {slotFields.map((slot, index) => (
                                            <div
                                                key={slot.id}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
                                            >
                                                <FormField
                                                    key={slot.id}
                                                    control={form.control}
                                                    name={`slots.${index}.time`}
                                                    render={() => (
                                                        <FormItem>
                                                            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                                                                <Input
                                                                    ref={(el) => {
                                                                        startRefs.current[index] = el;
                                                                    }}
                                                                    type="time"
                                                                    onClick={() =>
                                                                        startRefs.current[
                                                                            index
                                                                        ]?.showPicker?.()
                                                                    }
                                                                    onChange={(e) => {
                                                                        const start = e.target.value;
                                                                        const rawEnd =
                                                                            form.getValues(
                                                                                `slots.${index}.time`
                                                                            )?.split(" - ")[1] || "";
                                                                        const formattedEnd =
                                                                            rawEnd.includes("AM") ||
                                                                                rawEnd.includes("PM")
                                                                                ? rawEnd
                                                                                : formatTime(rawEnd);
                                                                        const formatted =
                                                                            formatTime(start) +
                                                                            " - " +
                                                                            formattedEnd;
                                                                        form.setValue(
                                                                            `slots.${index}.time`,
                                                                            formatted
                                                                        );
                                                                    }}
                                                                    className="w-full sm:w-[45%] bg-white"
                                                                />
                                                                <span className="text-sm">to</span>
                                                                <Input
                                                                    ref={(el) => {
                                                                        endRefs.current[index] = el;
                                                                    }}
                                                                    type="time"
                                                                    onClick={() =>
                                                                        endRefs.current[
                                                                            index
                                                                        ]?.showPicker?.()
                                                                    }
                                                                    onChange={(e) => {
                                                                        const end = e.target.value;
                                                                        const rawStart =
                                                                            form.getValues(
                                                                                `slots.${index}.time`
                                                                            )?.split(" - ")[0] || "";
                                                                        const formattedStart =
                                                                            rawStart.includes("AM") ||
                                                                                rawStart.includes("PM")
                                                                                ? rawStart
                                                                                : formatTime(rawStart);
                                                                        const formatted =
                                                                            formattedStart +
                                                                            " - " +
                                                                            formatTime(end);
                                                                        form.setValue(
                                                                            `slots.${index}.time`,
                                                                            formatted
                                                                        );
                                                                    }}
                                                                    className="w-full sm:w-[45%] bg-white"
                                                                />
                                                                {index !== 0 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeSlot(index)
                                                                        }
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
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => appendSlot({ time: "" })}
                                            className="w-fit mt-1 rounded-md text-[#152259]"
                                        >
                                            <Plus className="h-3 w-3 mr-1" /> Add More Slot
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
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Seats *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Type number of seats"
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
                                                placeholder="Price per person"
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
                                                placeholder="Enter duration of package in minutes"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                            {/* <div className='text-red-600'>Note: Enter time in minutes</div> */}
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
                                        Services
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type service"
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

                    {/* vehicle */}
                    {/* <FormField
                        control={form.control}
                        name="vehicle"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start gap-y-2">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        vehicle *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type vehicle"
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    /> */}

                    {/* Detail page image */}
                    <div className="flex flex-col md:flex-row w-full">
                        {/* 30% Label */}
                        <div className="w-full md:w-[30%] mt-6 text-base sm:text-lg">
                            Upload Detail Page Image *
                        </div>

                        {/* 70% Image Upload */}
                        <div className="w-full md:w-[70%] md:pr-40">
                            <FormField
                                control={form.control}
                                name="page_image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="Poppins">
                                            Select and upload the files with your choice
                                        </FormLabel>
                                        <div
                                            className="border border-[#2A85FF] mt-1 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50"
                                            onClick={handlePageImageClick}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                ref={pageFileInputRef}
                                                className="absolute w-0 h-0 opacity-0 pointer-events-none"
                                                onChange={handlePageFileChange}
                                            />
                                            {pageImage ? (
                                                <img
                                                    src={URL.createObjectURL(pageImage)}
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
                                        <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                                            {pageImage && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-[#152259] bg-white tracking-wider border hover:cursor-pointer"
                                                    onClick={handlePageRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                className="px-4 py-2 bg-[#509CDB] hover:bg-[#509CDB] font-medium border hover:cursor-pointer"
                                                onClick={handlePageImageClick}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add Image
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
                                                placeholder="Type iternary"
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
                                                        placeholder="Type schedule"
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
                                        Package Includes *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%] flex flex-col gap-3">
                                        <FormControl>
                                            <>
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
                                                                {mustReadImage ? (
                                                                    <img
                                                                        src={URL.createObjectURL(mustReadImage)}
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
                                            </>
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
                                            <div key={fieldItem.id} className="flex gap-2 items-start">
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

                            {loading ? <Loader2 className="w-5 animate-spin" /> : "Submit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
