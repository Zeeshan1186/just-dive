import { Link } from "react-router-dom";
import cta from "../assets/images/cta.png";
import { Button } from "@/components/ui/button";

function CTA() {
    return (
        <>
            <div
                className="relative w-full h-[60vh] md:h-[65vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${cta})` }} // adjust path as needed
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Text and buttons */}
                <div className="relative z-10 text-center px-4">
                    <h2 className="Trirong text-white text-3xl md:text-3xl font-normal mb-4 leading-tight">
                        We also offer a range of additional services <br />
                        to enhance your holiday experience
                    </h2>

                    <div className="flex Poppins justify-center gap-3 flex-wrap">
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

export default CTA;
