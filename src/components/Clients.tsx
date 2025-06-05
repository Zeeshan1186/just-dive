import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from "@/components/ui/carousel";
import Logo from "../assets/images/Justdive.png";
import type { CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Clients() {
    const testimonials = [
        { image: Logo },
        { image: Logo },
        { image: Logo },
        { image: Logo },
        { image: Logo },
        { image: Logo },
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
        <div className="py-16">
            <div className="flex justify-center pb-10 items-center">
                <span className="w-88 border-t border-dotted border-[#C3A357]"></span>
                <span className="text-3xl md:text-5xl px-4 Trirong font-normal">
                    Our Certifications
                </span>
                <span className="w-88 border-t border-dotted border-[#C3A357]"></span>
            </div>

            <div className="flex justify-center items-center relative w-full max-w-4xl mx-auto">
                <Carousel
                    opts={{ align: "start", loop: true }}
                    setApi={setApi}
                    className="w-full"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem
                                key={index}
                                className="md:basis-1/2 lg:basis-1/4"
                            >
                                <div className="p-1">
                                    <Card className="border-none shadow-none">
                                        <CardContent className="flex items-center justify-center">
                                            <img
                                                src={testimonial.image}
                                                alt={`Client ${index + 1}`}
                                                className="h-24 object-contain"
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
                    className="absolute left-[-20px] textgolden top-1/2 -translate-y-1/2 z-10 p-2"
                >
                    <ChevronLeft size={55} strokeWidth={0.5} />
                </button>
                <button
                    onClick={() => api?.scrollNext()}
                    className="absolute right-[-20px] textgolden top-1/2 -translate-y-1/2 z-10 p-2"
                >
                    <ChevronRight size={55} strokeWidth={0.5} />
                </button>
            </div>

        </div>
    );
}

export default Clients;
