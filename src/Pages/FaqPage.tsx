import banner from "../assets/images/blog2.png";
import bluewaves from "../assets/images/Bluewave.png";
import waves from "../assets/images/Waves.png";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CTA from "@/components/CTA";

function FaqPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const toggleAccordion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const whyChooseData = [
        {
            title: "Abundant Marine Life",
            content:
                "Dive into a world of vibrant marine biodiversity around Grand Island. Spot rainbow-colored parrotfish, curious dolphins, sea turtles, and a stunning variety of corals in their natural habitat.",
        },
        {
            title: "Perfect for Beginners & Pros",
            content:
                "Whether it's your first dive or your hundredth, Grand Island offers ideal scuba conditions for all skill levels—with certified instructors ensuring safety and comfort throughout.",
        },
        {
            title: "Spectacular Underwater Scenery",
            content:
                "Discover breathtaking underwater landscapes—from coral gardens to rocky reefs and hidden caves. Every dive is a new adventure waiting to unfold.",
        },
        {
            title: "Easy Access from Goa Hotspots",
            content:
                "Conveniently located near Goa’s top attractions, Grand Island lets you combine your scuba adventure with the best of sightseeing, beaches, and nightlife.",
        },
        {
            title: "Have Questions? We’ve Got Answers",
            content:
                "Curious about safety, requirements, or what to expect? Check out our Scuba Diving FAQ section for everything you need to know before your dive.",
        },
    ];

    return (
        <>
            {/* Hero Banner */}
            <div
                className="relative flex justify-center items-center h-[45vh] sm:h-[55vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-2">
                        <img src={waves} alt="waves" className="w-8 sm:w-10" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-4 text-center">
                        FAQ
                    </h1>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 px-4 sm:px-8 md:px-16 py-8 sm:py-10">
                <div className="flex flex-col justify-center items-center pb-2 px-2">
                    <img
                        src={bluewaves}
                        alt="waves"
                        className="mx-auto mb-2 w-8 sm:w-10 md:w-12 pb-2"
                    />
                    <h2 className="text-2xl sm:text-3xl md:text-4xl Trirong font-normal text-gray-800 mb-4 text-center">
                        Essential Info, Instantly
                    </h2>
                </div>

                {/* Accordions */}
                {whyChooseData.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={idx}
                            className="border rounded bg-[#0392ea] text-white overflow-hidden"
                        >
                            <button
                                onClick={() => toggleAccordion(idx)}
                                className="w-full flex items-center cursor-pointer justify-between px-3 sm:px-4 py-2 sm:py-3 text-left font-semibold text-sm sm:text-base"
                            >
                                <span>{item.title}</span>
                                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                            <div
                                className={`bg-white text-gray-700 px-3 sm:px-4 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[300px] py-3" : "max-h-0 py-0"
                                    }`}
                            >
                                <p className="text-sm sm:text-base">{item.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <CTA />
        </>
    );
}

export default FaqPage;
