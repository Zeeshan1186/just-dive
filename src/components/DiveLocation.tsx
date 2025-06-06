import dive1 from "../assets/images/Location/dive1.png";
import dive2 from "../assets/images/Location/dive2.png";
import cta from "../assets/images/Location/cta.png";
import { Button } from "@/components/ui/button";

const DiveLocation = () => {
    return (
        <>
            <div
                className="relative w-full h-[60vh] md:h-[65vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${dive1})` }} // adjust path as needed
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Text and buttons */}
                <div className="relative z-10 text-center px-4">
                    <h2 className="Trirong text-white text-2xl md:text-4xl font-normal mb-4 leading-tight">
                        Just Dive<br />Murdeshwar
                    </h2>

                    <div className="flex Poppins justify-center gap-3 flex-wrap">
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Know More
                        </Button>
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
            <div
                className="relative w-full h-[60vh] md:h-[65vh] bg-cover bg-center my-4 flex items-center justify-center"
                style={{ backgroundImage: `url(${dive2})` }} // adjust path as needed
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Text and buttons */}
                <div className="relative z-10 text-center px-4">
                    <h2 className="Trirong text-white text-2xl md:text-4xl font-normal mb-4 leading-tight">
                        Scuba Diving In <br /> Netrani Island
                    </h2>

                    <div className="flex Poppins justify-center gap-3 flex-wrap">
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Know More
                        </Button>
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
            <div
                className="relative w-full h-[60vh] md:h-[65vh] bg-cover bg-center my-4 flex items-center justify-center"
                style={{ backgroundImage: `url(${cta})` }} // adjust path as needed
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Text and buttons */}
                <div className="relative z-10 text-center px-4">
                    <h2 className="Trirong text-white text-2xl md:text-4xl font-normal mb-4 leading-tight">
                        We also offer a range of additional services <br />
                        to enhance your holiday experience
                    </h2>

                    <div className="flex Poppins justify-center gap-3 flex-wrap">
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Know More
                        </Button>
                        <Button className="text-white font-normal bg-[#b89d53] hover:text-white hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DiveLocation;
