import { useEffect, useState } from "react";
import { Menu, ChevronDown, Phone } from "lucide-react";
import logo from "../assets/images/JustDiveLogo.jpeg";
import whatsappicon from "../assets/images/WhatsApp_icon.png";
import { NavLink, Link } from "react-router-dom";
import { Button } from "./ui/button";
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
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img
                        src={logo}
                        alt="Logo"
                        className="w-32 sm:w-50 md:w-48 lg:w-52 object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6 text-md font-400 text-[#303030] items-center">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#0191e9] font-medium"
                                : "text-[#303030] hover:font-medium hover:text-[#0191e9]"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/aboutus"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#0191e9] font-medium"
                                : "text-[#303030] hover:font-medium hover:text-[#0191e9]"
                        }
                    >
                        About Us
                    </NavLink>

                    {/* Dropdown */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <NavLink
                            to="/murdeshwarpackages"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-[#0191e9] font-medium flex items-center"
                                    : "text-[#303030] hover:font-medium hover:text-[#0191e9] flex items-center"
                            }
                        >
                            Scuba Packages <ChevronDown size={16} className="ml-1" />
                        </NavLink>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 bg-white shadow-md rounded-md py-2 w-60 z-50">
                                {packages.length > 0 ? (
                                    packages.map((pkg: any) => (
                                        <NavLink
                                            key={pkg.id}
                                            to={`/itinerary/${pkg.id}`}
                                            className={({ isActive }) =>
                                                isActive
                                                    ? "block px-4 py-2 text-[#0191e9] font-medium"
                                                    : "block px-4 py-2 text-[#303030] hover:font-medium hover:text-[#0191e9]"
                                            }
                                        >
                                            {pkg.name}
                                        </NavLink>
                                    ))
                                ) : (
                                    <p className="px-4 py-2 text-sm text-gray-500">
                                        No packages available
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <NavLink
                        to="/media"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#0191e9] font-medium"
                                : "text-[#303030] hover:font-medium hover:text-[#0191e9]"
                        }
                    >
                        Media
                    </NavLink>

                    <NavLink
                        to="/faq"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#0191e9] font-medium"
                                : "text-[#303030] hover:font-medium hover:text-[#0191e9]"
                        }
                    >
                        FAQ
                    </NavLink>

                    <NavLink
                        to="/contactus"
                        className={({ isActive }) =>
                            isActive
                                ? "text-[#0191e9] font-medium"
                                : "text-[#303030] hover:font-medium hover:text-[#0191e9]"
                        }
                    >
                        Contact Us
                    </NavLink>
                </nav>

                {/* Right side icons */}
                <div className="hidden md:flex items-center space-x-4">
                    <a href="tel:87624 12121" aria-label="Call us">
                        <Phone className="textgolden cursor-pointer" size={20} />
                    </a>
                    <Link to="/booking">
                        <Button className="text-white font-normal cursor-pointer bg-[#0191e9] hover:text-[#0191e9] hover:bg-transparent hover:border border-[#0191e9] rounded-full text-sm px-4 py-2">
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
                <div className="md:hidden bg-white mt-5 ml-3">
                    <NavLink to="/" className="block px-4 py-2 text-sm border-b-[1px] border-[#d2d2d2]">
                        Home
                    </NavLink>
                    <NavLink to="/aboutus" className="block px-4 py-2 text-sm border-b-[1px] border-[#d2d2d2]">
                        About Us
                    </NavLink>
                    <details className="px-4 py-2 border-b-[1px] border-[#d2d2d2]">
                        <summary className="text-sm cursor-pointer">Scuba Dive Packages</summary>
                        <div className="pl-4 pt-2">
                            {packages.length > 0 ? (
                                packages.map((pkg: any) => (
                                    <Link
                                        key={pkg.id}
                                        to={`/itinerary/${pkg.id}`}
                                        className="block py-1 text-sm"
                                    >
                                        {pkg.name}
                                    </Link>
                                ))
                            ) : (
                                <p className="py-1 text-sm text-gray-500">
                                    No packages available
                                </p>
                            )}
                        </div>
                    </details>
                    <NavLink to="/media" className="block px-4 py-2 text-sm border-b-[1px] border-[#d2d2d2]">
                        Media
                    </NavLink>
                    <NavLink to="/faq" className="block px-4 py-2 text-sm border-b-[1px] border-[#d2d2d2]">
                        FAQ
                    </NavLink>
                    <NavLink to="/contactus" className="block px-4 py-2 text-sm border-b-[1px] border-[#d2d2d2]">
                        Contact Us
                    </NavLink>
                    <div className="flex items-center justify-between px-4 py-4">
                        <a href="tel:087624 12121" aria-label="Call us">
                            <Phone className="textgolden" size={20} />
                        </a>
                        <Link to="/booking">
                            <Button className="bg-[#0191e9] cursor-pointer text-white px-4 py-2 rounded-full text-sm">
                                Book Now
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
            <a
                href="https://wa.me/87624 12121"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed z-50 bottom-6 right-4 md:bottom-4 md:right-4"
            >
                <img
                    src={whatsappicon}
                    alt="WhatsApp"
                    className="w-12 md:w-5 lg:w-16"
                />
            </a>
        </header>
    );
}
