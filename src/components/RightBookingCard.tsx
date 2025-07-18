import { Link } from "react-router-dom";
import padi from "../assets/images/padi.png";
import { Button } from "./ui/button";

function RightBookingCard() {
    return (
        <div>
            {/* Right Section */}
            <div className="w-full flex flex-col py-30 Trirong font-normal items-center justify-center gap-6">
                <div className="flex justify-center ">
                    <Button className="animate-pulse text-white font-normal Poppins bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-6 py-2">
                        Check Availability
                    </Button>
                </div>
                <div className="bg-gray-100 rounded-xl shadow-md py-6 px-8 text-center w-full">
                    <p className="text-xl font-[600] mb-4">So, what are you waiting for? Book your package now!</p>
                    <Link to={`/booking`}>
                        <Button className="animate-pulse text-white Poppins font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2">
                            Book Now
                        </Button>
                    </Link>
                </div>
                <img src={padi} alt="PADI Certified" className="h-15" />
            </div>
        </div>
    );
}

export default RightBookingCard;
