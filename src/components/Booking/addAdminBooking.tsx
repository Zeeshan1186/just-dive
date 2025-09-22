import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { applyCoupon, getactivePackages, getPackageById, getPackageSlotsByDate, postBooking } from '@/services/apiService';
import { HttpStatusCode } from 'axios';
import type { IPackage } from '@/interface/package';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { Input } from '../ui/input';
import { Check, Loader2, Mail, Phone, ThumbsUp, User } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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
});

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

    type FormData = z.infer<typeof schema>;
    const navigate = useNavigate();
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [dynamicSlots, setDynamicSlots] = useState<any[]>([]);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    const [subtotal, setSubtotal] = useState("0.00");
    const [discount, setDiscount] = useState("0.00");
    const [couponCode, setCouponCode] = useState("");
    const [grandTotal, setGrandTotal] = useState("0.00");
    const [couponId, setCouponId] = useState<Number | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [applyingCoupon,] = useState(false);
    const [couponError, setCouponError] = useState("");
    const date = form.watch('dateOfScuba');
    const selectedPackage = form.watch('package_id');
    const participants = form.watch('numberOfParticipants');

    const summaryData = [
        { label: "Subtotal", value: subtotal },
        { label: "Convenience fee", value: "0.00" },
        { label: "GST", value: "0.00" },
        { label: "Discount", value: discount },
        { label: "Grand Total", value: grandTotal },
    ];

    useEffect(() => {
        if (!selectedPackage) return;

        const selectedPackageData = packages.find(pkg => pkg.id === selectedPackage);
        if (!selectedPackageData) return;

        const pricePerPerson = Number(selectedPackageData.price) || 0;
        const total = pricePerPerson * participants;

        setSubtotal(total.toFixed(2));
        setDiscount("0.00");
        setGrandTotal(total.toFixed(2));
    }, [selectedPackage, packages, participants]);

    // apply coupon
    const handleApplyCoupon = () => {

        if (!selectedPackage || !participants || !couponCode) {
            console.warn("Missing data to apply coupon");
            return;
        }

        const packageId = Number(selectedPackage);
        const participantCount = participants;

        getPackageById(packageId).then((res) => {
            const pricePerPerson = Number(res.data?.data?.price || 0);
            const total = pricePerPerson * participantCount;

            // Set subtotal regardless of coupon
            setSubtotal(total.toFixed(2));

            applyCoupon(packageId, couponCode, participantCount)
                .then((couponRes) => {
                    const discountedPrice = Number(couponRes?.data?.discounted_price || total);
                    const discountAmount = total - discountedPrice;

                    setDiscount(discountAmount.toFixed(2));
                    setGrandTotal(discountedPrice.toFixed(2));
                    setCouponId(couponRes?.data?.data?.id);
                    setCouponError("");
                })
                .catch((err) => {
                    console.error("Coupon apply failed:", err);
                    setCouponError("Invalid or expired coupon code.");
                    setDiscount("0.00");
                    setGrandTotal(total.toFixed(2));
                });
        });
    };

    const packageAPI = async () => {
        try {
            const res = await getactivePackages();
            if (res.data.status === HttpStatusCode.Ok) {
                setPackages(res.data.data);
            }
        } catch (error) {
            console.log('error occur in package:', error);
        }
    };

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
            return;
        }
        setIsLoading(true);
        try {
            // ✅ Proceed with API submission
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("package_id", data.package_id.toString());
            formData.append("whatsappNo", data.whatsappNo);
            formData.append("email", data.email);
            formData.append("age", data.age.toString());
            formData.append("gender", data.gender);
            formData.append("nationality", data.nationality);
            if (documentFile) {
                formData.append("document", documentFile);
            }
            if (couponId) {
                formData.append("coupon_id", couponId.toString());
            }
            const originalDate = new Date(data.dateOfScuba);
            const dateOfScubaFormattedDate = format(originalDate, "d/M/yyyy");
            formData.append("dateOfScuba", dateOfScubaFormattedDate);
            formData.append("slot", data.slot.toString());
            formData.append("is_admin_booking", "1");
            formData.append("numberOfParticipants", data.numberOfParticipants.toString());
            formData.append("price", grandTotal);
            const response = await postBooking(formData);
            if (response?.data.status === HttpStatusCode.Ok) {
                toast.success(response?.data.message);
                navigate('/admin/booking');
            }
        } catch (error) {
            console.log('error occur in booking', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                                                    "w-full justify-start cursor-pointer text-left font-normal bg-white",
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

                    {/* Email */}
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

                    <div>
                        <div className="flex justify-center bg-gradient-to-r from-[#c5f5fa33] to-[#93e7ef33] items-center border-1 border-[#8DD5DC33] rounded-md p-3">
                            <input
                                type="text"
                                placeholder="Promo Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                disabled={applyingCoupon}
                            />

                            {applyingCoupon ? (
                                <div className="ml-3 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <button
                                    className="text-sm font-bold cursor-pointer text-[#058EBA] Poppins ml-3"
                                    type="button"
                                    onClick={handleApplyCoupon}
                                >
                                    Apply
                                </button>
                            )}
                        </div>

                        {couponError && (
                            <p className="text-sm text-red-500 mt-1">{couponError}</p>
                        )}
                    </div>

                    {(selectedPackage && participants) &&
                        <div className="w-full mx-auto border border-gray-200 rounded-lg overflow-hidden p-4 bg-white">
                            <div className="grid grid-cols-3 font-semibold text-sm text-gray-700 border-b pb-2 mb-2">
                                <span>Pakage Details</span>
                                <span className="text-center"></span>
                                <span className="text-right">Amount</span>
                            </div>

                            {summaryData.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 py-1 text-sm text-gray-600">
                                    <span>{item.label}</span>
                                    <span className="text-center">—</span>
                                    <span className="text-right">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    }

                    <div className=''>
                        <Button type="submit" disabled={isLoading} className="mr-4 cursor-pointer bg-[#509CDB] hover:bg-[#509CDB]">
                            {isLoading ? (
                                <div className="flex items-center">
                                    Submitting
                                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button type="button" disabled={isLoading} onClick={() => { navigate('/admin/booking'); }}
                            className="bg-[#152259] cursor-pointer hover:bg-[#152259] text-white">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
