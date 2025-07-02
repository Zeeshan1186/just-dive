"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import banner from "../assets/images/booking.png";
import BookingForm from "./BookingForm";
import { getPackageSlotsByDate } from "../services/apiService";
import { getactivePackages, getactivePackagesByLocation } from "../services/apiService";

type Slot = {
    slot_id: number;
    slot_time: string;
    booked: number;
    available: number;
    time: string;
};


export default function BookingComponent() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [popupStep, setPopupStep] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState<number | "">("");
    const [participants, setParticipants] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [packages, setPackages] = useState<any[]>([]);
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [dynamicSlots, setDynamicSlots] = useState<Slot[]>([]);

    // Active packages popup
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const location = localStorage.getItem("selectedLocation");

                let res;

                if (location) {
                    res = await getactivePackagesByLocation(location);
                } else {
                    res = await getactivePackages(); // <-- fallback if no location
                }

                setPackages(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch packages", err);
            }
        };

        fetchPackages();
    }, []);


    // Calendar Date and Slots
    useEffect(() => {
        const fetchSlotsAndSeats = async () => {
            if (selectedPackage && date) {
                try {
                    const formattedDate = format(date, 'd/M/yyyy');
                    const res = await getPackageSlotsByDate(Number(selectedPackage), formattedDate);

                    // ✅ Ensure it's always an array before setting
                    const slots = Array.isArray(res?.data?.data) ? res.data.data : [];
                    setDynamicSlots(slots);

                    setSelectedSlot("");
                    setAvailableSeats(null);
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                    setDynamicSlots([]);
                    setSelectedSlot("");
                    setAvailableSeats(null);
                }
            }
        };

        fetchSlotsAndSeats();
    }, [selectedPackage, date]); // 👈 include `date` dependency



    useEffect(() => {
        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            const parsed = parse(storedDate, "yyyy-MM-dd", new Date());
            setDate(parsed);
        }
    }, []);

    const handleNext = () => {
        if (popupStep === 1 && selectedPackage) {
            setPopupStep(2);
        } else if (popupStep === 2 && participants) {
            const pkg = packages.find((p) => p.id === selectedPackage);
            if (pkg) {
                localStorage.setItem("selectedPackageId", String(pkg.id));   // ✅ store ID
                localStorage.setItem("selectedPackageName", pkg.name);       // ✅ store name
                localStorage.setItem("participants", participants);
            }
            setPopupStep(0); // close popup
        }
    };

    return (
        <section className="w-full pb-5">
            <div
                className="relative h-[75vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-4xl mx-auto pt-10 text-center">
                <h2 className="text-3xl md:text-4xl font-normal mb-4 Trirong text-black">
                    Book Your Dive
                </h2>
                <p className="text-gray-700 mb-8 text-sm Poppins px-40 md:text-base">
                    Experience incredible emotions discovering new amazing underwater worlds with JUST DIVE
                </p>

                {!showBookingForm && (
                    <>
                        <div className="flex justify-center items-center gap-7">
                            <div className="flex justify-center mb-2 shadow-md rounded-md">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        if (selectedDate) {
                                            localStorage.setItem("selectedDate", format(selectedDate, "yyyy-MM-dd"));
                                        }
                                    }}
                                    initialFocus
                                    disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                                    classNames={{
                                        day: cn(
                                            buttonVariants({ variant: "ghost" }),
                                            "size-8 p-0 font-normal aria-selected:opacity-100"
                                        ),
                                        day_selected: "bg-[#b89d53] text-white rounded-md hover:bg-yellow-500 focus:bg-yellow-500",
                                    }}
                                />
                            </div>
                            <div className="Poppins">
                                <div className="flex flex-col items-start">
                                    <h3 className="text-sm mb-1">Availablity on <span className="text-lg font-bold text-[#b89d53]">
                                        {date ? format(date, "dd MMMM yyyy") : "No date selected"}
                                    </span>
                                    </h3>
                                    <h3 className="text-sm mb-5">Click one of the option below </h3>
                                    <h2 className="text-lg font-bold mb-3">Time Slot</h2>
                                    {selectedPackage ? (
                                        dynamicSlots.length > 0 ? (
                                            <div className="w-full flex justify-center items-center mb-3 rounded-sm bg-[#F6F6F6] py-2 px-2">
                                                <select
                                                    value={selectedSlot}
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        setSelectedSlot(selected);
                                                        localStorage.setItem("selectedSlot", selected);
                                                        const selectedSlotData = dynamicSlots.find(slot => slot.slot_time === selected);
                                                        setAvailableSeats(selectedSlotData?.available ?? null);
                                                    }}
                                                    className="w-full px-2 py-1 rounded"
                                                >
                                                    <option value="">Select a slot</option>
                                                    {dynamicSlots.map((slot) => (
                                                        <option key={slot.slot_id} value={slot.slot_time}>
                                                            {slot.slot_time}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 italic mb-3">
                                                No slots available for this package
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-sm text-gray-500 italic mb-3">
                                            Please select a package to view slots
                                        </div>
                                    )}

                                    <hr className="w-[100%] border-t border-1 border-[#b89d53] mb-2" />

                                    <h2 className="text-lg font-bold">
                                        Available -{" "}
                                        <span className="text-lg font-bold text-[#b89d53]">
                                            {availableSeats !== null ? availableSeats : "N/A"}
                                        </span>
                                    </h2>

                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                if (date && selectedSlot) {
                                    setShowBookingForm(true);
                                } else {
                                    alert("Please select date and slot");
                                }
                            }}
                            className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-6 py-2 mt-8"
                        >
                            Next
                        </Button>
                    </>
                )}
            </div>

            {popupStep > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg text-center">
                        {popupStep === 1 && (
                            <>
                                <h3 className="text-2xl font-normal mb-4 Trirong">Select Your Package</h3>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                                    value={selectedPackage}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSelectedPackage(value === "" ? "" : Number(value));
                                    }}
                                >
                                    <option value="">Select a package</option>
                                    {packages.map(pkg => (
                                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                                    ))}
                                </select>

                                <div className="flex justify-between">
                                    <Button
                                        onClick={() => setPopupStep(0)}
                                        className="w-1/2 mr-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border border-[#b89d53] rounded-full text-sm px-4 py-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="w-1/2 ml-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border border-[#b89d53] rounded-full text-sm px-4 py-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}

                        {popupStep === 2 && (
                            <>
                                <h3 className="text-2xl font-normal mb-4 Trirong">How many participants do you want to reserve?</h3>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                                    placeholder="Enter number of participants"
                                    value={participants}
                                    onChange={(e) => setParticipants(e.target.value)}
                                />
                                <div className="flex justify-between">
                                    <Button
                                        onClick={() => setPopupStep(0)}
                                        className="w-1/2 mr-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border border-[#b89d53] rounded-full text-sm px-4 py-2"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleNext}
                                        className="w-1/2 ml-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border border-[#b89d53] rounded-full text-sm px-4 py-2"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}
            {showBookingForm && <BookingForm />}
        </section>
    );
}