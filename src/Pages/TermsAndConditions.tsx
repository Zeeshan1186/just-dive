import { useEffect, useState } from "react";
import { getTermscondition } from "../services/apiService";
import { toast } from "sonner";
import banner from "../assets/images/About_ban.png";
import waves from "../assets/images/Waves.png";
import { LaptopMinimalCheck, Mail, Phone } from "lucide-react";

interface Term {
    id: number;
    title: string;
    descriptions: string[];
    created_at: string;
    updated_at: string;
}

export default function TermsAndConditions() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTerms = async () => {
            setLoading(true);
            try {
                const res = await getTermscondition();
                if (res.data.status === 200 && Array.isArray(res.data.data)) {
                    // Sort terms by updated_at descending (latest first)
                    const sortedTerms = [...res.data.data].sort(
                        (a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime()
                    );
                    setTerms(sortedTerms);
                } else {
                    toast.error(res.data.message || "Failed to load Terms & Conditions");
                }
            } catch (err) {
                console.error("Error fetching terms:", err);
                toast.error("An error occurred while fetching Terms & Conditions");
            } finally {
                setLoading(false);
            }
        };

        fetchTerms();
    }, []);

    // Get the latest updated date
    const lastUpdated = terms.length > 0 ? terms[0].updated_at : null;

    return (
        <>
            <div
                className="relative flex justify-center items-center h-[65vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl Trirong md:text-5xl font-normal leading-tight mb-6">
                        Terms And Conditio
                    </h1>
                </div>
            </div>

            <div className="px-12 py-10 pb-0">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                    Just Dive – Terms and Conditions
                </h1>

                {/* 📅 Last Updated only once */}
                {lastUpdated && (
                    <p className="text-sm text-gray-500 mb-6">
                        Last Updated:{" "}
                        <span className="font-medium text-green-600">
                            {new Date(lastUpdated).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </p>
                )}

                {loading ? (
                    <p className="text-gray-600">Loading Terms & Conditions...</p>
                ) : (
                    <>
                        {terms.map((term) => (
                            <div key={term.id} className="mb-2">
                                {/* Title */}
                                <h2 className="text-2xl font-semibold mb-2">{term.title}</h2>

                                {/* Descriptions */}
                                <div className="text-gray-700 leading-relaxed space-y-3">
                                    {term.descriptions.map((desc, idx) => (
                                        <p key={idx}>{desc}</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="ml-12 mb-12">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <ul className="mt-3">
                    <li className="flex gap-3"><Mail className="w-5" />Zeeshan@excitesys.com</li>
                    <li className="flex gap-3"><Phone className="w-5" />8482982932</li>
                    <li className="flex gap-3"><LaptopMinimalCheck className="w-5" />Just Dive</li>
                </ul>
            </div>
        </>
    );
}
