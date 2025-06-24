import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageById } from "../services/apiService"; // ✅ use correct API call
import { ChevronDown, ChevronUp, Pencil, Timer } from "lucide-react";

import RightBookingCard from "@/components/RightBookingCard";
import Clients from "@/components/Clients";
import CTA from "@/components/CTA";
import waves from "../assets/images/Waves.png";

function ItineraryCardPage() {
    const { packageId } = useParams();
    const [packageData, setPackageData] = useState<any>(null);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!packageId) {
                    console.error("Package ID not found in URL");
                    return;
                }
                const response = await getPackageById(Number(packageId));

                setPackageData(response?.data?.data || null);
            } catch (error) {
                console.error("Error fetching package:", error);
            }
        };

        fetchData();
    }, [packageId]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    if (!packageData) return <div className="p-10 text-4xl Poppins text-center">Loading...</div>;

    return (
        <>
            {/* Banner Section */}
            <div
                className="relative flex justify-center items-center h-[75vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${packageData.page_image})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl Trirong font-normal leading-tight mb-6">
                        {packageData.name}
                    </h1>
                    <p className="mb-6 text-3xl Poppins flex items-center">
                        ₹ {packageData.price}
                    </p>
                </div>
            </div>

            {/* Main Layout */}
            <div className="relative flex justify-between px-10 gap-6">
                {/* Left Main Content */}
                <div className="w-full lg:w-[70%]">
                    <div className="flex flex-col Poppins gap-6 py-8 max-w-7xl">
                        <div className="w-full space-y-6">
                            {/* Itinerary Heading */}
                            <div>
                                <h2 className="text-4xl font-semibold mb-3">Itinerary</h2>
                                <h2 className="text-2xl Trirong font-normal mb-1">{packageData.services}</h2>
                                <p className="text-gray-600 Trirong">{packageData.location?.location_name}</p>
                                <div className="flex items-center gap-2 text-sm mt-2">
                                    <span>🕒</span>
                                    <span>{packageData.duration} Hours</span>
                                </div>
                            </div>

                            {/* Service Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse rounded-md overflow-hidden">
                                    <thead className="bg-[#b89d53] text-white">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-normal">Services</th>
                                            <th className="px-4 py-2 text-left font-normal">Duration</th>
                                            <th className="px-4 py-2 text-left font-normal">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-white text-lg text-[#3D3D3D] font-normal border-t">
                                            <td className="px-4 py-2">{packageData.services}</td>
                                            <td className="px-4 py-2">{packageData.duration} Hours</td>
                                            <td className="px-4 py-2">₹ {packageData.price}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Vehicle Info */}
                            <div>
                                <div className="bg-[#b89d53] text-white px-4 py-2 font-medium">Vehicle</div>
                                <p className="py-4 px-4 pb-0 bg-white text-lg text-gray-800 whitespace-pre-line">
                                    {packageData.vehicle}
                                </p>
                            </div>

                            {/* Package Image */}
                            {packageData.package_image && (
                                <div>
                                    <img
                                        src={packageData.package_image}
                                        alt="Package"
                                        className="w-full h-100 rounded-lg object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Schedule & Must Read */}
                    <div className="max-w-7xl mx-auto py-5 Poppins space-y-10">
                        {/* Schedule */}
                        <div>
                            <div className="flex gap-2 bg-[#b89d53] text-white px-4 py-2 mb-4">
                                <Timer />
                                <h2 className="text-md Poppins font-normal">Schedule</h2>
                            </div>
                            <div className="space-y-6 pl-4 relative border-l-2 border-[#B9B9B9]">
                                {packageData.schedules?.map((item: any, idx: number) => (
                                    <div key={idx} className="relative pl-2 text-gray-800">
                                        <span className="absolute -left-6 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                                        <p>{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Must Read */}
                        {packageData.mustReads?.map((must: any, idx: number) => (
                            <div key={idx} className="flex flex-col mt-10 md:flex-row gap-6">
                                {/* Must Read Image */}
                                {must.photo && (
                                    <div className="w-full md:w-1/2">
                                        <img
                                            src={must.photo}
                                            alt="Must Read"
                                            className="rounded-md w-full object-cover max-h-[65vh] h-[70vh]"
                                        />
                                    </div>
                                )}

                                {/* Must Read Description */}
                                <div className="w-full md:w-100">
                                    <div className="flex gap-2 bg-[#b89d53] text-white px-4 py-2 mb-4">
                                        <Pencil className="w-5" />
                                        <h2 className=" text-md Poppins font-normal">Must Read</h2>
                                    </div>
                                    <ul className="list-none space-y-2 text-gray-800 whitespace-pre-line">
                                        {must.description.split("\n").map((line: string, i: number) => (
                                            <li key={i}>{line.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Why Choose Us */}
                    <div className="max-w-6xl pb-10">
                        <h2 className="text-2xl md:text-3xl Poppins font-semibold mb-4 text-center md:text-left">
                            Why Choose {packageData.name}?
                        </h2>
                        <div className="space-y-4">
                            {packageData.whyChooseUs?.map((item: any, idx: number) => {
                                const isOpen = openIndex === idx;
                                return (
                                    <div key={idx} className="border rounded bg-[#c3a95b] text-white overflow-hidden">
                                        <button
                                            onClick={() => toggleAccordion(idx)}
                                            className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold"
                                        >
                                            <span>{item.title}</span>
                                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                                        </button>
                                        <div
                                            className={`bg-white text-gray-700 px-4 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[300px] py-4" : "max-h-0 py-0"
                                                }`}
                                        >
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Notes */}
                        <div className="mt-12">
                            <div className="flex items-center gap-2 mb-4">
                                <Pencil className="w-5 h-5" />
                                <h3 className="text-xl font-semibold">Note</h3>
                            </div>
                            <div className="relative border-l-2 border-[#B9B9B9] pl-6 space-y-5">
                                {packageData.notes?.map((note: any, idx: number) => (
                                    <div key={idx} className="relative text-sm md:text-base">
                                        <span className="absolute -left-8 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                                        <p>{note.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sticky Booking */}
                <div className="hidden lg:block w-[30%] pl-10">
                    <div className="sticky top-20">
                        <RightBookingCard />
                    </div>
                </div>
            </div>

            <CTA />
            <Clients />
        </>
    );
}

export default ItineraryCardPage;
