import { useEffect, useState } from "react";
import banner from "../assets/images/media.png";
import waves from "../assets/images/Waves.png";
import { getMedia } from "../services/apiService"; // your API call
import { toast } from "sonner";

const MediaPage = () => {
    const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
    const [popupImage, setPopupImage] = useState<string | null>(null);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const videos = [
        "https://www.youtube.com/embed/sN2WM3VwVwM",
    ];

    // Fetch images from API
    const fetchUploadedImages = async () => {
        setIsLoading(true);
        try {
            const res = await getMedia();
            if (res.data.status === 200 && res.data.data?.length > 0) {
                // Assuming API returns array of image URLs in res.data.data
                setUploadedImages(res.data.data);
            } else {
                toast.warning("No media found.");
                setUploadedImages([]);
            }
        } catch (error) {
            console.error("Error fetching media:", error);
            toast.error("Failed to fetch media.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUploadedImages();
    }, []);

    return (
        <>
            {/* Hero Banner */}
            <div
                className="relative flex justify-center items-center h-[50vh] sm:h-[65vh] md:h-[65vh] bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <img src={waves} alt="" className="w-10 sm:w-12" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl Trirong font-normal mb-6 text-center">
                        Media
                    </h1>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10">
                {/* Tabs */}
                <div className="flex justify-center mb-6 flex-wrap gap-3">
                    {["images", "videos"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 sm:px-6 py-2 cursor-pointer rounded-full font-medium transition text-sm sm:text-base ${activeTab === tab
                                ? "bg-[#0191e9] text-white"
                                : "bg-transparent text-[#0191e9] border border-[#0191e9]"
                                }`}
                            onClick={() => setActiveTab(tab as "images" | "videos")}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-semibold Trirong mb-10">
                    Some Beautiful Snapshoots
                </h2>

                {/* Grid */}
                {isLoading ? (
                    <div className="text-center text-lg">Loading media...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {activeTab === "images" &&
                            uploadedImages.map((src, i) => (
                                <img
                                    key={i}
                                    src={src.images}
                                    alt={`Image ${i}`}
                                    className="w-full rounded-md shadow-md cursor-pointer hover:opacity-90 transition"
                                    onClick={() => setPopupImage(src.images)}
                                />
                            ))}

                        {activeTab === "videos" &&
                            videos.map((src, index) => (
                                <iframe
                                    key={index}
                                    src={src}
                                    className="w-full h-64 rounded-md shadow-md"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                // controls
                                />
                            ))}
                    </div>
                )}
            </section>

            {/* Image Popup */}
            {popupImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
                    onClick={() => setPopupImage(null)}
                >
                    <button
                        className="absolute top-2 right-4 cursor-pointer text-white text-3xl sm:text-4xl font-bold hover:text-[#0191e9] transition z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPopupImage(null);
                        }}
                    >
                        &times;
                    </button>

                    <img
                        src={popupImage}
                        alt="Popup"
                        className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default MediaPage;
