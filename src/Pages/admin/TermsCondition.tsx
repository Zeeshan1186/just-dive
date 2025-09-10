import { useEffect, useState } from "react";
import { getTermscondition, deleteTermscondition } from "../../services/apiService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Term {
    id: number;
    title: string;
    descriptions: string[];
    created_at: string;
    updated_at: string;
}

export default function TermsCondition() {
    const [terms, setTerms] = useState<Term[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTerms = async () => {
            setLoading(true);
            try {
                const res = await getTermscondition();
                if (res.data.status === 200 && Array.isArray(res.data.data)) {
                    setTerms(res.data.data);
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

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this Term?")) return;

        setDeletingId(id);
        try {
            const res = await deleteTermscondition(id);
            if (res.data.status === 200) {
                toast.success(res.data.message || "Term deleted successfully!");
                setTerms((prev) => prev.filter((term) => term.id !== id));
            } else {
                toast.error(res.data.message || "Failed to delete Term.");
            }
        } catch (err) {
            console.error("Error deleting term:", err);
            toast.error("An error occurred while deleting the Term.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="px-4 py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl sm:text-4xl Poppins font-bold mb-4">
                    Terms and Conditions
                </h1>


                {/* ✅ Add New Term Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={() => navigate('/admin/AddTermscondition')}
                        className="bg-[#00228c] Poppins hover:[#00228c] text-white"
                    >
                        <Plus className="mr-1" /> Add New Term
                    </Button>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-600">Loading Terms & Conditions...</p>
            ) : (
                <>
                    {terms.map((term) => (
                        <div key={term.id} className="mb-8 border border-[#e7e7e7] p-4 rounded shadow-sm">
                            {/* Last Updated */}
                            <p className="text-sm text-[#444444] Poppins mb-4">
                                Last Updated:{" "}
                                <span className="font-sm Poppins text-[#444444]">
                                    {new Date(term.updated_at).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </p>

                            {/* Title */}
                            <h2 className="text-2xl font-semibold Poppins mb-2">{term.title}</h2>

                            {/* Descriptions */}
                            <div className="text-gray-700 Poppins leading-relaxed space-y-3">
                                {term.descriptions.map((desc, idx) => (
                                    <p key={idx}>{desc}</p>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={() =>
                                        navigate('/admin/AddTermscondition', {
                                            state: term,
                                        })
                                    }
                                    className="bg-blue-600 Poppins hover:bg-blue-700 text-white"
                                >
                                    <Plus className="mr-1" /> Update This Term
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(term.id)}
                                    disabled={deletingId === term.id}
                                    className="Poppins"
                                >
                                    {deletingId === term.id ? (
                                        <>
                                            <Loader2 className="mr-2 w-4 h-4 Poppins animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="mr-1" /> Delete This Term
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}

                </>
            )}
        </div>
    );
}
