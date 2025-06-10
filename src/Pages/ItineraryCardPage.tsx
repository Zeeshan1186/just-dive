import Clients from '@/components/Clients';
import CTA from '@/components/CTA';
import ItineraryCard from '@/components/ItineraryCard';
import RightBookingCard from '@/components/RightBookingCard';
import ScheduleSection from '@/components/ScheduleSection';
import WhyChooseAndNote from '@/components/WhyChooseAndNote';
import banner from "../assets/images/itinenary_ban.png";
import waves from "../assets/images/Waves.png";

function ItineraryCardPage() {
    return (
        <>
            <div
                className="relative flex justify-center items-center h-[75vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl Trirong md:text-5xl font-normal leading-tight mb-6">
                        Scuba Diving At Grand Island
                    </h1>
                    <p className="mb-6 text-3xl Poppins flex items-center">
                        ₹ 1500 ₹ 2000 25% Off
                    </p>
                </div>
            </div>
            <div className="relative flex justify-between px-10 gap-6">
                {/* Left Main Content */}
                <div className="w-full lg:w-[70%]">
                    <ItineraryCard />
                    <ScheduleSection />
                    <WhyChooseAndNote />
                </div>

                {/* Right Booking Sticky Sidebar */}
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
