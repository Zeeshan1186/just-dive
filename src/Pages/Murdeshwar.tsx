import banner from "../assets/images/About_ban.webp";
import waves from "../assets/images/Waves.webp";
import bluewaves from "../assets/images/Bluewave.webp";
import img1 from "../assets/images/about.webp";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import cta from "../assets/images/cta.webp";
import { Button } from "@/components/ui/button";

function Murdeshwar() {
    return (
        <>
            {/* Top Banner */}
            <div
                className="relative flex justify-center items-center h-[50vh] sm:h-[60vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" className="w-12 sm:w-16" />
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal leading-tight mb-4 sm:mb-6">
                        Just Dive Murdeshwar
                    </h1>
                </div>
            </div>

            {/* About Section */}
            <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-20 bg-white">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Left Image */}
                    <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                        <img
                            src={img1}
                            alt="scuba"
                            className="rounded-2xl w-full max-w-[400px] md:max-w-none md:w-[80%] h-auto object-cover"
                        />
                    </div>

                    {/* Right Text */}
                    <div className="w-full md:w-1/2 Poppins text-center md:text-left">
                        <img
                            src={bluewaves}
                            alt="icon"
                            className="mb-3 w-8 sm:w-10 mx-auto md:mx-0 block"
                        />
                        <h2 className="text-2xl sm:text-3xl md:text-4xl Trirong font-normal mb-4">
                            About Murdeshwar
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Just Dive Murdeshwar is a premier PADI-certified scuba diving center offering world-class diving experiences and professional PADI courses at Netrani Island, Karnataka. Established in 2023, the company quickly gained recognition for its commitment to safety, quality, and excellence in diving education.
                        </p>
                        <p className="text-gray-700">
                            The dive center offers a range of programs catering to both beginners and experienced divers. From fun diving experiences for first-timers to advanced PADI certification courses, Just Dive provides a structured and enjoyable approach to learning scuba diving. The clear waters of Netrani Island, known for their rich marine biodiversity, make it an ideal location to explore coral reefs, schools of vibrant fish, and occasional sightings of reef sharks and turtles.
                        </p>

                        {/* Counters */}
                        <div className="flex mt-10 justify-between">
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
                        <div className="mt-6">
                            <Link to={`/murdeshwarpackages`}>
                                <Button className="w-28 cursor-pointer text-white font-normal bg-[#0191e9] hover:text-[#0191e9] transition hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>

            </section>

            {/* Bottom Banner */}
            <div
                className="relative w-full h-[60vh] md:h-[65vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${cta})` }} // adjust path as needed
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Text and buttons */}
                <div className="relative z-10 text-center px-4 text-white">
                    <h2 className=" text-3xl md:text-5xl font-bold capitalize mb-4 leading-tight">
                        Feel free to  <br />
                        contact us
                    </h2>
                    <p> We also offer a range of additional services <br />
                        to enhance your holiday experience
                    </p>

                    <div className="flex Poppins justify-center gap-3 mt-8 flex-wrap">
                        <Link to={`/contactus`}>
                            <Button className="text-white cursor-pointer font-normal bg-[#0191e9] hover:text-white hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Murdeshwar;
