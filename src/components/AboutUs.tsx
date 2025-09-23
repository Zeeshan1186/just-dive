import banner from "../assets/images/About_ban.png";
import about from "../assets/images/blog1.png";
import waves from "../assets/images/Waves.png";
import bluewaves from "../assets/images/Bluewave.png";
import img1 from "../assets/images/about.png";

function AboutUs() {
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
                        About Us
                    </h1>
                </div>
            </div>

            {/* About Section */}
            <section className="py-10 px-4 sm:px-6 md:px-10 lg:px-20 bg-white">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    {/* Left Image */}
                    <div className="hidden md:flex w-full md:w-1/2 justify-center md:justify-start">
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
                            About Us
                        </h2>
                        <p className="text-gray-700 mb-4">
                            Just Dive Murdeshwar is a premier PADI-certified scuba diving center offering world-class diving experiences and professional PADI courses at Netrani Island, Karnataka. Established in 2023, the company quickly gained recognition for its commitment to safety, quality, and excellence in diving education.
                        </p>
                        <p className="text-gray-700">
                            The dive center offers a range of programs catering to both beginners and experienced divers. From fun diving experiences for first-timers to advanced PADI certification courses, Just Dive provides a structured and enjoyable approach to learning scuba diving. The clear waters of Netrani Island, known for their rich marine biodiversity, make it an ideal location to explore coral reefs, schools of vibrant fish, and occasional sightings of reef sharks and turtles.
                        </p>
                    </div>
                </div>
            </section>

            {/* Bottom Banner */}
            <div className="my-10 sm:my-12">
                <img
                    src={about}
                    alt="diving banner"
                    className="w-full h-60 sm:h-72 md:h-[80vh] object-cover rounded-lg"
                />
            </div>
        </>
    );
}

export default AboutUs;
