import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Button } from "../ui/button"
import { ArrowUp, Loader2 } from "lucide-react"
import { addCoupon, getPackages } from "@/services/apiService"
import { HttpStatusCode } from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import type { IPackage } from "@/interface/package"
import { Input } from "../ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { toast } from "sonner"

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    package_id: z.string().min(1, "Package is required"),
    discount: z.number().min(1, "Discount is required").max(100, 'Discount cannot more than 100'),
    validity: z.string().min(1, "Duration is required"),
    times_use: z.string().min(1, "Validity is requried"),
})

type FormData = z.infer<typeof schema>

export default function AddCoupon() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [validityType, setValidityType] = useState("");
    const [TimesUseType, setTimesUseType] = useState("");

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            package_id: "",
            discount: undefined,
            validity: "",
            times_use: "",
        },
    });

    // custom name
    const couponPrefixes = ['WELCOME', 'NEWUSER', 'FESTIVE', 'SUMMER', 'RENTAL', 'BONUS', 'WINTER', 'OFFER', 'FLASH', 'LIMITED'];
    const couponActions = ['DEAL', 'SAVE', 'OFF', 'DISCOUNT', 'PROMO', 'BOOST'];

    function generateCouponCode() {
        const prefix = couponPrefixes[Math.floor(Math.random() * couponPrefixes.length)];
        const action = couponActions[Math.floor(Math.random() * couponActions.length)];
        const amount = Math.floor(Math.random() * 41 + 10); // generates number between 10–50
        return `${prefix}${action}${amount}`; // e.g., SUMMERDEAL25
    }


    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const res = await addCoupon(data);
            if (res.data.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
                navigate('/admin/coupon');
            }
        } catch (error) {
            console.log('error add location', error);
        } finally {
            setIsLoading(false);
        }
    }

    const allPackages = async () => {
        try {
            const res = await getPackages();
            if (res.data.status === HttpStatusCode.Ok) {
                setPackages(res.data.data);
            }
        } catch (error) {
            console.log('error comes in packages: ', error);
        }
    }

    useEffect(() => {
        allPackages();
    }, []);

    return (
        <div className="py-4 px-8">
            <div className="text-[#181E4B] font-semibold text-lg Poppins">
                Create Promo Code
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 mb-6 mt-6 space-y-6">

                    {/* Pckage Name */}
                    <FormField
                        control={form.control}
                        name="package_id"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-12 gap-4">
                                    <FormLabel className="col-span-12 md:col-span-3  Poppins">
                                        Select Package *
                                    </FormLabel>
                                    <div className="col-span-12 md:col-span-6">
                                        <Select
                                            onValueChange={(value) => field.onChange(value)}
                                            value={field.value ?? ""}
                                        >
                                            <SelectTrigger className="w-full bg-white">
                                                <SelectValue className="Poppins" placeholder="Select a category" />
                                            </SelectTrigger>

                                            <SelectContent className="border Poppins border-gray-200 bg-white">
                                                <SelectGroup>
                                                    <SelectItem value="0">All</SelectItem>
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
                                    <div className="col-span-12 md:col-span-3 flex items-center justify-end">
                                    </div>
                                </div>
                            </FormItem>

                        )}
                    />

                    {/* Name */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-12 gap-4">
                                    <FormLabel className="col-span-12 md:col-span-3 Poppins">
                                        Name *
                                    </FormLabel>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormControl>
                                            <Input
                                                placeholder=""
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                    <div className="col-span-12 md:col-span-3 flex items-center justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="text-xs cursor-pointer"
                                            onClick={() => {
                                                const coupon = generateCouponCode();
                                                form.setValue("name", coupon, { shouldValidate: true });
                                            }}
                                        >
                                            Auto Generate
                                        </Button>
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Discount */}
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid grid-cols-12 gap-4">
                                    <FormLabel className="col-span-12 md:col-span-3 Poppins">
                                        Discount *
                                    </FormLabel>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder=""
                                                className="rounded-sm bg-white w-full"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.valueAsNumber;
                                                    field.onChange(isNaN(value) ? undefined : value);
                                                }} />
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                    <div className="col-span-12 md:col-span-3 flex items-center justify-end">
                                        In Percentage (%)
                                    </div>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* Validity */}
                    <FormField
                        control={form.control}
                        name="validity"
                        render={() => (
                            <FormItem>
                                <div className="grid grid-cols-12 gap-4">
                                    <FormLabel className="col-span-12 md:col-span-3">Valid Until *</FormLabel>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormControl>
                                            <RadioGroup
                                                className="flex flex-row gap-6"
                                                value={validityType || undefined}
                                                onValueChange={(value) => {
                                                    setValidityType(value);
                                                    if (value === "life_time") {
                                                        form.setValue("validity", "life_time");
                                                    } else {
                                                        form.setValue("validity", ""); // reset input for limited
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem className="bg-white" value="life_time" id="r2" />
                                                    <Label htmlFor="r2">Life Time</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem className="bg-white" value="limited" id="r3" />
                                                    <Label htmlFor="r3">Limited Duration</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>

                                {/* Show input only if "limited" is selected */}
                                {validityType === "limited" && (
                                    <FormField
                                        control={form.control}
                                        name="validity"
                                        render={({ field }) => (
                                            <div className="grid grid-cols-12 mt-3">
                                                <div className="col-span-12 md:col-span-3" />
                                                <div className="col-span-12 md:col-span-6">
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter duration (e.g. 30 days)"
                                                            className="rounded-sm bg-white w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        )}
                                    />
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Number use */}
                    <FormField
                        control={form.control}
                        name="times_use"
                        render={() => (
                            <FormItem>
                                <div className="grid grid-cols-12 gap-4">
                                    <FormLabel className="col-span-12 md:col-span-3">Usage Count *</FormLabel>
                                    <div className="col-span-12 md:col-span-6">
                                        <FormControl>
                                            <RadioGroup
                                                className="flex flex-row gap-6"
                                                value={TimesUseType}
                                                onValueChange={(value) => {
                                                    setTimesUseType(value);
                                                    if (value === "life_time") {
                                                        form.setValue("times_use", "life_time");
                                                    } else {
                                                        form.setValue("times_use", ""); // reset input for limited
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem className="bg-white" value="life_time" id="t2" />
                                                    <Label htmlFor="t2">Unlimited</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem className="bg-white" value="limited" id="t3" />
                                                    <Label htmlFor="t3">Limited Duration</Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </div>
                                </div>

                                {/* Show input only if "limited" is selected */}
                                {TimesUseType === "limited" && (
                                    <FormField
                                        control={form.control}
                                        name="times_use"
                                        render={({ field }) => (
                                            <div className="grid grid-cols-12 mt-3">
                                                <div className="col-span-12 md:col-span-3" />
                                                <div className="col-span-12 md:col-span-6">
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            placeholder="Enter validity (e.g. 30 times)"
                                                            className="rounded-sm bg-white w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        )}
                                    />
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={isLoading} className="bg-[#509CDB] cursor-pointer text-white">
                            Submit {isLoading ? <Loader2 className="w-5 animate-spin" /> : <ArrowUp />}
                        </Button>
                        <Button type="button" disabled={isLoading} onClick={() => { navigate('/admin/coupon') }}
                            className="bg-[#152259] cursor-pointer text-white">
                            Cancel
                        </Button>
                    </div>
                </form>


            </Form>
        </div>
    )
}
