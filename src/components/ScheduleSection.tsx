import mustread from "../assets/images/boat.png";


const ScheduleSection = () => {
    const scheduleData = {
        schedule: [
            "Report at 10 am to 12 pm for the activities.",
            "Enjoy Boat travel towards Grande Island water bodies for scuba diving.",
            "Listen to the instructions provided by our Instructors about your Scuba diving experience.",
            "Enjoy the experience with our divers and follow the instruction as shared and let the other trainer capture your experience of enjoyment in the camera for your memories forever.",
            "Before leaving the venue please confirm with the diving team for your complimentary video for scuba.",
        ],
        mustRead: [
            "Carry Glares, Hat, swim suit if available with you and body lotions and also some basic eatables as per your need.",
            "Carry a pair of clothes.",
            "Do not litter the surrounding while on this trip and also the places which are used by other customers.",
            "Take care of your belongings.",
            "Do not forget to capture your memories in your gadgets.",
            "Once entered the sea for scuba no refunds can be done even if the event is not done by any reasons.",
        ],
        mustReadImage: mustread, // Replace with actual image path
    };

    const data = scheduleData; // simulate API response

    return (
        <div className="max-w-7xl mx-auto py-5 Poppins space-y-10">
            <div className="">
                {/* Schedule Section */}
                <div>
                    <h2 className="bg-gray-200 px-4 py-2 text-xl font-semibold mb-4">Schedule</h2>
                    <div className="space-y-6 pl-4 relative border-l-2 border-[#B9B9B9]">
                        {data.schedule.map((item, idx) => (
                            <div key={idx} className="relative pl-2 text-gray-800">
                                <span className="absolute -left-6 top-1 w-3 h-3 bg-gray-400 rounded-full" />
                                <p>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Must Read Section */}
                <div className="flex flex-col mt-10 md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full  md:w-1/2">
                        <img
                            src={data.mustReadImage}
                            alt="Boat"
                            className="rounded-md w-full object-cover max-h-[65vh] h-[70vh]"
                        />
                    </div>

                    {/* Text */}
                    <div className="w-full md:w-100">
                        <h3 className="bg-gray-200 px-4 py-2 text-lg font-bold mb-4">Must Read</h3>
                        <ul className="list-none space-y-2 text-gray-800">
                            {data.mustRead.map((point, idx) => (
                                <li key={idx}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div></div>
        </div >
    );
};

export default ScheduleSection;
