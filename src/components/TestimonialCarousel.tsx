import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import anju from "../assets/images/Anju.jpg";
import rahul from "../assets/images/blog-img.png";

const testimonials = [
  {
    name: "Anju G",
    message:
      "Great service and attention to safety. A lot of effort went into choosing excellent dive sites. Everyone was incredibly enthusiastic and passionate about diving. Extra kudos to dive guide/instructor Grace. Will return for additional training.",
    date: "May 8, 2024",
    image: anju,
  },
  {
    name: "Rahul P",
    message:
      "An unforgettable diving experience! The instructors were top-notch, and the locations were simply breathtaking. Highly recommend it to anyone visiting Goa.",
    date: "May 4, 2024",
    image: rahul,
  },
  {
    name: "Maria L",
    message:
      "Professional team and excellent equipment. Loved the entire experience. It was my first dive and I felt very safe and excited.",
    date: "April 28, 2024",
    image: anju,
  },
];

export function TestimonialCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Scroll to the current index — without scrolling the whole page
  useEffect(() => {
    const container = carouselRef.current?.querySelector(
      "[data-carousel-content]"
    ) as HTMLElement;

    if (container) {
      const itemWidth = container.offsetWidth;
      container.scrollTo({
        left: itemWidth * currentIndex,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);


  return (
    <section className="w-full px-4 py-10 md:py-10 bg-white">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-6 relative">
        <div className="flex justify-center items-center">
          <span className="w-80 border-t border-dotted border-[#C3A357]"></span>
          <span className="relative z-10 p-4 text-black text-4xl font-normal Trirong">
            Our Guests Speak For Us
          </span>
          <span className="w-80 border-t border-dotted border-[#C3A357]"></span>
        </div>
      </h2>

      <Carousel className="w-[90%] md:w-[40%] max-w-4xl mx-auto" ref={carouselRef}>
        <CarouselContent data-carousel-content>
          {testimonials.map((testimonial, index) => (
            <CarouselItem key={index} data-carousel-item className="px-4">
              <Card className="rounded-xl shadow-md border-[#d3d3d3]">
                <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{testimonial.message}</p>
                    <p className="text-gray-400 text-xs mt-3">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* <div className="absolute bottom-[-1vw] left-60"> */}
          <div>
            <CarouselPrevious className="border-[#d8d8d8]" />
            <CarouselNext className="border-[#d8d8d8]" />
          </div>
      </Carousel>
    </section>
  );
}
