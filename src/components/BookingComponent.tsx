"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import banner from "../assets/images/Banner.png";

export default function BookingComponent() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const bookings = [
        {
            date: "24.5.2025",
            activity: "Just Dive Murdeshwar",
        },
        {
            date: "24.5.2025",
            activity: "Scuba Diving In Netrani Island",
        },
        // Add more items as needed
    ];

    return (
        <section className="w-full">
            <div
                className="relative h-[75vh] bg-cover bg-no-repeat bg-right" style={{ backgroundImage: `url(${banner})` }}>
                <div className="absolute inset-0 bg-black/50" />
            </div>
            <div className="max-w-4xl mx-auto py-10 text-center">
                <h2 className="text-3xl md:text-4xl font-normal mb-4 Trirong text-black">Book Your Dive</h2>
                <p className="text-gray-700 mb-8 text-sm Poppins px-40 md:text-base">
                    Experience incredible emotions discovering new amazing underwater worlds with JUST DIVE
                </p>

                {/* Calendar visible by default */}
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

                <div className="flex justify-center items-center">
                    {/* Date Info Display (Optional) */}
                    <div className="w-70 text-md py-2 bg-[#b89d53] rounded-sm Poppins font-medium text-white mb-4">
                        Selected Date: {date ? format(date, "PPP") : "Choose a date"}
                    </div>
                </div>

                <Button className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-6 py-2">
                    Next
                </Button>
            </div>

            <div className="w-[60%] flex justify-center px-4 md:px-8 lg:px-16 py-8">
                <hr className="border-t border-yellow-200 mb-6" />

                <div className="space-y-4">
                    {bookings.map((item, index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center border-b border-gray-100 pb-4"
                        >
                            <div className="text-black text-sm md:text-base flex-1">{item.date}</div>
                            <div className="text-black text-sm md:text-base flex-1 text-center">{item.activity}</div>
                            <div className="flex-1 text-right">
                                <button className="bg-[#c2a65c] hover:bg-[#b89d53] text-white rounded-full px-4 py-2 text-sm">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
