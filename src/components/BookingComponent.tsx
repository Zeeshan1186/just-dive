"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import banner from "../assets/images/booking.png";

export default function BookingComponent() {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [showModal, setShowModal] = useState(true);
    const [participants, setParticipants] = useState("");

    const bookings = [
        {
            date: "24.5.2025",
            activity: "Just Dive Murdeshwar",
        },
        {
            date: "24.5.2025",
            activity: "Scuba Diving In Netrani Island",
        },
    ];

    // Load selected date from localStorage on mount
    useEffect(() => {
        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            const parsed = parse(storedDate, "yyyy-MM-dd", new Date());
            setDate(parsed);
        }
    }, []);

    // Save selected date when changed
    useEffect(() => {
        if (date) {
            localStorage.setItem("selectedDate", format(date, "yyyy-MM-dd"));
        }
    }, [date]);

    const handleParticipantSubmit = () => {
        if (participants) {
            localStorage.setItem("participants", participants);
            setShowModal(false);
        }
    };
    

    return (
        <section className="w-full">
            {/* Banner */}
            <div
                className="relative h-[75vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto py-10 text-center">
                <h2 className="text-3xl md:text-4xl font-normal mb-4 Trirong text-black">
                    Book Your Dive
                </h2>
                <p className="text-gray-700 mb-8 text-sm Poppins px-40 md:text-base">
                    Experience incredible emotions discovering new amazing underwater worlds with JUST DIVE
                </p>

                {/* Calendar */}
                <div className="flex justify-center mb-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
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

                {/* <div className="flex justify-center items-center">
                    <div className="w-70 text-md py-2 bg-[#b89d53] rounded-sm Poppins font-medium text-white mb-4">
                        Selected Date: {date ? format(date, "PPP") : "Choose a date"}
                    </div>
                </div> */}

                <Button className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-6 py-2">
                    Next
                </Button>
            </div>

            {/* Bookings */}
            <div className="flex justify-center">
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
            </div>

            {/* Participant Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg text-center">
                        <h3 className="text-2xl font-normal mb-4 Trirong">
                            How many participants do you want to reserve?
                        </h3>
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
                                onClick={() => setShowModal(false)}
                                className="w-1/2 mr-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2"
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleParticipantSubmit} className="w-1/2 ml-2 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
