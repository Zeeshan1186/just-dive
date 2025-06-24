"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import banner from "../assets/images/booking.png";
import BookingForm from "./BookingForm";
import { getactivePackages } from "../services/apiService";
import { getPackageSlotsByDate } from "../services/apiService";

export default function BookingComponent() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [popupStep, setPopupStep] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState("");
    const [participants, setParticipants] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [packages, setPackages] = useState<any[]>([]);
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);
    const [dynamicSlots, setDynamicSlots] = useState([]);
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        const fetchSlotsAndSeats = async () => {
            if (selectedPackage && date) {
                try {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    const res = await getPackageSlotsByDate(selectedPackage, formattedDate);
                    const slots = res?.data?.slots || [];
                    setDynamicSlots(slots);
                    setAvailableSeats(res?.data?.availableSeats ?? slots.length ? 23 : 0); // fallback or your own logic
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                    setDynamicSlots([]);
                    setAvailableSeats(null);
                }
            }
        };

        fetchSlotsAndSeats();
    }, [selectedPackage, date]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getactivePackages();
                setPackages(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch packages", err);
            }
        };

        fetchPackages();
    }, []);


    useEffect(() => {
        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            const parsed = parse(storedDate, "yyyy-MM-dd", new Date());
            setDate(parsed);
        }
    }, []);



    useEffect(() => {
        if (date) {
            localStorage.setItem("selectedDate", format(date, "yyyy-MM-dd"));
        }
    }, [date]);

    const handleNext = () => {
        if (popupStep === 1 && selectedPackage) {
            setPopupStep(2);
        } else if (popupStep === 2 && participants) {
            setPopupStep(3);
        } else if (popupStep === 3 && selectedSlot) {
            const pkg = packages.find((p) => String(p.id) === selectedPackage);
            localStorage.setItem("selectedPackage", pkg?.name || "");
            localStorage.setItem("participants", participants);
            localStorage.setItem("selectedSlot", selectedSlot);
            setPopupStep(0);
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
                                    selected={date} // ← this is what makes it pre-select on load
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
                                        day_selected:
                                            "bg-[#b89d53] text-white rounded-md hover:bg-yellow-500 focus:bg-yellow-500",
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
                                    <div className="w-full flex justify-center items-center mb-3 rounded-sm bg-[#F6F6F6] py-2 px-2">
                                        <select
                                            className="w-full"
                                            value={selectedSlot}
                                            onChange={(e) => setSelectedSlot(e.target.value)}
                                        >
                                            <option value="">Select a slot</option>
                                            {dynamicSlots.map((slot: any, i: number) => (
                                                <option key={i} value={slot.time}>
                                                    {slot.time}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <hr className="w-[100%] border-t border-1 border-[#b89d53] mb-2" />
                                    <h2 className="text-lg font-bold">
                                        Available - <span className="text-lg font-bold text-[#b89d53]">{availableSeats ?? "N/A"}</span>
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
                                    onChange={(e) => setSelectedPackage(e.target.value)}
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

                        {popupStep === 3 && (
                            <>
                                <h3 className="text-2xl font-normal mb-4 Trirong">Select Slot</h3>
                                <select
                                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                                    value={selectedSlot}
                                    onChange={(e) => setSelectedSlot(e.target.value)}
                                >
                                    <option value="">Select a slot</option>
                                    {packages.find((p) => String(p.id) === selectedPackage)?.slots?.map((slot: any, i: number) => (
                                        <option key={i} value={slot.time}>{slot.time}</option>
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
                    </div>
                </div>
            )}
            {showBookingForm && <BookingForm />}
        </section>
    );
}

{/* <div className="flex justify-center">
                <hr className="w-[70%] border-t border-1 border-yellow-200 mb-6" />
            </div>
            <div className="w-full flex justify-center items-center">
                <div className="space-y-4 w-[40%]">
                    {bookings.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b border-gray-100 pb-4"
                        >
                            <div className="text-black text-sm md:text-base flex-1">{item.date}</div>
                            <div className="text-black text-sm md:text-base flex-1 text-center">{item.activity}</div>
                            <div className="flex-1 text-right">
                                <Button className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-6 py-2">
                                    Book Now
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}