import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import certificate1 from "../assets/images/Certificates/certificate.jpg";
import certificate2 from "../assets/images/Certificates/certificatw.png";
import padi from "../assets/images/Certificates/padi.jpg";
import padi2 from "../assets/images/Certificates/padi2.png";
import type { CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Clients() {
    const testimonials = [
        { image: certificate1 },
        { image: certificate2 },
        { image: padi },
        { image: padi2 },
        { image: certificate1 },
        { image: padi },
    ];

    const [api, setApi] = useState<CarouselApi | null>(null);

    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 3000);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
            {/* Heading */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pb-8">
                <span className="w-24 sm:w-40 border-t border-dotted border-[#C3A357]"></span>
                <span className="text-2xl sm:text-3xl md:text-5xl px-4 Trirong font-normal text-center">
                    Our Certifications
                </span>
                <span className="w-24 sm:w-40 border-t border-dotted border-[#C3A357]"></span>
            </div>

            {/* Carousel */}
            <div className="flex justify-center items-center relative w-full max-w-6xl mx-auto">
                <Carousel
                    opts={{ align: "start", loop: true }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem
                                key={index}
                                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 px-2"
                            >
                                <div className="p-1">
                                    <Card className="border-none shadow-none">
                                        <CardContent className="flex items-center justify-center">
                                            <img
                                                src={testimonial.image}
                                                alt={`Client ${index + 1}`}
                                                className="h-40 sm:h-48 md:h-52 object-contain"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Custom Arrows */}
                <button
                    onClick={() => api?.scrollPrev()}
                    className="absolute left-2 sm:left-[-20px] cursor-pointer text-[#C3A357] top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
                >
                    <ChevronLeft
                        size={window.innerWidth >= 640 ? 55 : 30}
                        strokeWidth={1}
                    />
                </button>
                <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-2 sm:right-[-20px] cursor-pointer text-[#C3A357] top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2"
                >
                    <ChevronRight
                        size={window.innerWidth >= 640 ? 55 : 30}
                        strokeWidth={1}
                    />
                </button>
            </div>
        </div>
    );
}

export default Clients;
