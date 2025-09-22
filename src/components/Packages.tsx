"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useCarousel } from "../components/ui/use-carousel";
import wave from "../assets/images/Bluewave.png";
import { Link, useNavigate } from "react-router-dom";
// import { FancyButton } from "../components/FancyButton";
import { useEffect, useState } from "react";
import { getactivePackages } from "../services/apiService";
import { toast } from "react-hot-toast";
import { minutesToHourMinuteString } from "@/utils/common-function";
import type { IPackage } from "@/interface/package";

export default function Packages() {
    const { api, setApi } = useCarousel();
    const [packages, setPackages] = useState<IPackage[]>([]);
    const navigate = useNavigate();

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

    const book = (packageData: IPackage) => {
        localStorage.setItem("selectedLocation", packageData.location.location_name);
        localStorage.setItem("selectedPackageId", packageData.id.toString());
        localStorage.setItem("selectedPackageName", packageData.name);
        navigate(`/booking/${packageData.id}`);
    }

    // Limit to first 4 packages
    const displayedPackages = packages.slice(0, 4);

    return (
        <div className="w-full px-4 sm:px-8 lg:px-20 pt-8 sm:pt-10 pb-0 relative">
            {/* Title Section */}
            <div className="flex flex-col justify-center items-center text-center mb-6">
                <img src={wave} alt="Wave" className="w-8 sm:w-10 mb-4" />
                <h2 className="Trirong text-[#626262] text-2xl sm:text-3xl md:text-4xl font-normal mb-2">
                    SPECIAL DIVE PACKAGE
                </h2>
                <p className="Poppins text-[#626262] text-sm sm:text-base max-w-md">
                    Experience incredible emotions discovering new amazing underwater
                    worlds with JUST DIVE
                </p>
            </div>

            {/* Carousel */}
            <Carousel
                opts={{ align: "start", loop: true }}
                setApi={setApi}
                className="w-full max-w-screen-xl mx-auto relative"
            >
                <CarouselContent className="-ml-2 sm:-ml-4 mb-6 sm:mb-10">
                    {displayedPackages.map((pkg, index) => (
                        <CarouselItem
                            key={index}
                            className="pl-2 sm:pl-4 pb-4 sm:pb-6 basis-10/12 xs:basis-1/2 sm:basis-1/3 lg:basis-1/4"
                        >
                            <div
                                className="group relative pb-4 Poppins hover:bg-white overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl border-[#e1e1e1] hover:border-1 hover:rounded-2xl flex flex-col transform hover:-translate-y-2"
                                onClick={(e) => {
                                    // For touch devices, toggle hover on tap
                                    if (window.innerWidth < 768) {
                                        e.currentTarget.classList.toggle("hover");
                                    }
                                }}
                            >
                                <div className="p-2 sm:p-4 group overflow-hidden rounded-2xl">
                                    <img
                                        src={pkg.package_image}
                                        alt={pkg.name}
                                        width={400}
                                        height={500}
                                        className="w-full h-60 sm:h-72 md:h-80 object-cover rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>

                                <div className="absolute bottom-28 right-2 bg-[#0191e9] text-white font-normal text-xs sm:text-sm px-3 sm:px-5 py-1 rounded-full flex items-center gap-1">
                                    {/* {pkg.duration} Hour{pkg.duration > 1 ? "s" : ""} */}
                                    {minutesToHourMinuteString(pkg.duration)}
                                    <Clock3 size={16} strokeWidth={1.5} />
                                </div>

                                <div className="px-2 sm:px-4 py-3 pb-0 flex-1 flex flex-col justify-between">
                                    <p className="text-xs sm:text-sm font-normal text-gray-800 text-center">
                                        {pkg.name}
                                    </p>
                                    <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out overflow-hidden flex justify-center gap-2 mt-3 sm:mt-4">
                                        {/* <div className="flex items-center justify-center">
                                            <FancyButton />
                                        </div> */}

                                        {/* <Link to={`/booking/${pkg.id}`}> */}
                                        <Button
                                            onClick={() => book(pkg)}
                                            variant="outline"
                                            className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-white border-[#0191e9] rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                                        >
                                            Book Now
                                        </Button>
                                        {/* </Link> */}

                                        <Link to={`/itinerary/${pkg.id}`}>
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
                        </CarouselItem>
                    ))}

                    {/* View More Card */}
                    <CarouselItem className="pl-2 sm:pl-4 pb-4 sm:pb-6 basis-10/12 xs:basis-1/2 sm:basis-1/3 lg:basis-1/4">
                        <div
                            onClick={() => navigate("/murdeshwarpackages")}
                            className="flex flex-col justify-center items-center transition-all duration-300 text-center h-full p-4 sm:p-8 group bg-white cursor-pointer rounded-2xl hover:shadow-xl"
                        >
                            <p className="text-base sm:text-lg font-normal Poppins text-[#0191e9] group-hover:underline">
                                View More Packages
                            </p>
                            <Button
                                variant="outline"
                                className="mt-3 sm:mt-4 cursor-pointer text-white font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-white border-[#0191e9] rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                            >
                                Explore All
                            </Button>
                        </div>
                    </CarouselItem>
                </CarouselContent>

                {/* Custom Arrows */}
                <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-2 sm:left-[-40px] text-[#0191e9] top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 hover:scale-110 transition-transform duration-300"
                >
                    <ChevronLeft
                        size={window.innerWidth >= 640 ? 55 : 30}
                        strokeWidth={1}
                    />

                </button>
                <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-2 sm:right-[-40px] text-[#0191e9] top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 hover:scale-110 transition-transform duration-300"
                >
                    <ChevronRight
                        size={window.innerWidth >= 640 ? 55 : 30}
                        strokeWidth={1}
                    />
                </button>
            </Carousel>

            {/* Decorative Waves */}
            <div className="ocean mt-6 sm:mt-10">
                <div className="wave"></div>
                <div className="wave"></div>
                <div className="wave"></div>
            </div>
        </div>
    );
}
