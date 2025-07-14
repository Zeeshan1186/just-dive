import { Button } from "./ui/button";

const ThankYouMessage = () => {
    return (
        <div className="max-w-lg mx-auto bg-gray-100 rounded-xl shadow-md overflow-hidden my-10">
            <div className="p-6 text-center">
                <h2 className="text-xl sm:text-2xl Trirong font-semibold text-gray-800 mb-4">
                    Thank you for Booking With Just Dive
                </h2>
                <p className="text-[#3578EA] text-sm sm:text-base font-medium mb-2">
                    Order ID – <span className="underline">RBD1567890123</span>
                </p>
                <p className="text-gray-600 mb-6 Poppins text-sm sm:text-base">
                    We will send you a notification on your whatsapp number
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] transition hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-10 py-2"
                        onClick={() => window.location.reload()}
                    >
                        Close
                    </Button>
                    <Button
                        className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] transition hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2"
                        onClick={() => (window.location.href = "/")}
                    >
                        Back To Website
                    </Button>
                </div>
            </div>
            <div className="bg-white px-4 py-3 text-center text-xs sm:text-sm text-gray-600 rounded-b-xl">
                *If you have any questions or queries then feel free to <br /> Whatsapp on
                <a href="https://wa.me/8482944483" className="text-blue-600 text-[#3578EA] pl-1 font-medium">
                    +91 8482944483
                </a>
            </div>
        </div >
    );
};

export default ThankYouMessage;
