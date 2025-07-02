import { useState } from "react";
import banner from "../assets/images/media.png";
import waves from "../assets/images/Waves.png";
import media1 from "../assets/images/Media/1.png";
import media2 from "../assets/images/Media/2.png";
import media3 from "../assets/images/Media/3.png";
import media4 from "../assets/images/Media/4.png";
import media5 from "../assets/images/Media/5.png";
import media6 from "../assets/images/Media/6.png";
import media7 from "../assets/images/Media/7.png";
import media8 from "../assets/images/Media/8.png";
import media9 from "../assets/images/Media/9.png";
import media10 from "../assets/images/Media/10.png";

const Media = () => {
    const images = [media1, media2, media3, media4, media8, media10, media6, media7, media9, media5];

    const videos = [
        "https://www.w3schools.com/html/mov_bbb.mp4",
        "https://www.w3schools.com/html/movie.mp4",
    ];

    const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
    const [popupImage, setPopupImage] = useState<string | null>(null);

    return (
        <>
            {/* Hero Banner */}
            <div
                className="relative flex justify-center items-center h-[85vh] bg-cover bg-no-repeat bg-right"
                style={{ backgroundImage: `url(${banner})` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 flex flex-col justify-center items-center h-full max-w-6xl mx-auto px-4 text-white">
                    <div className="mb-4">
                        <span className="text-xl text-yellow-300">
                            <img src={waves} alt="" />
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl Trirong font-normal mb-6">Media</h1>
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 py-10">
                {/* Tabs */}
                <div className="flex justify-center mb-6 space-x-4">
                    {["images", "videos"].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-2 rounded-full font-medium transition ${activeTab === tab
                                ? "bg-[#b89d53] text-white"
                                : "bg-transparent text-[#b89d53] border border-[#b89d53]"
                                }`}
                            onClick={() => setActiveTab(tab as "images" | "videos")}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <h2 className="text-center text-3xl font-semibold Trirong mb-10">
                    Some Beautiful Snapshoots
                </h2>

                {/* Grid */}
                <div
                    className={`columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2`}
                >
                    {activeTab === "images" &&
                        images.map((src, i) => (
                            <img
                                key={i}
                                src={src}
                                alt={`Image ${i}`}
                                className="w-full shadow-md cursor-pointer hover:opacity-90 transition"
                                onClick={() => setPopupImage(src)}
                            />
                        ))}

                    {activeTab === "videos" &&
                        videos.map((src, index) => (
                            <video
                                key={index}
                                controls
                                src={src}
                                className="w-full h-auto rounded-md shadow-md mb-4"
                            />
                        ))}
                </div>
            </section>

            {/* Image Popup */}
            {popupImage && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
                    onClick={() => setPopupImage(null)} // Close on backdrop click
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-30 text-white text-4xl font-bold hover:text-[#b89d53] transition z-50"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent backdrop click from firing
                            setPopupImage(null);
                        }}
                    >
                        &times;
                    </button>

                    {/* Image - prevent click from closing popup */}
                    <img
                        src={popupImage}
                        alt="Popup"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default Media;
