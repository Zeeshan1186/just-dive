import banner from "../assets/images/About_ban.png";
import about from "../assets/images/about2.png";
import waves from "../assets/images/Waves.png";
import img1 from "../assets/images/about.png";

function AboutUs() {
    return (
        <>
            <div
                className="relative flex justify-center items-center h-[65vh] bg-cover bg-no-repeat bg-right"
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
                        About Us
                    </h1>
                </div>
            </div>
            <section className="py-12 px-4 md:px-10 lg:px-20 bg-white">
                <div className="flex gap-5 items-center">
                    {/* Left Image Grid */}
                    <div className="">
                        <img src={img1} alt="scuba" className="rounded-2xl w-[80%] h-auto object-cover" />
                    </div>

                    {/* Right Content */}
                    <div className="w-[100%]">
                        <img src={waves} alt="icon" className="mb-2 w-12" />
                        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">About Us</h2>
                        <p className="text-gray-700 mb-4">
                            Just Dive Murdeshwar is a premier PADI-certified scuba diving center offering world-class diving experiences and professional PADI courses at Netrani Island, Karnataka. Established in 2023, the company quickly gained recognition for its commitment to safety, quality, and excellence in diving education.
                        </p>
                        <p className="text-gray-700">
                            The dive center offers a range of programs catering to both beginners and experienced divers. From fun diving experiences for first-timers to advanced PADI certification courses, Just Dive provides a structured and enjoyable approach to learning scuba diving. The clear waters of Netrani Island, known for their rich marine biodiversity, make it an ideal location to explore coral reefs, schools of vibrant fish, and occasional sightings of reef sharks and turtles.
                        </p>
                    </div>
                </div>

                {/* Bottom Banner Image */}
                <div className="mt-12">
                    <img src={about} alt="diving banner" className="w-full h-[70vh] rounded-xl object-cover" />
                </div>
            </section>
        </>
    );
}

export default AboutUs;
