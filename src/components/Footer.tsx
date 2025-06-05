
import { Facebook, Instagram } from "lucide-react";
import logo from "../assets/images/Justdive.png";

export default function Footer() {
    return (
        <footer className="bg-[#1B1B19] text-white px-36  py-10 md:pt-26">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Column 1 - Menu 1 */}
                <div className="Poppins">
                    <h4 className="font-semibold mb-3 text-lg">Home</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Dive</a></li>
                        <li><a href="#">Packages</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Media</a></li>
                    </ul>
                </div>

                {/* Column 2 - Menu 2 */}
                <div className="mt-2 Poppins">
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Testimony</a></li>
                        <li><a href="#">Contact</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">FAQ</a></li>
                    </ul>
                </div>

                {/* Column 3 - Logo & Description */}
                <div className="md:col-span-2 flex flex-col pl-10 items-start md:items-start">
                    <div className="flex items-center mb-4">
                        <img src={logo} alt="JUST DIVE" className="w-12 h-12 mr-2" />
                        <span className="text-xl font-semibold">JUST DIVE</span>
                    </div>
                    <p className="text-sm text-gray-300 Poopins mb-4 max-w-md">
                        Experience incredible emotions discovering new amazing underwater worlds with our diving.
                    </p>
                    <div>
                        <p className="font-medium mb-2">Follow Us</p>
                        <div className="flex space-x-3">
                            <a href="#" className="p-1 bg-white text-[#C3A357] rounded-md">
                                <Instagram />
                            </a>
                            <a href="#" className="p-1 bg-white text-[#C3A357] rounded-md">
                                <Facebook />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="Poppins border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                <p>Copyright ©2025 JUST DIVE. All rights reserved.</p>
                <p>Design by Excit Systems</p>
            </div>
        </footer>
    );
}
