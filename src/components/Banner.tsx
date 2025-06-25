import React, { useEffect, useState } from "react";
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
import waves from "../assets/images/Waves.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getactivePackages } from "@/services/apiService";


export default function Banner() {
    const [selectedLocation, setSelectedLocation] = React.useState<string>("");
    const [openLocation, setOpenLocation] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);
    const [openDate, setOpenDate] = React.useState(false);
    const [locations, setLocations] = useState<string[]>([]);

    const navigate = useNavigate();

    // Load saved data from localStorage on mount
    useEffect(() => {
        const storedLocation = localStorage.getItem("selectedLocation");
        if (storedLocation) {
            setSelectedLocation(storedLocation);
        }

        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            const parsedDate = new Date(storedDate);
            if (!isNaN(parsedDate.getTime())) {
                setDate(parsedDate);
            }
        }
    }, []);

    // Fetch and set unique locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await getactivePackages();
                const packages = res?.data?.data || [];

                const uniqueLocations = Array.from(
                    new Set(packages.map((pkg: any) => pkg.location?.location_name).filter(Boolean))
                );

                setLocations(uniqueLocations as string[]);
            } catch (err) {
                console.error("Failed to fetch locations", err);
            }
        };

        fetchLocations();
    }, []);

    // Save selected location to localStorage
    useEffect(() => {
        if (selectedLocation) {
            localStorage.setItem("selectedLocation", selectedLocation);
        }
    }, [selectedLocation]);


    // Save selected date to localStorage (choose either ISO or formatted version)
    useEffect(() => {
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd");
            localStorage.setItem("selectedDate", formattedDate);
        }
    }, [date]);

    // localStorage.clear();

    return (
        <div className="relative w-full h-[85vh] overflow-hidden">
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                src="/video/Maldives Deep South Diving 4k.mp4"
                autoPlay
                muted
                loop
                playsInline
            />
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
                            <Button
                                variant="outline"
                                className="w-52 bg-white font-normal items-center text-black px-4 py-2 rounded-full animate-float hover:scale-105 hover:shadow-2xl transition-all duration-300"
                            >
                                {selectedLocation ? selectedLocation : "Select Location"}
                                <ChevronDown />
                            </Button>
                        </PopoverTrigger>

                        <AnimatePresence>
                            {openLocation && (
                                <PopoverContent asChild className="w-50">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-38 bg-white px-2 py-2 text-black shadow-md z-50"
                                    >
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
                                    </motion.div>
                                </PopoverContent>
                            )}
                        </AnimatePresence>
                    </Popover>

                    {/* Date Picker */}
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-40 bg-white text-black font-normal px-8 py-2 rounded-full flex items-center animate-float hover:scale-105 hover:shadow-2xl transition-all duration-300"
                                )}
                            >
                                {date ? format(date, "PPP") : "Choose Date"}
                                <CalendarIcon className="ml-2 h-4 w-4" />
                            </Button>

                        </PopoverTrigger>

                        <AnimatePresence>
                            {openDate && (
                                <PopoverContent asChild className="w-30">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-70 bg-white text-black shadow-md z-50"
                                    >
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
                                    </motion.div>
                                </PopoverContent>
                            )}
                        </AnimatePresence>
                    </Popover>

                    {/* Book Now Button */}
                    <Button
                        disabled={!selectedLocation || !date}
                        className={cn(
                            "text-white font-normal rounded-full text-sm px-4 py-2 transition",
                            "bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border border-[#b89d53]",
                            (!selectedLocation || !date) && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                            if (selectedLocation && date) {
                                navigate("/booking");
                            }
                        }}
                    >
                        Book Now
                    </Button>
                </div>
            </div>
        </div>
    );
}
