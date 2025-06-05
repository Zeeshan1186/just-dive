import React from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import peoples from "../assets/images/Peoples.png";
import banner from "../assets/images/Banner.png";
import waves from "../assets/images/Waves.png";

const locations = ["Goa", "Andaman", "Lakshadweep", "Malvan"];

export default function Banner() {
    const [selectedLocation, setSelectedLocation] = React.useState<string>("");
    const [openLocation, setOpenLocation] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    return (
        <div
            className="relative h-[85vh] bg-cover bg-no-repeat bg-right" style={{ backgroundImage: `url(${banner})` }}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex flex-col justify-center items-start h-full max-w-6xl mx-auto px-4 text-white">
                <div className="mb-4">
                    <span className="text-xl text-yellow-300">
                        <img src={waves} alt="" />
                    </span>
                </div>
                <h1 className="text-4xl sm:text-5xl Trirong md:text-6xl font-normal leading-tight mb-6">
                    Float in a weightless world
                </h1>
                <p className="mb-6 text-md Poppins flex items-center">
                    <img
                        src={peoples}
                        alt="avatars"
                        className="inline-block w-30 mr-2"
                    />
                    50+ people booked Tomorrow’s Scuba Dive in last 24 hours
                </p>

                <div className="flex flex-wrap Poppins gap-4">
                    {/* Location Dropdown */}
                    <Popover open={openLocation} onOpenChange={setOpenLocation}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-52 bg-white font-normal items-center text-black px-4 py-2 rounded-full">
                                {selectedLocation ? selectedLocation : "Select Your Location"}
                                <ChevronDown className="" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-38 bg-white px-2 py-2 text-black shadow-md z-50">
                            <ul>
                                {locations.map((loc) => (
                                    <li
                                        key={loc}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
                                        onClick={() => {
                                            setSelectedLocation(loc);
                                            setOpenLocation(false);
                                        }}
                                    >
                                        {loc}
                                    </li>
                                ))}
                            </ul>
                        </PopoverContent>
                    </Popover>

                    {/* Date Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    " w-40 bg-white text-black font-normal px-8 py-2 rounded-full flex items-center"
                                )}
                            >
                                {date ? format(date, "PPP") : "Choose Date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white text-black shadow-md z-50">
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
                                    day_selected: "bg-[#b89d53] text-white rounded-md hover:bg-yellow-500 focus:bg-yellow-500",
                                }}
                            />

                        </PopoverContent>
                    </Popover>

                    {/* Book Now Button */}
                    <Button className="bggolden hover:bg-yellow-500 text-white px-6 py-2 rounded-full">
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
