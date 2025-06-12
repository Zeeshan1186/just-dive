"use client";

import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import wave from "../assets/images/Bluewave.png";
import package1 from "../assets/images/Packages/Package1.png";
import package2 from "../assets/images/Packages/Package2.png";
import package3 from "../assets/images/Packages/Package3.png";
import package4 from "../assets/images/Packages/Package4.png";
import { Link } from "react-router-dom";

const packages = [
    { id: 1, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "2 Hours", image: package1 },
    { id: 2, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "30 Minutes", image: package2 },
    { id: 3, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "1 Hour", image: package3 },
    { id: 4, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "2 Hours", image: package4 },
    { id: 4, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "2 Hours", image: package2 },
    { id: 4, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "2 Hours", image: package1 },
    { id: 4, title: "SCUBA DIVING AT GRAND ISLAND IN GOA", duration: "2 Hours", image: package3 },

];

export default function ScubaPackages() {
    return (
        <div className="w-full px-20 pt-10 pb-0 relative">
            {/* Title Section */}
            <div className="flex flex-col justify-center items-center text-center mb-6">
                <img src={wave} alt="Wave" className="w-10 mb-4" />
                <h2 className="Trirong text-[#626262] text-4xl font-normal mb-2">
                    SPECIAL DIVE PACKAGE
                </h2>
                <p className="Poppins text-[#626262]">
                    Experience incredible emotions discovering new amazing underwater
                    worlds with JUST DIVE
                </p>
            </div>

            {/* Grid instead of Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className="group relative pb-4 Poppins hover:bg-white overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl border-[#e1e1e1] hover:border-1 hover:rounded-2xl flex flex-col transform hover:-translate-y-2"
                    >
                        <div className="p-4">
                            <img
                                src={pkg.image}
                                alt={pkg.title}
                                width={400}
                                height={500}
                                className="w-full h-80 object-cover rounded-4xl"
                            />
                        </div>

                        <div className="absolute bottom-31 right-2 bg-[#b89d53] text-white font-normal text-sm px-5 py-1.5 rounded-full flex items-center gap-1">
                            {pkg.duration}
                            <Clock3 size={18} strokeWidth={1.5} />
                        </div>

                        <div className="px-4 py-3 pb-0 flex-1 flex flex-col justify-between">
                            <p className="text-sm font-normal text-gray-800 text-center">
                                {pkg.title}
                            </p>
                            <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out overflow-hidden flex justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2"
                                >
                                    Book Now
                                </Button>
                                <Link to="/itinerypage">
                                    <Button
                                        variant="outline"
                                        className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2"
                                    >
                                        Know More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* View More Card
                <div className="pl-4 pb-6 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="flex flex-col justify-center items-center transition-all duration-300 text-center h-full p-8 group bg-white cursor-pointer">
                        <p className="text-lg font-normal Poppins text-[#b89d53] group-hover:underline">
                            View More Packages
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4 text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2"
                        >
                            Explore All
                        </Button>
                    </div>
                </div> */}
            </div>
        </div>
    );
}
