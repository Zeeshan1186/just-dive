"use client";

import {
    BetweenVerticalEnd,
    // Calendar,
    Check,
    ChevronDown,
    ChevronRight,
    File,
    Loader2,
    Mail,
    Phone,
    User,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { format, parseISO } from 'date-fns';
import { getPackageById } from "../services/apiService";
import { applyCoupon } from "../services/apiService";
import { postBooking } from "../services/apiService";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
    const [selectedDate, setSelectedDate] = useState("");
    const [storedParticipants, setStoredParticipants] = useState("");
    const [selectedSlot, setSelectedSlot] = useState("");
    const [selectedPackageName, setSelectedPackageName] = useState<string>("");
    const [subtotal, setSubtotal] = useState("0.00");
    const [discount, setDiscount] = useState("0.00");
    const [grandTotal, setGrandTotal] = useState("0.00");
    const [couponCode, setCouponCode] = useState("");
    const [couponError, setCouponError] = useState("");
    const [fullName, setFullName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [nationality, setNationality] = useState("");
    const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [errors, setErrors] = useState<{ whatsapp?: string; email?: string }>({});
    const [isValid, setIsValid] = useState(false);
    const [touched, setTouched] = useState<{ whatsapp?: boolean; email?: boolean }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [gst, setGst] = useState("0.00");
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const navigate = useNavigate();

    // ✅ Move summaryData here so it's available in JSX
    const summaryData = [
        { label: "Subtotal", value: subtotal },
        { label: "GST (18%)", value: gst },
        { label: "Discount", value: discount },
        { label: "Grand Total", value: grandTotal },
    ];

    const validateField = (field: string, value: string) => {
        switch (field) {
            case "whatsapp":
                if (!value) return "WhatsApp number is required";
                if (!/^\d{10}$/.test(value)) return "WhatsApp number must be exactly 10 digits and only numbers";
                return "";
            case "email":
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
                return "";
            default:
                return "";
        }
    };

    // Validate on every change
    useEffect(() => {
        const whatsappError = validateField("whatsapp", whatsapp);
        const emailError = validateField("email", email);

        setErrors({
            whatsapp: whatsappError,
            email: emailError,
        });

        // Form is valid if no errors
        setIsValid(!whatsappError && !emailError);
    }, [whatsapp, email]);

    useEffect(() => {
        const storedPackageId = localStorage.getItem("selectedPackageId");
        const storedPackageName = localStorage.getItem("selectedPackageName");
        const storedDate = localStorage.getItem("selectedDate");
        const storedParticipants = localStorage.getItem("participants");
        const storedSlot = localStorage.getItem("selectedSlot");
        const storedSlotId = localStorage.getItem("selectedSlotId");

        if (storedPackageName) setSelectedPackageName(storedPackageName);
        if (storedDate) setSelectedDate(storedDate);
        if (storedParticipants) setStoredParticipants(storedParticipants);
        if (storedSlot) setSelectedSlot(storedSlot);
        if (storedSlotId) setSelectedSlotId(storedSlotId);

        if (storedPackageId && storedParticipants) {
            const packageId = Number(storedPackageId);
            const participantCount = parseInt(storedParticipants, 10);

            getPackageById(packageId)
                .then((res) => {
                    const pricePerPerson = Number(res.data?.data?.price) || 0;
                    const total = pricePerPerson * participantCount;

                    // GST and Grand Total Amount
                    const gstAmount = total * 0.18; // 18% GST
                    const grandTotalValue = total + gstAmount;

                    setSubtotal(total.toFixed(2));
                    setGst(gstAmount.toFixed(2));
                    setDiscount("0.00");
                    setGrandTotal(grandTotalValue.toFixed(2));
                })
                .catch((err) => {
                    console.error("Error fetching package:", err);
                });
        }
    }, []);

    const handleApplyCoupon = () => {
        const storedPackageId = localStorage.getItem("selectedPackageId");
        const storedParticipants = localStorage.getItem("participants");

        if (!storedPackageId || !storedParticipants || !couponCode) {
            console.warn("Missing data to apply coupon");
            return;
        }

        setApplyingCoupon(true);

        const packageId = Number(storedPackageId);
        const participantCount = parseInt(storedParticipants, 10);

        getPackageById(packageId)
            .then((res) => {
                const pricePerPerson = Number(res.data?.data?.price || 0);
                const total = pricePerPerson * participantCount;

                // Set subtotal regardless of coupon
                setSubtotal(total.toFixed(2));

                return applyCoupon(packageId, couponCode, participantCount)
                    .then((couponRes) => {
                        const discountedPrice = Number(couponRes?.data?.discounted_price || total);
                        const discountAmount = total - discountedPrice;

                        // GST and Grand Total after discount
                        const gstAmount = discountedPrice * 0.18;
                        const grandTotalValue = discountedPrice + gstAmount;

                        setDiscount(discountAmount.toFixed(2));
                        setGst(gstAmount.toFixed(2));
                        setGrandTotal(grandTotalValue.toFixed(2));
                        setCouponError("");
                    })
                    .catch((err) => {
                        console.error("Coupon apply failed:", err);
                        setCouponError("Invalid or expired coupon code.");
                        setDiscount("0.00");

                        // Restore original totals without discount
                        const gstAmount = total * 0.18;
                        const grandTotalValue = total + gstAmount;
                        setGst(gstAmount.toFixed(2));
                        setGrandTotal(grandTotalValue.toFixed(2));
                    })
                    .finally(() => {
                        setApplyingCoupon(false);
                    });
            })
            .catch((err) => {
                console.error("Error fetching package:", err);
                setApplyingCoupon(false);
            });
    };

    const handleBookingSubmit = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("package_id", localStorage.getItem("selectedPackageId") || "");
            formData.append("whatsappNo", whatsapp);
            formData.append("email", email);
            formData.append("age", age);
            formData.append("gender", gender);
            formData.append("nationality", nationality);
            if (selectedDocument) {
                formData.append("document", selectedDocument);
            }
            formData.append("dateOfScuba", selectedDate);
            formData.append("slot", selectedSlotId);
            formData.append("numberOfParticipants", storedParticipants);
            formData.append("price", grandTotal);

            await postBooking(formData);
            alert("Booking submitted successfully!");
            navigate('/');
        } catch (error) {
            console.error("Booking failed:", error);
            alert("Booking failed. Please check the required fields.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ whatsapp: true, email: true });
        if (isValid) {
            handleBookingSubmit();
        } else {
            console.log("Form has errors:", errors);
        }
    };

    return (
        <>
            <div className="max-w-3xl mx-auto bg-white px-6 sm:p-8 py-3 shadow-md border-1 border-[#d8d8d8] rounded-md">
                <form className="space-y-4 Poppins text-[#a2a2a2]">
                    {/* Package Selection */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md">
                            <input
                                type="text"
                                className="w-full placeholder:text-[#a2a2a2] text-[#2e2e2e] rounded px-4 py-2"
                                value={`Selected Package : ${selectedPackageName || ''}`}
                                readOnly
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md">
                            <input
                                type="text"
                                className="w-full placeholder:text-[#a2a2a2] text-[#2e2e2e] rounded px-4 py-2"
                                value={`Number of Participants : ${storedParticipants || ''}`}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <User className="w-5 mr-2" />
                            <input
                                type="text"
                                placeholder="Full Name*"
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                        </div>
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <Phone className="w-5 mr-2" />
                            <input
                                type="tel"
                                placeholder="WhatsApp Number*"
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, whatsapp: true }))}
                            />
                        </div>
                        {touched.whatsapp && errors.whatsapp && (
                            <span className="text-red-500 text-sm">{errors.whatsapp}</span>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <Mail className="w-5 mr-2" />
                            <input
                                type="email"
                                placeholder="Email Address*"
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                            />
                        </div>
                        {touched.email && errors.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    {/* Age and Gender */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                                <User className="w-5 mr-2" />
                                <input
                                    type="number"
                                    placeholder="Age*"
                                    className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3 pl-0">
                                <div className="relative w-full">
                                    <select
                                        className="w-full text-[#2e2e2e] bg-white pl-2 rounded-md appearance-none focus:outline-none"
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                    >
                                        <option value="">Select Gender*</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                                        <ChevronDown />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nationality */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <Check className="w-5 mr-2" />
                            <input
                                type="text"
                                placeholder="Nationality*"
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-2">
                            <File className="w-5 mr-2" />
                            <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="w-full border-none shadow-none p-0 pt-1 "
                                onChange={(e) => setSelectedDocument(e.target.files?.[0] || null)}
                            />
                        </div>
                    </div>

                    {/* Date of Adventure */}
                    <div>
                        <div className="flex flex-col justify-start items-start border-1 border-[#63636333] rounded-md p-3">
                            {/* <Calendar className="w-5 mr-2" /> */}
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    localStorage.setItem("selectedDate", e.target.value);
                                }}
                                className="w-full text-[#2e2e2e] uppercase"
                            />

                            {selectedDate && (
                                <p className="mt-2 text-sm text-gray-700">
                                    Selected date : {format(parseISO(selectedDate), "dd-MM-yyyy")}
                                </p>
                            )}

                        </div>
                    </div>

                    {/* Slot Selection */}
                    <div>
                        <div className="flex justify-center items-center border-1 border-[#63636333] rounded-md p-3">
                            <BetweenVerticalEnd className="w-5 mr-2" />
                            <input
                                type="text"
                                value={selectedSlot ? `Selected slot : ${selectedSlot}` : ''}
                                readOnly
                                className="w-full text-[#2e2e2e] placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Slot"
                            />
                        </div>
                    </div>

                    {/* Promo Code */}
                    <div>
                        <div className="flex justify-center bg-gradient-to-r from-[#c5f5fa33] to-[#93e7ef33] items-center border-1 border-[#8DD5DC33] rounded-md p-3">
                            <input
                                type="text"
                                placeholder="Promo Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="w-full placeholder:text-[#a2a2a2] focus:outline-none focus:ring-0 focus:border-transparent"
                                disabled={applyingCoupon}
                            />

                            <button
                                className={`text-sm font-bold cursor-pointer text-[#058EBA] Poppins ml-3 flex items-center`}
                                type="button"
                                onClick={handleApplyCoupon}
                                disabled={applyingCoupon}
                            >
                                {applyingCoupon ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                        Applying...
                                    </>
                                ) : (
                                    "Apply"
                                )}
                            </button>

                        </div>

                        {couponError && (
                            <p className="text-sm text-red-500 mt-1">{couponError}</p>
                        )}
                    </div>

                    <div className="w-full max-w-3xl mx-auto border border-gray-200 rounded-lg overflow-hidden p-4 bg-white">
                        <div className="grid grid-cols-3 font-semibold text-sm text-gray-700 border-b pb-2 mb-2">
                            <span>Pakage Details</span>
                            <span className="text-center"></span>
                            <span className="text-right">Amount</span>
                        </div>

                        {summaryData.map((item, index) => (
                            <div key={index} className="grid grid-cols-3 py-1 text-sm text-gray-600">
                                <span>{item.label}</span>
                                <span className="text-center">—</span>
                                <span className="text-right">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-10 items-center">
                        <Button
                            type="button"
                            disabled={
                                !fullName || !whatsapp || !email || !age || !gender || !nationality || !selectedDate || !selectedSlot || isLoading
                            }
                            onClick={handleSubmit}
                            className={`flex items-center justify-center gap-1 w-40 text-white font-normal ${!fullName || !whatsapp || !email || !age || !gender || !nationality || !selectedDate || !selectedSlot
                                ? "bg-[#0191e9] opacity-50 cursor-not-allowed"
                                : "bg-[#0191e9] hover:opacity-90 cursor-pointer"
                                } rounded-full text-sm px-4 py-3`}
                        >
                            Make Payment {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ChevronRight size={18} />}
                        </Button>
                    </div>
                </form >
            </div >
        </>
    );
};

export default BookingForm;
