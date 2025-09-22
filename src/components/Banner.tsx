import { useEffect, useState } from "react";
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
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [openLocation, setOpenLocation] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [openDate, setOpenDate] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const storedLocation = localStorage.getItem("selectedLocation");
        if (storedLocation) setSelectedLocation(storedLocation);

        const storedDate = localStorage.getItem("selectedDate");
        if (storedDate) {
            const parsedDate = new Date(storedDate);
            if (!isNaN(parsedDate.getTime())) setDate(parsedDate);
        }
    }, []);

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

    useEffect(() => {
        if (selectedLocation) {
            localStorage.setItem("selectedLocation", selectedLocation);
        }
    }, [selectedLocation]);

    useEffect(() => {
        if (date) {
            const formattedDate = format(date, "yyyy-MM-dd");
            localStorage.setItem("selectedDate", formattedDate);
        }
    }, [date]);

    return (
        <div className="relative w-full h-[80vh] sm:h-[85vh] overflow-hidden">
            {/* Video Background */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/video/Maldives Deep South Diving 4k.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-start h-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                {/* Waves Icon */}
                <div className="mb-4">
                    <span className="text-xl text-[#0191e9]">
                        <img src={waves} alt="" className="w-16 sm:w-20 md:w-24" />
                    </span>
                </div>

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl Trirong font-normal leading-tight mb-4 sm:mb-6">
                    Float in a weightless world
                </h1>

                {/* Subtext */}
                <p className="mb-6 text-sm sm:text-base md:text-md Poppins flex items-center flex-wrap">
                    <img
                        src={peoples}
                        alt="avatars"
                        className="hidden sm:inline-block w-12 md:w-33 mr-2"
                    />
                    <span className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                        50+ people booked Tomorrow’s Scuba Dive in last 24 hours
                    </span>
                </p>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 Poppins w-full">
                    {/* Mobile: Dropdowns side by side */}
                    <div className="flex flex-row gap-3 w-full sm:flex-row sm:w-auto">
                        {/* Location Dropdown */}
                        <Popover open={openLocation} onOpenChange={setOpenLocation}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1 sm:w-52 cursor-pointer bg-white font-normal text-black px-4 py-2 rounded-full animate-float hover:scale-105 hover:shadow-2xl transition-all duration-300"
                                >
                                    {selectedLocation ? selectedLocation : "Select Location"}
                                    <ChevronDown className="ml-2" />
                                </Button>
                            </PopoverTrigger>

                            <AnimatePresence>
                                {openLocation && (
                                    <PopoverContent asChild className="w-full sm:w-60">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-white px-2 py-2 text-black shadow-md rounded-md z-50 max-h-60 overflow-y-auto"
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
                                    className="flex-1 sm:w-auto min-w-[10rem] bg-white cursor-pointer text-black font-normal px-4 py-2 rounded-full flex items-center justify-between animate-float hover:scale-105 hover:shadow-2xl transition-all duration-300"
                                >
                                    {date ? format(date, "PPP") : "Choose Date"}
                                    <CalendarIcon className="ml-2 h-4 w-4 shrink-0" />
                                </Button>
                            </PopoverTrigger>

                            <AnimatePresence>
                                {openDate && (
                                    <PopoverContent asChild className="w-full sm:w-72">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-white text-black shadow-md rounded-md z-50"
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
                                                        "bg-[#0191e9] text-white rounded-md hover:bg-[#0191e9] focus:bg-[#0191e9]",
                                                }}
                                            />
                                        </motion.div>
                                    </PopoverContent>
                                )}
                            </AnimatePresence>
                        </Popover>
                    </div>

                    {/* Book Now Button */}
                    <div className="w-full flex justify-center sm:justify-start">
                        <Button
                            disabled={!selectedLocation || !date}
                            className={cn(
                                "w-full sm:w-auto text-white font-normal cursor-pointer rounded-full text-sm px-4 py-2 transition",
                                "bg-[#0191e9] hover:text-[#fff] hover:bg-transparent hover:border border-[#fff]",
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
        </div>
    );
}
