import waves from "../assets/images/Bluewave.png";
import whyus from "../assets/images/whyus.png";
import AJAY from "../assets/images/team/decosta.png";
import SUSHIl from "../assets/images/team/managing-partner.png";
import ARVIND from "../assets/images/team/ARVIND-BHADRAN.png";
import SAINATH from "../assets/images/team/SAINATH.png";
import HARIKRISHNAN from "../assets/images/team/HARIKRISHNAN.png";
import VINOD from "../assets/images/team/VINOD-KUMAR.png";
import BIMAL from "../assets/images/team/BIMAL-BIJU.png";
import DHANUSH from "../assets/images/team/DHANUSH--B.png";
import MUHAMMAD from "../assets/images/team/MUHAMMAD-FIROZ-KHAN.png";
import ABHISHEK from "../assets/images/team/ABHISHEK-JAYAMON.png";
import Lottie from 'react-lottie-player';
import experience from '../assets/Animation - 1750410355214.json';
import result from '../assets/Animation - 1750410365589.json';
import individual from '../assets/Animation - 1750410361026.json';

export default function WhyUs() {
    return (
        <>
            <section className="-mt-15">
                <div className="text-center Poppins">
                    {/* Header */}
                    <div className="bg-[#ebfbff] pt-12 pb-2 px-4">
                        <img src={waves} alt="waves" className="mx-auto w-8" />
                        <h2 className="text-3xl sm:text-4xl Trirong font-normal text-gray-800 mb-4">
                            Why Us?
                        </h2>
                        <p className="text-gray-600 mb-10 text-sm sm:text-base">
                            Our company was founded in 2004. We work daily to become better and <br className="hidden sm:block" />
                            we are ready to share best practices.
                        </p>
                    </div>

                    {/* Feature Boxes */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 pb-20 gap-8 text-center bg-cover bg-no-repeat px-4 sm:px-6 md:px-10"
                        style={{ backgroundImage: `url(${whyus})` }}
                    >
                        {/* Box 1 */}
                        <div className="flex flex-col items-center space-y-4">
                            <Lottie
                                loop
                                play
                                animationData={experience}
                                style={{ width: '80px', height: '80px' }}
                            />
                            <h3 className="text-lg font-semibold">Experienced team</h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Our company was founded in 2004. <br />
                                We work daily to become better and <br />
                                we are ready to share best practices.
                            </p>
                        </div>

                        {/* Box 2 */}
                        <div className="flex flex-col items-center space-y-4">
                            <Lottie
                                loop
                                play
                                animationData={individual}
                                style={{ width: '80px', height: '80px' }}
                            />
                            <h3 className="text-lg font-semibold">Individual approach</h3>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Our company was founded in 2004. <br />
                                We work daily to become better and <br />
                                we are ready to share best practices.
                            </p>
                        </div>

                        {/* Box 3 */}
                        <div className="flex flex-col items-center space-y-4">
                            <Lottie
                                loop
                                play
                                animationData={result}
                                style={{ width: '60px', height: '60px' }}
                            />
                            <h3 className="text-lg font-semibold">Result guarantee</h3>
                            <p className="text-gray-600 text-sm sm:text-base">
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

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 pb-10 px-4 sm:px-8">

                    {/* Team Member 0 */}
                    <div
                        className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl"
                        style={{ backgroundImage: `url(${AJAY})` }}
                    >
                        <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors duration-500"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Ajay Dcosta</h3>
                            <p className="text-sm">Manager</p>
                        </div>
                    </div>

                    {/* Team Member 1 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${SUSHIl})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Sushil Kumar Pillai</h3>
                            <p className="text-sm">Managing partner</p>
                        </div>
                    </div>

                    {/* Team Member 2 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${ARVIND})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Arvind Bhadran</h3>
                            <p className="text-sm">Finance manager</p>
                        </div>
                    </div>

                    {/* Team Member 3 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${SAINATH})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Sainath S</h3>
                            <p className="text-sm">Dive operation manager</p>
                        </div>
                    </div>

                    {/* Team Member 4 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${HARIKRISHNAN})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Harikrishnan</h3>
                            <p className="text-sm">PADI dive instructor</p>
                        </div>
                    </div>

                    {/* Team Member 5 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${VINOD})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Vinod Kumar D</h3>
                            <p className="text-sm">PADI dive instructor</p>
                        </div>
                    </div>

                    {/* Team Member 6 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${BIMAL})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Bimal Biju</h3>
                            <p className="text-sm">PADI dive master</p>
                        </div>
                    </div>

                    {/* Team Member 7 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${DHANUSH})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Dhanush B</h3>
                            <p className="text-sm">PADI dive master</p>
                        </div>
                    </div>

                    {/* Team Member 8 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${MUHAMMAD})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Muhammad Firoz Khan</h3>
                            <p className="text-sm">PADI dive master</p>
                        </div>
                    </div>

                    {/* Team Member 9 */}
                    <div className="relative flex flex-col justify-end items-start text-white p-4 
               bg-cover bg-center w-full h-[50vh] rounded-lg overflow-hidden
               transform transition-all duration-500 ease-in-out
               hover:scale-105 hover:shadow-2xl" style={{ backgroundImage: `url(${ABHISHEK})` }}>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold">Abhishek Jayamon</h3>
                            <p className="text-sm">PADI dive master</p>
                        </div>
                    </div>

                </div>

            </section>
        </>
    );
}
