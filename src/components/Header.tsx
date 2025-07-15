import { useEffect, useState } from "react";
import { Menu, ChevronDown, Phone } from "lucide-react";
import logo from "../assets/images/JustDiveLogo.jpeg";
import { NavLink } from 'react-router-dom';
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { getactivePackages } from "../services/apiService";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [packages, setPackages] = useState<any[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await getactivePackages();
                setPackages(res?.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch packages", err);
            }
        };

        fetchPackages();
    }, []);

    return (
        <header className="w-full shadow-sm bg-white sticky top-0 z-50 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 flex items-center justify-between">
                <div>
                    <Link to="/">
                        <div className="flex items-center">
                            <img src={logo} alt="Logo" className="w-50" />
                            {/* <div className="leading-tight">
                                <h1 className="text-2xl font-bold Trirong textgolden">JUST DIVE</h1>
                                <p className="text-sm font-normal Poppins text-[#072F49]">By Eesha Adventure</p>
                            </div> */}
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 Poppins text-md font-400 text-[#303030] items-center">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium' : 'text-[#303030] hover:font-medium hover:text-[#0191e9]'}>Home</NavLink>

                    <NavLink to="/aboutus" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium' : 'text-[#303030] hover:font-medium hover:text-[#0191e9]'}>About Us</NavLink>

                    <div className="relative group" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                        <NavLink to="/scubapackages" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium flex items-center' : 'text-[#303030] hover:font-medium hover:text-[#0191e9] flex items-center'}>
                            Scuba Packages <ChevronDown size={16} className="ml-1" />
                        </NavLink>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 w-60 z-50">
                                {packages.length > 0 ? (
                                    packages.map((pkg: any) => (
                                        <NavLink
                                            key={pkg.id}
                                            to={`/itinerary/${pkg.id}`}
                                            className={({ isActive }) => isActive ? 'block px-4 py-2 text-[#0191e9] font-medium' : 'block px-4 py-2 text-[#303030] hover:font-medium hover:text-[#0191e9]'}
                                        >
                                            {pkg.name}
                                        </NavLink>
                                    ))
                                ) : (
                                    <p className="px-4 py-2 text-sm text-gray-500">No packages available</p>
                                )}
                            </div>
                        )}
                    </div>

                    <NavLink to="/media" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium' : 'text-[#303030] hover:font-medium hover:text-[#0191e9]'}>Media</NavLink>

                    <NavLink to="/faq" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium' : 'text-[#303030] hover:font-medium hover:text-[#0191e9]'}>FAQ</NavLink>

                    <NavLink to="/contactus" className={({ isActive }) => isActive ? 'text-[#0191e9] font-medium' : 'text-[#303030] hover:font-medium hover:text-[#0191e9]'}>Contact Us</NavLink>
                </nav>

                {/* Right side icons */}
                <div className="hidden md:flex items-center space-x-4">
                    <a href="tel:8482911183" aria-label="Call us">
                        <Phone className="textgolden cursor-pointer" size={20} />
                    </a>
                    <Link to="/booking">
                        <Button className="text-white font-normal bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border-1 border-[#0191e9] rounded-full text-sm px-4 py-2">
                            Book Now
                        </Button>
                    </Link>
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
                        <a href="tel:8482911183" aria-label="Call us">
                            <Phone className="textgolden" size={20} />
                        </a>

                        <Link to="/booking">
                            <Button
                                className="bggolden text-white Poppins font-normal px-4 py-2 rounded-full text-sm hover:bg-yellow-500"
                                aria-label="Book your scuba diving adventure"
                            >
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            )} {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <a href="#" className="block px-4 py-2 text-sm border-b">Home</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">About US</a>
                    <details className="px-4 py-2 border-b">
                        <summary className="text-sm cursor-pointer">Scuba Dive Packages</summary>
                        <div className="pl-4 pt-2">
                            {packages.length > 0 ? (
                                packages.map((pkg: any) => (
                                    <Link key={pkg.id} to={`/itinerary/${pkg.id}`} className="block py-1 text-sm">
                                        {pkg.name}
                                    </Link>
                                ))
                            ) : (
                                <p className="py-1 text-sm text-gray-500">No packages</p>
                            )}
                        </div>
                    </details>
                    <a href="#" className="block px-4 py-2 text-sm border-b">Media</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">FAQ</a>
                    <a href="#" className="block px-4 py-2 text-sm border-b">Contact Us</a>
                    <div className="flex items-center justify-between px-4 py-4">
                        <a href="tel:8482911183" aria-label="Call us">
                            <Phone className="textgolden" size={20} />
                        </a>

                        <Link to="/booking">
                            <Button className="bg-[#0191e9] text-white Poppins font-normal px-4 py-2 rounded-full text-sm hover:bg-yellow-500" aria-label="Book your scuba diving adventure">
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
