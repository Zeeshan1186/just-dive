import padi from "../assets/images/padi.png";

function RightBookingCard() {
    return (
        <div>
            {/* Right Section */}
            <div className="w-full flex flex-col py-38 Trirong font-normal items-center justify-center gap-6">
                <div className="bg-gray-100 rounded-xl shadow-md py-6 px-8 text-center w-full">
                    <p className="text-xl font-[600] mb-4">So, what are you waiting for? Book your package now!</p>
                    <button className="text-white font-normal bg-[#b89d53] hover:text-[#b89d53] hover:bg-transparent hover:border-1 border-[#b89d53] rounded-full text-sm px-4 py-2">
                        Book Now
                    </button>
                </div>
                <img src={padi} alt="PADI Certified" className="h-15" />
            </div>
        </div>
    );
}

export default RightBookingCard;
