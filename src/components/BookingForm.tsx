"use client";

import { BetweenVerticalEnd, Calendar, Check, ChevronRight, File, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";

const mockPackages = [
    { id: 1, name: "Scuba Diving – Grand Island" },
    { id: 2, name: "Night Dive – Coral Bay" },
    { id: 3, name: "Wreck Dive – Shipwreck Point" },
];

const mockSlots: { [key: string]: string[]; } = {
    "2025-06-12": ["10:00 AM", "12:00 PM", "02:00 PM"],
    "2025-06-13": ["09:30 AM", "11:30 AM", "01:30 PM"],
};

const BookingForm = () => {
    const {
        register,
        handleSubmit,
        reset,
    } = useForm();
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedPackage, setSelectedPackage] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");

    const onSubmit = (data: any) => {
        console.log("Form Submitted:", data);
        alert("Booking Submitted!");
        reset();
        setSelectedDate("");
        setSelectedSlot("");
        setSelectedPackage("");
    };

    const slotsForDate = mockSlots[selectedDate] || [];

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 shadow-md rounded-md mt-10">
            {/* <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center">Booking Form</h2> */}

            {/* Selection Summary */}
            {(selectedPackage || selectedSlot) && (
                <div className="bg-blue-100 text-blue-800 p-3 rounded mb-6 text-sm sm:text-base">
                    <p><strong>Packages:</strong> {selectedPackage || "Not selected"}</p>
                    <p><strong>Date:</strong> {selectedDate || "Not selected"}</p>
                    <p><strong>Slot:</strong> {selectedSlot || "Not selected"}</p>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 Poppins text-[#a2a2a2]">
                {/* Full Name */}

                {/* Package Selection */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                        <select
                            {...register("package", { required: true })}
                            className="w-full"
                            onChange={(e) => setSelectedPackage(e.target.value)}
                        >
                            <option value="">Your Package*</option>
                            {mockPackages.map((pkg) => (
                                <option key={pkg.id} value={pkg.name}>
                                    {pkg.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                        <User className="w-5 mr-2" /> <input type="text" placeholder="Full Name*" {...register("fullName", { required: true })} className="w-full placeholder:text-[#a2a2a2]" />
                    </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                        <Phone className="w-5 mr-2" /><input type="tel" placeholder="WhatsApp Number*" {...register("whatsapp", { required: true })} className="w-full placeholder:text-[#a2a2a2]" />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block mb-1 font-medium"></label>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                        <Mail className="w-5 mr-2" /> <input type="email" placeholder="Email Address*" {...register("email", { required: true })} className="w-full placeholder:text-[#a2a2a2]" />
                    </div>
                </div>

                {/* Age */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                            <User className="w-5 mr-2" /> <input type="number" placeholder="Age*" {...register("age", { required: true })} className="w-full placeholder:text-[#a2a2a2]" />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                            <select {...register("gender", { required: true })} className="w-full   ">
                                <option value="">Select Gender*</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Nationality */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                        <Check className="w-5 mr-2" /> <input type="text" placeholder="Nationality*" {...register("nationality", { required: true })} className="w-full placeholder:text-[#a2a2a2]" />
                    </div>
                </div>

                {/* Document Upload */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                       <File className="w-5 mr-2"/> <input
                            type="file"
                            {...register("document", { required: true })}
                            accept=".pdf,.jpg,.jpeg,.png"
                            placeholder="Upload Identity Proof / Aadhar Card (PDF or Image)*"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Date of Adventure */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                       <Calendar className="w-5 mr-2"/> <input
                            type="date"
                            placeholder="Date of Adventure*"
                            {...register("date", { required: true })}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full uppercase"
                        />
                    </div>
                </div>

                {/* Slot Selection */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333]  rounded-md p-3">
                       <BetweenVerticalEnd className="w-5 mr-2"/> <select
                            {...register("slot", { required: true })}
                            className="w-full"
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            disabled={!selectedDate}
                        >
                            {!selectedDate ? (
                                <option value="">Available Slots*</option>
                            ) : (
                                <>
                                    <option value="">-- Select Slot --</option>
                                    {slotsForDate.map((slot, idx) => (
                                        <option key={idx} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Promo Code */}
                <div>
                    <div className="flex justify-center bg-gradient-to-r from-[#c5f5fa33] to-[#93e7ef33] items-center border-1 border-[#8DD5DC33]  rounded-md p-3">
                        <input type="text" {...register("promoCode")} placeholder="Promo Code" className="w-full placeholder:text-[#a2a2a2]" />
                        <button className="text-sm font-bold text-[#058EBA] Poppins">Apply</button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-10 items-center">
                    <Button
                        type="submit"
                        className="flex items-center justify-center gap-1 w-40 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] transition hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-3"
                    >
                        Make Payment <ChevronRight size={18} />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
