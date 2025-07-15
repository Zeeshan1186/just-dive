import CountUp from "react-countup";
import diver from "../assets/images/diver.png";
import diverbg from "../assets/images/diverbg.png";
import waves from "../assets/images/Bluewave.png";

const HomeAbout = () => {
    return (
        <section className="flex flex-col md:flex-row items-center gap-10 px-6 py-12 max-w-7xl mx-auto">
            {/* Left Image */}
            <div className="relative w-full md:w-1/2 flex justify-center">
                <img
                    src={diverbg} // replace with actual path
                    alt="Scuba Diver"
                    className="max-w-[80%] md:max-w-[80%]"
                />

                <div
                    style={{
                        animation: "float 3s ease-in-out infinite",
                        transformOrigin: "center",
                    }}
                    className="w-[80%] absolute text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <img
                        src={diver}
                        alt="Scuba Diver"
                        className="max-w-[100%] md:max-w-full"
                    />
                </div>


            </div>

            {/* Right Content */}
            <div className="w-full md:w-[50%] text-center md:text-left">
                <img src={waves} alt="" className="w-12 mb-5" />
                <h2 className="text-3xl md:text-5xl Trirong font-normal mb-4">About Us</h2>
                <p className="text-gray-600 mb-6 Poppins text-[#3C3C3C] leading-relaxed">
                    Just Dive Murdeshwar is a premier PADI-certified scuba diving center
                    offering world-class diving experiences and professional PADI courses
                    at Netrani Island, Karnataka. Established in 2023, the company quickly
                    gained recognition for its commitment to safety, quality, and
                    excellence in diving education.
                </p>
                <div className="flex flex-col items-center sm:flex-row justify-around text-center gap-6 sm:gap-0">
                    <div>
                        <button className="w-28 text-white font-normal bg-[#0191e9] hover:text-[#0191e9] transition hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2">
                            Read More
                        </button>
                    </div>

                    {/* Counters */}
                    <div>
                        <h3 className="text-[#0191e9] text-4xl Trirong  font-bold">
                            <CountUp end={25} duration={2} />+
                        </h3>
                        <p className="mt-1 text-black font-medium Poppins">Years Of Experience</p>
                    </div>
                    <div className="border-l border-gray-300 px-6">
                        <h3 className="text-[#0191e9] text-4xl Trirong  font-bold">
                            <CountUp end={3000} duration={3} />+
                        </h3>
                        <p className="mt-1 text-black font-medium Poppins">Happy Customers</p>
                    </div>
                    <div className="border-l border-gray-300 px-6">
                        <h3 className="text-[#0191e9] text-4xl Trirong  font-bold">
                            <CountUp end={100} duration={2} />%
                        </h3>
                        <p className="mt-1 text-black font-medium Poppins">Top Rated Service</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HomeAbout;
