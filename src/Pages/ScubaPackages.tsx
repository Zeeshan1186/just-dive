"use client";

import { Button } from "@/components/ui/button";
import { Clock3 } from "lucide-react";
import wave from "../assets/images/Bluewave.png";
import { Link } from "react-router-dom";
import turtor from '../assets/Animation - 1750418255641.json';
import Lottie from 'react-lottie-player';
import { useEffect, useState } from "react";
import { getactivePackages } from "../services/apiService"; // ✅ correct API for list
import { toast } from "react-hot-toast";
import { FancyButton } from "@/components/FancyButton";


export default function ScubaPackages() {
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
            <span className="absolute top-10 left-200"> <Lottie
                loop
                play
                animationData={turtor}
                style={{ width: '30%', height: '100%' }}
            /></span>
            {/* Grid instead of Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {packages.map((pkg, index) => (
                    <div
                        key={index}
                        className=" pb-6 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                        <div className="group relative pb-4 Poppins hover:bg-white overflow-hidden transition-all duration-500 ease-in-out hover:shadow-xl border-[#e1e1e1] hover:border-1 hover:rounded-2xl flex flex-col transform hover:-translate-y-2">
                            <div className="p-4 group overflow-hidden rounded-4xl">
                                <img
                                    src={pkg.package_image}
                                    alt={pkg.name}
                                    width={400}
                                    height={500}
                                    className="w-full h-80 object-cover rounded-4xl transform transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            <div className="absolute bottom-31 right-2 bg-[#0191e9] text-white font-normal text-sm px-5 py-1.5 rounded-full flex items-center gap-1">
                                {pkg.duration} Hour{pkg.duration > 1 ? "s" : ""}
                                <Clock3 size={18} strokeWidth={1.5} />
                            </div>

                            <div className="px-4 py-3 pb-0 flex-1 flex flex-col justify-between">
                                <p className="text-sm font-normal text-gray-800 text-center">
                                    {pkg.name}
                                </p>
                                <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-in-out overflow-hidden flex justify-center gap-1 mt-4">
                                    <div className="flex items-center justify-center">
                                        <FancyButton />
                                    </div>

                                    <Link to={`/itinerary/${pkg.id}`}>
                                        <Button
                                            variant="outline"
                                            className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-white border-[#0191e9] rounded-full text-sm px-4 py-2"
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
        </div>
    );
}
