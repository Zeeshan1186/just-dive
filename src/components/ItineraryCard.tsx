import packageimg from "../assets/images/Banner.png";

const ItineraryCard = () => {
    const itineraryData = {
        title: "Scuba Diving At Grand Island",
        subtitle: "Non Swimmers can also enjoy these activities.",
        duration: "2 Hours",
        image: packageimg, // replace with actual path
        table: [
            {
                service: "Scuba Diving At Grand Island",
                duration: "2 Hours",
                price: "₹ 1500",
            },
        ],
        vehicle: "The passengers (Group of 10 People) will be transported by boat to the designated scuba diving location.",
    };
    const data = itineraryData; // simulate fetch here later


    return (
        <>
         
            <div className="flex flex-col Poppins gap-6 py-8 max-w-7xl">
                {/* Left Section */}
                <div className="w-full space-y-6">
                    {/* Heading */}
                    <div>
                        <h2 className="text-4xl font-semibold mb-3">Itinerary</h2>
                        <h2 className="text-2xl Trirong font-normal mb-1">{data.title}</h2>
                        <p className="text-gray-600 Trirong">{data.subtitle}</p>
                        <div className="flex items-center gap-2 text-sm mt-2">
                            <span>🕒</span>
                            <span>{data.duration}</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse rounded-md overflow-hidden">
                            <thead className="bg-[#b89d53] text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left font-normal">Services</th>
                                    <th className="px-4 py-2 text-left font-normal">Duration</th>
                                    <th className="px-4 py-2 text-left font-normal">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.table.map((item, index) => (
                                    <tr key={index} className="bg-white text-lg text-[#3D3D3D] font-normal border-t">
                                        <td className="px-4 py-2">{item.service}</td>
                                        <td className="px-4 py-2">{item.duration}</td>
                                        <td className="px-4 py-2">{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Vehicle Info */}
                    <div>
                        <div className="bg-[#b89d53] flex justify-center text-white px-4 py-2 font-medium">Vehicle</div>
                        <p className="py-4 px-4 pb-0 bg-white text-lg text-gray-800">{data.vehicle}</p>
                    </div>

                    {/* Image */}
                    <div>
                        <img src={data.image} alt="Scuba Dive" className="w-full h-100 rounded-lg object-cover" />
                    </div>
                </div>

              
            </div>
        </>
    );
};

export default ItineraryCard;
