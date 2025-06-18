import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { getLocations } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { IAddress } from '@/interface/address';

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
        .number({ invalid_type_error: "Seat must be a number" })
        .min(1, "Seat is required")
        .transform((val) => Number(val)),
    location: z
        .string()
        .min(1, "Dive site is required"),
    price: z
        .number({ invalid_type_error: "Price must be a number" })
        .min(1, "Price is required")
        .transform((val) => Number(val)),
    duration: z
        .number({ invalid_type_error: "Duration must be a number" })
        .min(1, "Duration is required")
        .transform((val) => Number(val)),
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
        .array(z.object({
            description: z.string().min(1, "Description is required"),
            photo: z.string().min(1, "Photo is required"),
        }))
        .optional(),
    whyChooseUs: z
        .array(z.object({
            title: z.string().min(1, "Title is required"),
            description: z.string().min(1, "Description is required"),
        }))
        .optional(),
    note: z
        .array(z.object({
            title: z.string().min(1, "Note title is required"),
        }))
        .optional(),
    services: z.string().optional(),
    vehicle: z.string().optional(),
    iternary: z.string().optional(),
});

type FormData = z.infer<typeof packageSchema>

export default function AddPackage() {
    const form = useForm<FormData>({
        resolver: zodResolver(packageSchema),
        defaultValues: {
            name: "",
            image: undefined,
            seats: undefined,
            location: "",
            price: undefined,
            duration: undefined,
            slots: [{ time: "" }],
            schedule: [{ title: "" }],
            mustReads: [],
            whyChooseUs: [],
            note: [],
            services: "",
            vehicle: "",
            iternary: "",
        },
    });

    const [image, setImage] = useState<File | undefined>(undefined);
    const [address, setAddress] = useState<IAddress[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleClick = () => {
        fileInputRef.current?.click();
    };

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

    const onSubmit = async (data: any) => {
        console.log('data', data);
    }

    const getLocation = async () => {
        const res = await getLocations();
        if (res.data.status === HttpStatusCode.Ok) {
            setAddress(res.data.data);
        }
    }


    useEffect(() => {
        getLocation();
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
                        <div className="w-[70%] pr-40">
                            <FormField
                                control={form.control}
                                name="image"
                                render={() => (
                                    <FormItem>
                                        <FormLabel className="Poppins">Select and upload the files with your choice</FormLabel>
                                        <div
                                            className=" border border-[#2A85FF] mt-2 h-52 rounded-2xl border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative bg-gray-50"
                                            onClick={handleClick}
                                        >
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png, image/jpg"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                            {image ? (
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt="Selected"
                                                    className="max-h-full max-w-full object-contain"
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
                                            {image && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="text-[#152259] mr-4 bg-white tracking-wider border-1 hover:cursor-pointer"
                                                    onClick={handleRemoveImage}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                className="px-4 py-4 bg-[#509CDB] hover:bg-[#509CDB] font-medium border-1 hover:cursor-pointer"
                                                onClick={handleClick}
                                            >
                                                <Plus className="h-4 w-4 Poppins" /> Add Product Image
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
                                <div className="flex flex-col md:flex-row md:items-start ">
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
                                <div className="flex flex-col md:flex-row md:items-start ">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Enter Package Name *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue className='Poppins' placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className='border Poppins border-gray-200'>
                                                <SelectGroup >
                                                    {address?.map((addr) => (
                                                        <SelectItem key={addr.id} value={addr?.id.toString()}>{addr?.location_name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit"
                            // disabled={isLoading}
                            className="bg-[#509CDB] text-white">
                            Submit
                            {/* {isLoading ? <Loader2 className="w-5 animate-spin" /> : <ArrowUp />} */}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
