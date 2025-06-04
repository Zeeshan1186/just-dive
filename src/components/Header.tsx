import { useState } from "react";
import { Menu, ChevronDown, Phone } from "lucide-react";
import logo from "../assets/images/Justdive.png";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="w-full shadow-sm bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between py-4">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                    <div className="leading-tight">
                        <h1 className="text-2xl font-bold textgolden">JUST DIVE</h1>
                        <p className="text-sm font-semibold text-[#072F49]">By Eesha Adventure</p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 Poppins text-md font-400 text-[#303030] items-center">
                    <a href="#" className="hover:font-medium hover:text-[#C3A357]">Home</a>
                    <a href="#" className="hover:font-medium hover:text-[#C3A357]">About US</a>
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center hover:text-yellow-800">
                            Scuba Packages <ChevronDown size={16} className="ml-1" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0  bg-white shadow-md rounded-md py-2 w-48">
                                <a href="#" className="block px-4 py-2 hover:font-medium hover:text-[#C3A357]">Scuba Event 1</a>
                                <a href="#" className="block px-4 py-2 hover:font-medium hover:text-[#C3A357]">Scuba Event 2</a>
                                <a href="#" className="block px-4 py-2 hover:font-medium hover:text-[#C3A357]">Scuba Event 3</a>
                            </div>
                        )}
                    </div>
                    <a href="#" className="hover:font-medium hover:text-[#C3A357]">Media</a>
                    <a href="#" className="hover:font-medium hover:text-[#C3A357]">FAQ</a>
                    <a href="#" className="hover:font-medium hover:text-[#C3A357]">Contact Us</a>
                </nav>

                {/* Right side icons */}
                <div className="hidden md:flex items-center space-x-4">
                    <Phone className="textgolden" size={20} />
                    <button className="bggolden text-white font-medium px-4 py-2 rounded-full text-sm hover:bg-yellow-500">
                        Book Now
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <a href="#" className="block px-4 py-2 text-sm border-b">Home</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">About US</a>
                    <details className="px-4 py-2 border-b">
                        <summary className="text-sm cursor-pointer">Scuba Dive Packages</summary>
                        <div className="pl-4 pt-2">
                            <a href="#" className="block py-1 text-sm">Scuba Event 1</a>
                            <a href="#" className="block py-1 text-sm">Scuba Event 2</a>
                            <a href="#" className="block py-1 text-sm">Scuba Event 3</a>
                        </div>
                    </details>
                    <a href="#" className="block px-4 py-2 text-sm border-b">Media</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">FAQ</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">Contact Us</a>
                    <div className="flex items-center justify-between px-4 py-4">
                        <Phone className="textgolden" size={20} />
                        <button className="bggolden text-white font-medium px-4 py-2 rounded-full text-sm hover:bg-yellow-500">
                            Book Now
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
