"use client";

import { useForm } from "react-hook-form";
import banner from "../assets/images/cta.png";
import waves from "../assets/images/Waves.png";
import bluewaves from "../assets/images/Bluewave.png";
import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactUsPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data: any) => {
        console.log("Form Data:", data);
        reset(); // optional reset after submit
    };

    return (
        <>
            <div
                className="relative flex justify-center items-center h-[50vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <img src={waves} alt="Wave" className="w-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-6">
                        Contact Us
                    </h1>
                </div>
            </div>

            <div className=" px-12 py-12  bg-gray-100">
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={bluewaves} alt="" className="w-10" />
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl Trirong md:text-4xl font-normal leading-tight mb-6">
                        We're Here to Help
                    </h1>
                </div>
                {/* Left Section */}
                <div className="flex flex-col md:flex-row mt-4">
                    <div className="w-full md:w-1/3 Poppins bg-gradient-to-b from-[#a0822d] to-[#dabc6b] p-8 text-white">
                        <h2 className="text-2xl font-semibold mb-4">Get in touch</h2>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Visit us</h3>
                            <p className="text-sm">Come say hello at our office HQ.</p>
                            <p className="text-sm">67 Wisteria Way, Croydon South VIC 3136 AU</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Chat to us</h3>
                            <p className="text-sm">Our friendly team is here to help.</p>
                            <p className="text-sm">hello@paysphere.com</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-lg font-medium">Call us</h3>
                            <p className="text-sm">Mon-Fri from 8am to 5pm</p>
                            <p className="text-sm">(+995) 555-55-55-55</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-2">Social media</h3>
                            <div className="flex space-x-4">
                                <Instagram className="cursor-pointer" />
                                <Facebook className="cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="w-full md:w-2/3 p-6 sm:p-8 bg-white rounded-r-lg">
                        <form className="space-y-6 Poppins" onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        {...register("Name", { required: true })}
                                        className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm rounded-md"
                                    />
                                    {errors.Name && (
                                        <span className="text-red-500 text-sm">Name is required</span>
                                    )}
                                </div>
                                <div className="w-full">
                                    <input
                                        type="text"
                                        placeholder="Email Address"
                                        {...register("EmailAddress", { required: true })}
                                        className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm  rounded-md"
                                    />
                                    {errors.EmailAddress && (
                                        <span className="text-red-500 text-sm">Email Address is required</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center border border-[#dedede] shadow-sm  rounded-md p-3">
                                <input
                                    type="tel"
                                    placeholder="(+91) 5555-5555-55"
                                    {...register("phone", { required: true })}
                                    className="w-full border-none placeholder:text-[#bbb] outline-none"
                                />
                            </div>
                            {errors.phone && (
                                <span className="text-red-500 text-sm">Phone number is required</span>
                            )}

                            <div>
                                <textarea
                                    placeholder="Tell us what we can help you with"
                                    {...register("message", { required: true })}
                                    className="w-full p-3 border placeholder:text-[#bbb] border-[#dedede] shadow-sm  rounded-md h-32"
                                ></textarea>
                                {errors.message && (
                                    <span className="text-red-500 text-sm">Message is required</span>
                                )}
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    {...register("policy", { required: true })}
                                    className="w-4 h-4 mt-1"
                                />
                                <label className="text-[13px] pt-1 item-center text-gray-600">
                                    I’d like to receive more information about the company. I understand and agree to the
                                    <a href="#" className="text-blue-500"> Privacy Policy</a>.
                                </label>
                            </div>
                            {errors.policy && (
                                <span className="text-red-500 text-sm">Please accept the privacy policy</span>
                            )}

                            <Button
                                type="submit"
                                className="w-34 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] transition hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2"
                            >
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUsPage;
