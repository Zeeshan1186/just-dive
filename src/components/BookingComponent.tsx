"use client";

import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import banner from "../assets/images/booking.webp";
import BookingForm from "./BookingForm";
import {
    getPackageSlotsByDate,
    getactivePackages,
    getactivePackagesByLocation,
} from "../services/apiService";
import { ChevronDown } from "lucide-react";
import { useParams } from "react-router-dom";

type Slot = {
    slot_id: number;
    slot_time: string;
    booked: number;
    available: number;
    time: string;
};

export interface Package {
    id: number;
    title: string;
    description: string;
    price: number;
    location_id: number;
    name: string;
}

export default function BookingComponent() {
    const [date, setDate] = useState<Date | undefined>();
    const [popupStep, setPopupStep] = useState(0);
    const [selectedPackage, setSelectedPackage] = useState<number | "">("");
    const [participants, setParticipants] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [packages, setPackages] = useState<Package[]>([]);
    const [availableSeats, setAvailableSeats] = useState<number | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [dynamicSlots, setDynamicSlots] = useState<Slot[]>([]);
    const { id } = useParams();
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

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

    // useEffect(() => {
    //     const savedLocation = localStorage.getItem("selectedLocation");

    //     if (savedLocation) {
    //         setSelectedLocation(savedLocation);
    //         setPopupStep(1);
    //     } else {
    //         setShowLocationModal(true);
    //     }
    // }, []);

    useEffect(() => {
        const savedLocation = localStorage.getItem("selectedLocation");
        const savedPackage = localStorage.getItem("selectedPackageId");
        const savedParticipants = localStorage.getItem("participants");

        // If any of the required data is missing, show popups
        if (!savedLocation) {
            setShowLocationModal(true);
        } else if (!savedPackage || !savedParticipants) {
            setSelectedLocation(savedLocation);
            setPopupStep(1); // Show package selection popup
        } else {
            // All required data exists, just set state to keep selections
            setSelectedLocation(savedLocation);
            setSelectedPackage(Number(savedPackage));
            setParticipants(savedParticipants);
        }

        const savedDate = localStorage.getItem("selectedDate");
        if (savedDate) setDate(new Date(savedDate));
    }, []);



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
        const fetchSlotsAndSeats = async () => {
            if (selectedPackage && date) {
                try {
                    const formattedDate = format(date, "d/M/yyyy");
                    const res = await getPackageSlotsByDate(Number(selectedPackage), formattedDate);
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
    }, [selectedPackage, date]);

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
            // setShowBookingForm(true); // Immediately show form
        }
    };

    return (
        <section className="w-full pb-5">
            <div
                className="relative h-[50vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="max-w-4xl mx-auto pt-6 sm:pt-10 px-4 text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal mb-3 Trirong text-black">
                    Book Your Dive
                </h2>
                <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base Poppins px-2 sm:px-10 md:px-40">
                    Experience incredible emotions discovering new amazing underwater worlds with JUST DIVE
                </p>

                {!showBookingForm && (
                    <>
                        <div className="flex flex-col lg:flex-row justify-center items-center gap-6 sm:gap-7 w-full">
                            <div className="shadow-md rounded-md mb-4 lg:mb-0 w-full max-w-xs sm:w-auto">
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
                                            "size-8 sm:size-10 p-0 font-normal aria-selected:opacity-100"
                                        ),
                                        day_selected:
                                            "bg-[#0191e9] text-white rounded-md hover:bg-yellow-500 focus:bg-yellow-500",
                                    }}
                                />
                            </div>

                            <div className="Poppins w-full sm:w-[70%]">
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <h3 className="text-sm mb-1">
                                        Availability on{" "}
                                        <span className="text-base sm:text-lg font-bold text-[#0191e9]">
                                            {date ? format(date, "dd MMMM yyyy") : "No date selected"}
                                        </span>
                                    </h3>
                                    <h3 className="text-sm mb-4">Click one of the options below</h3>
                                    <h2 className="text-base sm:text-lg font-bold mb-3">Time Slot</h2>

                                    {selectedPackage ? (
                                        dynamicSlots.length > 0 ? (
                                            <div className="w-auto flex justify-center lg:justify-start mb-3 rounded-sm bg-[#F6F6F6] py-2 px-2">
                                                <select
                                                    value={selectedSlot}
                                                    onChange={(e) => {
                                                        const selected = e.target.value;
                                                        const selectedSlotData = dynamicSlots.find(
                                                            (slot) => slot.slot_time === selected
                                                        );
                                                        setSelectedSlot(selected);
                                                        localStorage.setItem("selectedSlot", selected);
                                                        localStorage.setItem("selectedSlotId", selectedSlotData?.slot_id !== undefined ? String(selectedSlotData.slot_id) : "");
                                                        setAvailableSeats(selectedSlotData?.available ?? null);
                                                    }}
                                                    className="w-full sm:w-auto px-2 py-1 rounded"
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
                                            <p className="text-sm text-gray-500 italic mb-3">
                                                No slots available for this package
                                            </p>
                                        )
                                    ) : (
                                        <p className="text-sm text-gray-500 italic mb-3">
                                            Please select a package to view slots
                                        </p>
                                    )}

                                    <hr className="w-60 border-t border-[#0191e9] mb-2" />
                                    <h2 className="text-base sm:text-lg font-bold">
                                        Available -{" "}
                                        <span className="text-[#0191e9]">
                                            {availableSeats !== null ? availableSeats : "Please Select Slot"}
                                        </span>
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={() => {
                                if (!selectedPackage) {
                                    setPopupStep(1);
                                    return;
                                }
                                if (date && selectedSlot) {
                                    setShowBookingForm(true);
                                } else {
                                    alert("Please select date and slot");
                                }
                            }}
                            className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border border-[#0191e9] rounded-full text-sm sm:text-base px-5 sm:px-6 py-2 mt-6 sm:mt-8"
                        >
                            Next
                        </Button>
                    </>
                )}
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

            {showBookingForm && <BookingForm />}
        </section>
    );
}
