import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPackageById } from "../services/apiService"; // ✅ correct API call
import { ChevronDown, ChevronUp, Loader2, Pencil, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

import RightBookingCard from "@/components/RightBookingCard";
import Clients from "@/components/Clients";
import CTA from "@/components/CTA";
import waves from "../assets/images/Waves.png";
import { minutesToHourMinuteString } from "@/utils/common-function";
import { Button } from "@/components/ui/button";

function ItineraryCardPage() {
    // const { packageId } = useParams();
    const location = useLocation();
    const packageId = location.state?.packageId;
    const [packageData, setPackageData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [packageId]);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };
    const book = () => {
        localStorage.setItem("selectedLocation", packageData.location.location_name);
        localStorage.setItem("selectedPackageId", packageData.id.toString());
        localStorage.setItem("selectedPackageName", packageData.name);
        navigate(`/booking/${packageData.id}`);
    };

    // if (loading)
    //     return
    // <div className="p-10 text-2xl sm:text-3xl Poppins text-center">
    //     <Loader2 className=" animate-spin" />
    // </div>;

    return (
        <>
            {loading ?
                <div className="flex h-60 items-center justify-center text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
                </div>
                :
                <>
                    {/* Banner Section */}
                    <div
                        className="relative flex justify-center items-center h-[50vh] sm:h-[65vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: `url(${packageData?.page_image})` }}
                    >
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                            <div className="mb-4">
                                <img src={waves} alt="" className="w-10 sm:w-12" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-4 text-center">
                                {packageData?.name}
                            </h1>
                            <p className="text-xl sm:text-2xl md:text-3xl Poppins flex items-center">
                                ₹ {packageData?.price}
                            </p>
                            <Button
                                onClick={book}
                                className="mt-5 block md:hidden animate-pulse cursor-pointer text-white Poppins font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border border-[#0191e9] rounded-full text-sm px-4 py-2"
                            >
                                Book Now
                            </Button>

                        </div>
                    </div>

                    {/* Main Layout */}
                    <div className="relative flex flex-col lg:flex-row justify-between px-4 sm:px-8 md:px-10 lg:px-16 gap-6">
                        {/* Left Main Content */}
                        <div className="w-full lg:w-[70%]">
                            <div className="flex flex-col Poppins gap-6 py-8 max-w-7xl">
                                <div className="w-full space-y-6">
                                    {/* Itinerary Heading */}
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3">Itinerary</h2>
                                        <h2 className="text-xl sm:text-2xl Trirong font-normal mb-1">{packageData?.services}</h2>
                                        <p className="text-gray-600 Trirong text-sm sm:text-base">
                                            {packageData?.location?.location_name}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm mt-2">
                                            <span role="img" aria-label="clock">🕒</span>
                                            <span>{minutesToHourMinuteString(packageData?.duration)}</span>
                                        </div>
                                    </div>

                                    {/* Service Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border-collapse rounded-md overflow-hidden text-sm sm:text-base">
                                            <thead className="bg-[#0191e9] text-white">
                                                <tr>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-normal">Services</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-normal">Duration</th>
                                                    <th className="px-3 sm:px-4 py-2 text-left font-normal">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-white text-gray-800 font-normal border-t">
                                                    <td className="px-3 sm:px-4 py-2">{packageData?.services}</td>
                                                    <td className="px-3 sm:px-4 py-2">{minutesToHourMinuteString(packageData?.duration)}</td>
                                                    <td className="px-3 sm:px-4 py-2">₹ {packageData?.price}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Vehicle Info */}
                                    <div>
                                        <div className="bg-[#0191e9] text-white px-3 sm:px-4 py-2 font-medium">
                                            Vehicle
                                        </div>
                                        <p className="py-4 px-3 sm:px-4 pb-0 bg-white text-sm sm:text-lg text-gray-800 whitespace-pre-line">
                                            {packageData?.vehicle}
                                        </p>
                                    </div>

                                    {/* Package Image */}
                                    {packageData?.package_image && (
                                        <div>
                                            <img
                                                src={packageData?.package_image}
                                                alt="Package"
                                                className="w-full rounded-lg object-cover max-h-[60vh]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schedule & Must Read */}
                            <div className="max-w-7xl mx-auto py-5 Poppins space-y-10">
                                {/* Schedule */}
                                <div>
                                    <div className="flex gap-2 bg-[#0191e9] text-white px-3 sm:px-4 py-2 mb-4">
                                        <Timer />
                                        <h2 className="text-md Poppins font-normal">Schedule</h2>
                                    </div>
                                    <div className="space-y-6 pl-4 relative border-l-2 border-[#B9B9B9]">
                                        {packageData?.schedules?.map((item: any, idx: number) => (
                                            <div key={idx} className="relative pl-2 text-gray-800">
                                                <span className="absolute -left-6 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                                                <p className="text-sm sm:text-base">{item.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Must Read */}
                                {packageData?.mustReads?.map((must: any, idx: number) => (
                                    <div key={idx} className="flex flex-col md:flex-row gap-4 sm:gap-6 mt-10">
                                        {must.photo && (
                                            <div className="w-full md:w-1/2">
                                                <img
                                                    src={must.photo}
                                                    alt="Must Read"
                                                    className="rounded-md w-full object-cover max-h-[50vh]"
                                                />
                                            </div>
                                        )}
                                        <div className="w-full md:w-1/2">
                                            <div className="flex gap-2 bg-[#0191e9] text-white px-3 sm:px-4 py-2 mb-4">
                                                <Pencil className="w-5" />
                                                <h2 className="text-md Poppins font-normal">Must Read</h2>
                                            </div>
                                            <ul className="list-none space-y-2 text-gray-800 whitespace-pre-line">
                                                {must.description.split("\n").map((line: string, i: number) => (
                                                    <li key={i} className="text-sm sm:text-base">{line.trim()}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Why Choose Us */}
                            <div className="max-w-6xl pb-10">
                                <h2 className="text-xl sm:text-2xl md:text-3xl Poppins font-semibold mb-4 text-center md:text-left">
                                    Why Choose {packageData?.name}?
                                </h2>
                                <div className="space-y-4">
                                    {packageData?.whyChooseUs?.map((item: any, idx: number) => {
                                        const isOpen = openIndex === idx;
                                        return (
                                            <div key={idx} className="border rounded bg-[#0191e9] text-white overflow-hidden">
                                                <button
                                                    onClick={() => toggleAccordion(idx)}
                                                    className="w-full flex cursor-pointer items-center justify-between px-3 sm:px-4 py-3 text-left font-semibold"
                                                >
                                                    <span>{item.title}</span>
                                                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                                                </button>
                                                <div
                                                    className={`bg-white text-gray-700 px-3 sm:px-4 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[300px] py-4" : "max-h-0 py-0"
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
                                        <h3 className="text-lg sm:text-xl font-semibold">Note</h3>
                                    </div>
                                    <div className="relative border-l-2 border-[#B9B9B9] pl-6 space-y-4">
                                        {packageData?.notes?.map((note: any, idx: number) => (
                                            <div key={idx} className="relative text-sm sm:text-base">
                                                <span className="absolute -left-8 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                                                <p>{note.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Sticky Booking */}
                        <div className="hidden lg:block w-full lg:w-[30%] pl-0 lg:pl-10">
                            <div className="sticky top-20">
                                <RightBookingCard packageData={packageData} />
                            </div>
                        </div>
                    </div>

                    <CTA />
                    <Clients />
                </>
            }
        </>
    );
}

export default ItineraryCardPage;
