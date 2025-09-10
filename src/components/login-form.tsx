import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { HTTP_CODE } from "@/constants/http-codes";
import { GENERIC_ERROR_MESSAGE } from "@/constants/error-message";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { login } from "@/services/apiService";

const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email("Invalid email address"),
    password: z.string().min(1, 'Password is required'),
})

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"form">) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const validateForm = async () => {
        if (form.formState.isValid) {
            form.handleSubmit(onSubmit)();
        }
    }

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        setIsLoading(true);
        try {
            const response = await login(values);
            if (response?.data?.status === HTTP_CODE.BAD_REQUEST) {
                toast.error(response?.data?.error);
            } else {
                const token = response?.data?.access_token;
                localStorage.setItem("token", `Bearer ${token}`);
                toast.success("Login successfully");
                form.reset();
                navigate('/admin/dashboard');
            }
        } catch (error) {
            toast.error(GENERIC_ERROR_MESSAGE);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
                <div className="w-full flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl Poppins font-bold">Login to your account</h1>
                    <p className="text-balance Poppins text-[13px] text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} placeholder="abc@example.com" />
                                    </FormControl>
                                    <FormMessage className=" text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                        </div>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password"
                                        />
                                    </FormControl>
                                    <FormMessage className=" text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* <div
            className="pt-0 mt-0 flex justify-end hover:text-blue-600 hover:cursor-pointer hover:underline"
            onClick={() => { navigate('/forgot-password'); }}
          >
            Forgot password
          </div> */}
                    <Button type="submit"
                        disabled={isLoading}
                        className="w-full mr-5 px-10 py-3 uppercase font-semibold tracking-widest border-1 bg-primary hover:cursor-pointer"
                        onClick={() => validateForm()}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </div>
            </form>
        </Form>
    )
}
