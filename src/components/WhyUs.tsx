import { Users, UserCheck, Award } from "lucide-react"; // icons

import waves from "../assets/images/Bluewave.png";
import whyus from "../assets/images/whyus.png";
import team from "../assets/images/Team.png";

export default function WhyUs() {
    return (
        <>
            <section className="-mt-15">
                <div className="text-center Poppins">
                    <div className="bg-[#EBFBFF] pt-12 pb-6 px-4">
                        {/* Top Heading */}
                        <img src={waves} alt="waves" className="mx-auto mb-2 w-8" />
                        <h2 className="text-3xl sm:text-4xl Trirong font-normal text-gray-800 mb-4">
                            Why Us?
                        </h2>
                        <p className="text-gray-600 mb-10">
                            Our company was founded in 2004. We work daily to become better and <br />
                            we are ready to share best practices.
                        </p>
                    </div>
                    {/* Feature Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 pb-20 gap-8 text-center  bg-cover bg-no-repeat" style={{ backgroundImage: `url(${whyus})` }}>
                        {/* Box 1 */}
                        <div className="flex flex-col items-center space-y-4">
                            <Users size={40} className="text-gray-700" />
                            <h3 className="text-lg font-semibold">Experienced team</h3>
                            <p className="text-gray-600 text-sm">
                                Our company was founded in 2004. <br />
                                We work daily to become better and <br />
                                we are ready to share best practices.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="flex flex-col items-center space-y-4">
                            <UserCheck size={40} className="text-gray-700" />
                            <h3 className="text-lg font-semibold">Individual approach</h3>
                            <p className="text-gray-600 text-sm">
                                Our company was founded in 2004. <br />
                                We work daily to become better and <br />
                                we are ready to share best practices.
                            </p>
                        </div>

                        {/* Box 3 */}
                        <div className="flex flex-col items-center space-y-4">
                            <Award size={40} className="text-gray-700" />
                            <h3 className="text-lg font-semibold">Result guarantee</h3>
                            <p className="text-gray-600 text-sm">
                                Our company was founded in 2004. <br />
                                We work daily to become better and <br />
                                we are ready to share best practices.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mt-6">
                <div className="flex flex-col justify-center items-center pb-6 px-4">
                    <img src={waves} alt="waves" className="mx-auto mb-2 w-8" />
                    <h2 className="text-3xl sm:text-4xl Trirong font-normal text-gray-800 mb-4">
                        Meet Our Team
                    </h2>
                </div>
                {/* Feature Boxes */}
                <div className="grid grid-cols-1 md:grid-cols-4 pb-10 px-12 gap-5 text-center ">
                    {/* Box 1 */}
                    <div className="flex flex-col justify-end items-start text-white p-4 bg-cover bg-no-repeat w-auto h-[50vh]" style={{ backgroundImage: `url(${team})` }}>
                        <h3 className="text-lg font-semibold">Sunil</h3>
                        <p className="text-sm">
                            Managing Partner
                        </p>
                    </div>

                    {/* Box 2 */}
                    <div className="flex flex-col justify-end items-start text-white p-4 bg-cover bg-no-repeat w-auto h-[50vh]" style={{ backgroundImage: `url(${team})` }}>
                        <h3 className="text-lg font-semibold">Sunil</h3>
                        <p className="text-sm">
                            Managing Partner
                        </p>
                    </div>

                    {/* Box 3 */}
                    <div className="flex flex-col justify-end items-start text-white p-4 bg-cover bg-no-repeat w-auto h-[50vh]" style={{ backgroundImage: `url(${team})` }}>
                        <h3 className="text-lg font-semibold">Sunil</h3>
                        <p className="text-sm">
                            Managing Partner
                        </p>
                    </div>

                    {/* Box 4 */}
                    <div className="flex flex-col justify-end items-start text-white p-4 bg-cover bg-no-repeat w-auto h-[50vh]" style={{ backgroundImage: `url(${team})` }}>
                        <h3 className="text-lg font-semibold">Sunil</h3>
                        <p className="text-sm">
                            Managing Partner
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
