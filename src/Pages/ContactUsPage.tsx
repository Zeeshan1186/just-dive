"use client";

import { useForm } from "react-hook-form";
import banner from "../assets/images/cta.png";
import waves from "../assets/images/Waves.png";
import bluewaves from "../assets/images/Bluewave.png";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendContactForm } from "../services/apiService";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const formSchema = z.object({
    Name: z.string().min(1, 'Name is required'),
    EmailAddress: z.string().min(1, 'Email is required').email("Invalid email address"),
    phone: z.string()
        .min(1, "Phone number is required") // required check
        .regex(/^\d{10}$/, "Phone number must be 10 digits and contain only numbers"),
    message: z.string().min(1, 'Message is required'),
    policy: z.literal(true, {
        errorMap: () => ({ message: "Please accept the privacy policy" }),
    }),
});

const ContactUsPage = () => {
    type ContactFormData = z.infer<typeof formSchema>;
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            Name: "",
            EmailAddress: "",
            phone: "",
            message: "",
            policy: undefined,
        },
    });
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await sendContactForm(data);
            toast.success("Message sent successfully!");
            reset();
        } catch (error) {
            console.error("Submit Error:", error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Banner */}
            <div
                className="relative flex justify-center items-center h-[50vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <img src={waves} alt="Wave" className="w-10 mx-auto" />
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-6">
                        Contact Us
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 md:px-12 py-12 bg-gray-100">
                <div className="text-center mb-10">
                    <div className="mb-4">
                        <img src={bluewaves} alt="Wave" className="w-10 mx-auto" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl Trirong font-normal leading-tight">
                        We're Here to Help
                    </h1>
                </div>

                {/* Contact Info + Form */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-0">
                    {/* Left Section - Contact Info */}
                    <div className="w-full md:w-1/3 Poppins bg-gradient-to-b from-[#017ecc] to-[#2fafff] p-6 sm:p-8 text-white rounded-t-lg md:rounded-t-none md:rounded-l-lg">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Get in touch</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Visit us</h3>
                            <p className="text-sm">Golf Beach road, Matadahitlu,</p>
                            <p className="text-sm">Murdeshwar, Karnataka 581350</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Chat to us</h3>
                            <p className="text-sm">Our friendly team is here to help.</p>
                            <p className="text-sm">hello@paysphere.com</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Call us</h3>
                            <p className="text-sm">Mon-Fri from 8am to 5pm</p>
                            <p className="text-sm">087624 12121</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Social media</h3>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/" target="_blank">
                                    <Instagram className="cursor-pointer" /></a>
                                <a href="https://www.facebook.com/" target="_blank">
                                    <Facebook className="cursor-pointer" /></a>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Contact Form */}
                    <div className="w-full md:w-2/3 bg-white rounded-b-lg md:rounded-b-none md:rounded-r-lg p-4 sm:p-6 lg:p-8">
                        <form
                            className="space-y-6 Poppins"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            {/* Name & Email */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        {...register("Name")}
                                        className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm rounded-md"
                                    />
                                    {errors.Name && (
                                        <span className="text-red-500 text-sm">{errors.Name.message}</span>
                                    )}
                                </div>
                                <div className="w-full">
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        {...register("EmailAddress")}
                                        className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm rounded-md"
                                    />
                                    {errors.EmailAddress && (
                                        <span className="text-red-500 text-sm">{errors.EmailAddress.message}</span>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <input
                                    type="tel"
                                    placeholder="(+91) 0000-0000-00"
                                    {...register("phone")}
                                    className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm rounded-md"
                                />
                                {errors.phone && (
                                    <span className="text-red-500 text-sm">{errors.phone.message}</span>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <textarea
                                    placeholder="Tell us what we can help you with"
                                    {...register("message")}
                                    className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm rounded-md h-32"
                                ></textarea>
                                {errors.message && (
                                    <span className="text-red-500 text-sm">{errors.message.message}</span>
                                )}
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    {...register("policy")}
                                    className="w-4 h-4 mt-1"
                                />
                                <label className="text-sm text-gray-600">
                                    I’d like to receive more information about the company. I understand and agree to the
                                    <Link to={`/privacypolicy`} className="text-blue-500"> Privacy Policy</Link>.
                                </label>
                            </div>
                            {errors.policy && (
                                <span className="text-red-500 text-sm">{errors.policy.message}</span>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full sm:w-auto font-normal text-sm px-6 py-2 rounded-full transition flex items-center justify-center gap-2 ${(!isValid || loading)
                                    ? "bg-[#0191e9] text-white "
                                    : "bg-[#0191e9] text-white hover:text-[#0191e9] hover:bg-transparent border border-[#0191e9]"
                                    }`}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-500"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    "Send Message"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;
