"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import wave from "../assets/images/Bluewave.png";
import package1 from "../assets/images/Packages/Package1.png";
import package2 from "../assets/images/Packages/Package2.png";
import package3 from "../assets/images/Packages/Package3.png";
import package4 from "../assets/images/Packages/Package4.png";
import { Clock3 } from "lucide-react";


const packages = [
    {
        id: 1,
        title: "SCUBA DIVING AT GRAND ISLAND IN GOA",
        duration: "2 Hours",
        image: package1,
    },
    {
        id: 2,
        title: "SCUBA DIVING AT GRAND ISLAND IN GOA",
        duration: "30 Minutes",
        image: package2,
    },
    {
        id: 3,
        title: "SCUBA DIVING AT GRAND ISLAND IN GOA",
        duration: "1 Hour",
        image: package3,
    },
    {
        id: 4,
        title: "SCUBA DIVING AT GRAND ISLAND IN GOA",
        duration: "2 Hours",
        image: package4,
    },
    {
        id: 5,
        isViewMore: true,
    }
];

export default function Packages() {
    return (
        <div className="w-full px-18 py-8 pb-4">
            <div className="flex flex-col justify-center items-center">
                <img src={wave} alt="Wave" className="w-10 items-center mb-4" />
                <h2 className="text-center Trirong text-[#626262] text-4xl font-normal mb-2">SPECIAL DIVE PACKAGE</h2>
                <p className="text-center text-gray-600 Poppins text-[#626262] mb-6">Experience incredible emotions discovering new amazing underwater worlds with JUST DIVE</p>
            </div>

            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-screen-xl mx-auto">
                <CarouselContent className="-ml-4">
                    {packages.map((pkg, index) => (
                        <CarouselItem key={index} className="pl-4 pb-6 basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            {pkg.isViewMore ? (
                                <div className="group relative pb-4 Poppins hover:bg-white  overflow-hidden transition-all duration-300 hover:shadow-xl border-[#e1e1e1] hover:border-1 hover:rounded-2xl flex flex-col">
                                    <div className="p-4">
                                        <img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            width={400}
                                            height={500}
                                            className="w-full h-80 object-cover rounded-4xl"
                                        />
                                    </div>

                                    {/* Duration badge */}
                                    <div className="absolute bottom-31 right-2 bg-[#b89d53] text-white font-normal text-sm px-5 py-1.5 rounded-full flex items-center gap-1">
                                        {pkg.duration}
                                        <Clock3 size={18} strokeWidth={1.5} />
                                    </div>

                                    {/* Content section */}
                                    <div className="px-4 py-3 pb-0 flex-1 flex flex-col justify-between">
                                        <p className="text-sm font-normal text-gray-800 text-center">{pkg.title}</p>

                                        {/* Hidden buttons on hover */}
                                        <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden flex justify-center gap-2 mt-4">
                                            <Button variant="outline" className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2">
                                                Book Now
                                            </Button>
                                            <Button variant="outline" className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2">
                                                Know More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="group relative pb-4 Poppins hover:bg-white  overflow-hidden transition-all duration-300 hover:shadow-xl border-[#e1e1e1] hover:border-1 hover:rounded-2xl flex flex-col">
                                    <div className="p-4">
                                        <img
                                            src={pkg.image}
                                            alt={pkg.title}
                                            width={400}
                                            height={500}
                                            className="w-full h-80 object-cover rounded-4xl"
                                        />
                                    </div>

                                    {/* Duration badge */}
                                    <div className="absolute bottom-31 right-2 bg-[#b89d53] text-white font-normal text-sm px-5 py-1.5 rounded-full flex items-center gap-1">
                                        {pkg.duration}
                                        <Clock3 size={18} strokeWidth={1.5} />
                                    </div>

                                    {/* Content section */}
                                    <div className="px-4 py-3 pb-0 flex-1 flex flex-col justify-between">
                                        <p className="text-sm font-normal text-gray-800 text-center">{pkg.title}</p>

                                        {/* Hidden buttons on hover */}
                                        <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-300 overflow-hidden flex justify-center gap-2 mt-4">
                                            <Button variant="outline" className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2">
                                                Book Now
                                            </Button>
                                            <Button variant="outline" className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2">
                                                Know More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="flex justify-center items-center">
                <Button variant="outline" className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-white border-[#b89d53] rounded-full text-sm px-4 py-2">
                    View More
                </Button>
            </div>
        </div>
    );
}
