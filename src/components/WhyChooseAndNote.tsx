import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";

const WhyChooseAndNote = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    const whyChooseData = [
        {
            title: "Abundant Marine Life",
            content:
                "The waters around Grand Island are teeming with vibrant fish, corals, and other fascinating marine creatures. From rainbow-coloured parrotfish and playful dolphins to elusive sea turtles, you’ll witness a kaleidoscope of underwater life.",
        },
        {
            title: "Ideal Conditions for Beginners and Experts",
            content:
                "Grand Island offers diving conditions that suit both first-timers and experienced divers, ensuring a safe and enjoyable underwater experience for everyone.",
        },
        {
            title: "Stunning Underwater Landscapes",
            content:
                "Explore stunning underwater terrain, reefs, and caves that make Grand Island a must-visit for scuba lovers.",
        },
        {
            title: "Proximity to Goa’s Major Attractions",
            content:
                "Located near major tourist destinations in Goa, you can easily combine scuba diving with your other sightseeing plans.",
        },
    ];

    const noteList = [
        "Incase of specs not to worry as the scuba gears are multifocal.",
        "10 yrs and above can enjoy all activities.",
        "Compulsory follow the instructions given by the instructors.",
        "Swim Suit is not included in the package.",
        "Scuba video is complimentary but sometimes due to technical errors the video can be corrupted or dull.",
        "For scuba video please contact the coordinator after completion of activity at the EOD and also take the contact details if the video is being shared later.",
        "Make sure to check if video shared are received before leaving the venue, later send the same videos to your Trip advisor for the safety incase you delete or misplaced them.",
        "If any change in plans do inform us atleast 48 hrs prior else no refunds will be processed.",
        "Incase you inform us after 48 hrs and before 24 hrs the amount paid for booking will be added in SWS Wallet within 3 days of your account. Please register on our website for the same.",
        "Incase of rescheduling we will charge 50% of the total amount paid while booking the activity.",
        "This booking is non transferrable.",
    ];

    return (
        <div className="max-w-6xl pb-10">
            {/* Heading */}
            <h2 className="text-2xl md:text-3xl Poppins font-semibold mb-4 text-center md:text-left">
                Why Choose Grand Island Scuba Diving?
            </h2>

            {/* Accordion */}
            <div className="space-y-4">
                {whyChooseData.map((item, idx) => {
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
                                <p>{item.content}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Note Section */}
            <div className="mt-12">
                <div className="flex items-center gap-2 mb-4">
                    <Pencil className="w-5 h-5" />
                    <h3 className="text-xl font-semibold">Note</h3>
                </div>

                <div className="relative border-l-2 border-[#B9B9B9] pl-6 space-y-5">
                    {noteList.map((note, i) => (
                        <div key={i} className="relative text-sm md:text-base">
                            <span className="absolute -left-8 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                            <p>{note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WhyChooseAndNote;
