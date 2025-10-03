"use client";

import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import wave from "../assets/images/Bluewave.webp";
import { Link } from "react-router-dom";
// import turtor from '../assets/Animation - 1750418255641.json';
// import Lottie from 'react-lottie-player';
import { useEffect, useState } from "react";
import { getactivePackages } from "../services/apiService";
import { toast } from "react-hot-toast";
import { formattedText, minutesToHourMinuteString } from "@/utils/common-function";

export default function murdeshwarpackages() {
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getactivePackages();
                setPackages(res?.data?.data || []);
            } catch (err) {
                console.error("Packages API error:", err);
                toast.error("Failed to load packages");
            }
        };

        fetchPackages();
    }, []);

    return (
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-8 sm:pt-10 pb-0 relative">
            {/* Title Section */}
            <div className="flex flex-col justify-center items-center text-center mb-6">
                <img src={wave} alt="Wave" className="w-8 sm:w-10 mb-4" />
                <h2 className="Trirong text-[#626262] text-2xl sm:text-3xl md:text-4xl font-normal mb-2">
                    SPECIAL DIVE PACKAGE
                </h2>
                <p className="Poppins text-[#626262] text-sm sm:text-base max-w-xl">
                    Experience incredible emotions discovering new amazing underwater
                    worlds with JUST DIVE
                </p>
            </div>

            {/* Grid instead of Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className="pb-0 flex flex-col"
                    >
                        <div className="group relative pb-4 Poppins hover:bg-white overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl  hover:rounded-2xl flex flex-col transform hover:-translate-y-2">
                            <div className="p-2 sm:p-4 overflow-hidden rounded-2xl">
                                <img
                                    src={pkg.package_image}
                                    alt={pkg.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute bottom-32 right-2 bg-[#0191e9] text-white font-normal text-xs sm:text-sm px-3 sm:px-5 py-1 rounded-full flex items-center gap-1">
                                {/* {pkg.duration} Hour{pkg.duration > 1 ? "s" : ""} */}
                                {minutesToHourMinuteString(pkg.duration)}
                                <Clock3 size={16} strokeWidth={1.5} />
                            </div>

                            <div className="px-3 sm:px-4 py-2 flex-1 flex flex-col justify-between">
                                {/* Package name */}
                                <p className="text-center text-gray-800 text-sm sm:text-base mb-3 line-clamp-2">
                                    {pkg.name}
                                </p>

                                {/* Buttons fixed at bottom */}
                                <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 
                  transition-all duration-500 ease-in-out overflow-hidden 
                  flex justify-center gap-2 mt-auto">
                                    {/* Book Now Button */}
                                    <Link to={`/booking/${pkg.id}`}>
                                        <Button
                                            variant="outline"
                                            className="text-white cursor-pointer font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-white border-[#0191e9] rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                        >
                                            Book Now
                                        </Button>
                                    </Link>

                                    {/* Know More Button */}
                                    <Link to={`/${formattedText(pkg.name)}`} state={{ packageId: pkg.id }}>
                                        <Button
                                            variant="outline"
                                            className="text-white cursor-pointer font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-white border-[#0191e9] rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                        >
                                            Know More
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
