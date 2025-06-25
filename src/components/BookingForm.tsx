"use client";

import {
    BetweenVerticalEnd,
    Calendar,
    Check,
    ChevronRight,
    File,
    Mail,
    Phone,
    User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const BookingForm = () => {
    const [selectedPackage, setSelectedPackage] = useState<number | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [selectedPackageName, setSelectedPackageName] = useState<string>("");

    useEffect(() => {
        const storedPackageId = localStorage.getItem("selectedPackageId");
        const storedPackageName = localStorage.getItem("selectedPackageName");
        const storedDate = localStorage.getItem("selectedDate");
        const storedSlot = localStorage.getItem("selectedSlot"); // ✅

        if (storedPackageId) setSelectedPackage(Number(storedPackageId));
        if (storedPackageName) setSelectedPackageName(storedPackageName);
        if (storedDate) setSelectedDate(storedDate);
        if (storedSlot) setSelectedSlot(storedSlot); // ✅
    }, []);



    return (
        <div className="max-w-3xl mx-auto bg-white px-6 sm:p-8 shadow-md border-1 border-[#d8d8d8] rounded-md">
            <form className="space-y-4 Poppins text-[#a2a2a2]">
                {/* Package Selection */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md">
                        <input
                            type="text"
                            className="w-full placeholder:text-[#a2a2a2] text-[#2e2e2e] rounded px-4 py-2"
                            value={selectedPackageName}
                            readOnly
                        />
                    </div>
                </div>

                {/* Full Name */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <User className="w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Full Name*"
                            className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                        />
                    </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <Phone className="w-5 mr-2" />
                        <input
                            type="tel"
                            placeholder="WhatsApp Number*"
                            className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <Mail className="w-5 mr-2" />
                        <input
                            type="email"
                            placeholder="Email Address*"
                            className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                        />
                    </div>
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <User className="w-5 mr-2" />
                            <input
                                type="number"
                                placeholder="Age*"
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <select className="w-full text-[#2e2e2e]">
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
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <Check className="w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Nationality*"
                            className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                        />
                    </div>
                </div>

                {/* Document Upload */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <File className="w-5 mr-2" />
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="w-full" />
                    </div>
                </div>

                {/* Date of Adventure */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <Calendar className="w-5 mr-2" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                localStorage.setItem("selectedDate", e.target.value);
                            }}
                            className="w-full text-[#2e2e2e] uppercase"
                        />
                    </div>
                </div>

                {/* Slot Selection */}
                <div>
                    <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                        <BetweenVerticalEnd className="w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Slot"
                            className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2]"
                            value={selectedSlot}
                            readOnly
                        />
                    </div>
                </div>

                {/* Promo Code */}
                <div>
                    <div className="flex justify-center bg-gradient-to-r from-[#c5f5fa33] to-[#93e7ef33] items-center border-1 border-[#8DD5DC33] rounded-md p-3">
                        <input
                            type="text"
                            placeholder="Promo Code"
                            className="w-full placeholder:text-[#a2a2a2]"
                        />
                        <button
                            className="text-sm font-bold text-[#058EBA] Poppins"
                            type="button"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-10 items-center">
                    <Button
                        type="button"
                        disabled
                        className="flex items-center justify-center gap-1 w-40 text-white font-normal bg-[#b89d53] opacity-50 cursor-not-allowed rounded-full text-sm px-4 py-3"
                    >
                        Make Payment <ChevronRight size={18} />
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default BookingForm;
