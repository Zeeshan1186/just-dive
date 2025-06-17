import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { ArrowUp, Loader2 } from "lucide-react"
import { addLocation, editLocation, getLocationById } from "@/services/apiService"
import { HttpStatusCode } from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import type { ILocation } from "@/interface/location"

const schema = z.object({
    location: z.string().min(1, "Location name is required"),
    address: z.string().min(1, "Address is required"),
})

type FormData = z.infer<typeof schema>

export default function EditLocation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<ILocation>();

    const addressById = async () => {
        try {
            const res = await getLocationById(Number(id));
            if (res.data.status === HttpStatusCode.Ok) {
                setLocation(res.data.data);
            }
        } catch (error) {
            console.log('error comes to get address by id', error);
        }
    }

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            location: location?.location_name,
            address: location?.address,
        },
    });

    useEffect(() => {
        if (location) {
            form.reset({
                location: location.location_name,
                address: location.address
            });
        }
    }, [location]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const res = await editLocation(data, Number(id));
            if (res.data.status === HttpStatusCode.Ok) {
                toast.success(res.data.message);
                navigate('/admin/location');
            }
        } catch (error) {
            console.log('error add location', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        addressById();
    }, []);

    return (
        <div className="py-4 px-8">
            <div className="text-[#181E4B] font-semibold text-lg Poppins">
                Edit Location
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 mb-6 mt-6 space-y-6">

                    {/* Location Name */}
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start md:gap-4 gap-3">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Enter Location Name *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Type Location Name"
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

                    {/* Address */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col md:flex-row md:items-start md:gap-4 gap-3">
                                    <FormLabel className="Poppins w-full md:w-[30%] pt-1.5 md:pt-2">
                                        Enter Address *
                                    </FormLabel>
                                    <div className="w-full md:w-[70%]">
                                        <FormControl>
                                            <Input
                                                placeholder="Enter Address Here"
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

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={isLoading} className="bg-[#509CDB] text-white">
                            Update {isLoading ? <Loader2 className="w-5 animate-spin" /> : <ArrowUp />}
                        </Button>
                        <Button type="button" disabled={isLoading} onClick={() => { navigate('/admin/location') }}
                            className="bg-[#152259] text-white">
                            Cancel
                        </Button>
                    </div>
                </form>


            </Form>
        </div>
    )
}
