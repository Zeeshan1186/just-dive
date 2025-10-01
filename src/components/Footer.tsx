import { Facebook, Instagram } from "lucide-react";
import logo from "../assets/images/JustDiveBlack.png";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-[#1B1B19] text-white px-6 sm:px-10 lg:px-20 xl:px-36 py-10 md:pt-26">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-[35%_1fr_1fr_1fr] gap-8 text-left">
                {/* Column 1 - Logo & Description (full width on small, first column on md+) */}
                <div className="col-span-2 md:col-span-1 flex flex-col items-start">
                    <div className="flex justify-start mb-4">
                        <Link to="/">
                            <img src={logo} alt="JUST DIVE" className="w-40 sm:w-32 md:w-36" />
                        </Link>
                    </div>
                    <p className="text-sm text-gray-300 Poppins mb-4 max-w-md">
                        Experience incredible emotions discovering new amazing underwater worlds with our diving.
                    </p>
                </div>

                {/* Column 2 - Menu 1 (left column when side-by-side) */}
                <div className="Poppins flex flex-col items-start">
                    <h4 className="font-semibold mb-3 text-lg">Home</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><Link to="/aboutus">About Us</Link></li>
                        <li><Link to="/murdeshwarpackages">Packages</Link></li>
                        <li><Link to="/blogs">Blog</Link></li>
                        <li><Link to="/media">Media</Link></li>
                    </ul>
                </div>

                {/* Column 3 - Menu 2 (right column when side-by-side) */}
                <div className="Poppins flex flex-col items-start">
                    <h4 className="font-semibold mb-3 text-lg">Support</h4>
                    <ul className="space-y-3 text-sm text-gray-300">
                        <li><Link to="/contactus">Contact Us</Link></li>
                        <li><Link to="/termsandcondition">Terms & Condition</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                    </ul>
                </div>

                {/* Column 4 - Social Links (full width on small, last column on md+) */}
                <div className="col-span-2 md:col-span-1 flex flex-col items-start">
                    <p className="font-medium mb-2">Follow Us</p>
                    <div className="flex space-x-3">
                        <Link to="https://www.instagram.com/justdive_murdeshwar" target="_blank" className="p-1 bg-white text-[#0191e9] hover:bg-[#0191e9] hover:text-white rounded-md">
                            <Instagram size={20} />
                        </Link>
                        <Link to="https://www.facebook.com/JustDiveScubaMurdeshwar/" target="_blank" className="p-1 bg-white text-[#0191e9] hover:bg-[#0191e9] hover:text-white rounded-md">
                            <Facebook size={20} />
                        </Link>
                    </div>
                </div>
            </div>


            {/* Bottom Bar */}
            <div className="Poppins border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 text-center sm:text-left">
                <p className="mb-2 sm:mb-0">Copyright ©2025 JUST DIVE. All rights reserved.</p>
                <p>Design by Excite Systems</p>
            </div>
        </footer>
    );
}
