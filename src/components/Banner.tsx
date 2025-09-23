import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format, parse } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import peoples from "../assets/images/Peoples.png";
import waves from "../assets/images/Waves.png";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getactivePackages, getactivePackagesByLocation } from "@/services/apiService";
import video from "../../Video/Maldives Deep South Diving 4k.mp4";

export interface Package {
    id: number;
    title: string;
    description: string;
    price: number;
    location_id: number;
    name: string;
}

export default function Banner() {
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [openLocation, setOpenLocation] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [openDate, setOpenDate] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [popupStep, setPopupStep] = useState(0);
    const [packages, setPackages] = useState<Package[]>([]);
    const { id } = useParams();
    const [selectedPackage, setSelectedPackage] = useState<number | "">("");
    const [participants, setParticipants] = useState("");


    const navigate = useNavigate();

    // useEffect(() => {
    //     const savedLocation = localStorage.getItem("selectedLocation");

    //     if (savedLocation) {
    //         setSelectedLocation(savedLocation);
    //         setPopupStep(1);
    //     } else {
    //         setShowLocationModal(true);
    //     }
    // }, []);

    // localStorage.clear()

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = selectedLocation
                    ? await getactivePackagesByLocation(selectedLocation)
                    : await getactivePackages();
                const fetchedPackages = res?.data?.data || [];
                setPackages(fetchedPackages);
                if (id) {
                    const matchedPackage = fetchedPackages.find((pkg: any) => pkg.id === Number(id));
                    if (matchedPackage) {
                        setSelectedPackage(matchedPackage.id);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch packages", err);
            }
        };

        if (selectedLocation) {
            fetchPackages();
        }
    }, [id, selectedLocation]);

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
                localStorage.setItem("selectedPackageId", String(pkg.id));
                localStorage.setItem("selectedPackageName", pkg.name);
                localStorage.setItem("participants", participants);
            }
            setPopupStep(0);
            navigate("/booking"); // redirect after second popup
        }
    };

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
                <source src={video} type="video/mp4" />
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
                                    <span className="truncate max-w-[80%]">{date ? format(date, "PPP") : "Choose Date"}</span>
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
                                "bg-[#0191e9] hover:text-[#fff] hover:bg-transparent hover:border border-[#810000]",
                                (!selectedLocation || !date) && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => {
                                if (selectedLocation && date) {
                                    // Only show first popup instead of navigating
                                    setPopupStep(1);
                                }
                            }}
                        >
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
            {/* Location Modal */}
            {showLocationModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm text-center">
                        <h2 className="text-xl font-semibold mb-4 Trirong">Select Your Location</h2>
                        <select
                            value={selectedLocation || ""}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                        >
                            <option value="">Select location</option>
                            {locations.map((locName) => (
                                <option key={locName} value={locName}>
                                    {locName}
                                </option>
                            ))}
                        </select>
                        <Button
                            disabled={!selectedLocation}
                            className="bg-[#0191e9] cursor-pointer text-white w-full"
                            onClick={() => {
                                if (selectedLocation) {
                                    localStorage.setItem("selectedLocation", selectedLocation);
                                    setShowLocationModal(false);
                                    setPopupStep(1);
                                }
                            }}
                        >
                            Continue
                        </Button>
                    </div>
                </div>

            )}

            {/* Package Selection Popup */}
            {popupStep > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-2 sm:px-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md shadow-lg text-center">
                        {popupStep === 1 && (
                            <>
                                <div className="relative bg-white rounded-md">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setPopupStep(0)}
                                        className="absolute -top-5 right-0 text-gray-500 hover:text-[#000] text-xl font-bold"
                                    >
                                        ✕
                                    </button>

                                    {/* Popup Content */}
                                    <h3 className="text-xl sm:text-2xl font-normal mb-4 Trirong">
                                        Select Your Package
                                    </h3>

                                    <div className="flex justify-center items-center border border-[#63636333] rounded-md p-2 mb-4 pl-0">
                                        <div className="relative w-full">
                                            <select
                                                className="w-full text-[#2e2e2e] bg-white pl-2 rounded-md appearance-none focus:outline-none"
                                                value={selectedPackage}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setSelectedPackage(value === "" ? "" : Number(value));
                                                }}
                                            >
                                                <option value="">Select a package</option>
                                                {packages.map((pkg) => (
                                                    <option key={pkg.id} value={pkg.id}>
                                                        {pkg.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-400">
                                                <ChevronDown />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-2">
                                        <Button
                                            onClick={() => setPopupStep(0)}
                                            className="w-1/2 text-sm bg-[#0392ea] cursor-pointer hover:bg-white border hover:text-[#0392ea] hover:border-[#0392ea]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="w-1/2 text-sm bg-[#0392ea] cursor-pointer hover:bg-white border hover:text-[#0392ea] hover:border-[#0392ea]"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}

                        {popupStep === 2 && (
                            <>
                                <div className="relative bg-white rounded-md">
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setPopupStep(0)}
                                        className="absolute -top-5 right-0 text-gray-500 hover:text-[#000] text-xl font-bold"
                                    >
                                        ✕
                                    </button>

                                    {/* Popup Content */}
                                    <h3 className="text-xl sm:text-2xl font-normal mb-4 Trirong">
                                        Enter Number of Participants
                                    </h3>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                                        placeholder="Enter number of participants"
                                        value={participants}
                                        onChange={(e) => setParticipants(e.target.value)}
                                    />
                                    <div className="flex justify-between gap-2">
                                        <Button
                                            onClick={() => setPopupStep(0)}
                                            className="w-1/2 text-sm bg-[#0392ea] cursor-pointer hover:bg-white border hover:text-[#0392ea] hover:border-[#0392ea]"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleNext}
                                            className="w-1/2 text-sm bg-[#0392ea] cursor-pointer hover:bg-white border hover:text-[#0392ea] hover:border-[#0392ea]"
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
