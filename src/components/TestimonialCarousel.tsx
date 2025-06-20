import { useEffect, useRef, useState } from "react";
import anju from "../assets/images/Anju.jpg";
import rahul from "../assets/images/blog-img.png";

// Dynamic data
const testimonials = [
  {
    img: anju,
    quote:
      "Great service and attention to safety. A lot of effort went into choosing excellent dive sites. Everyone was incredibly enthusiastic and passionate about diving.",
    name: "Anju G",
    role: "Open Water Diver",
  },
  {
    img: rahul,
    quote:
      "An unforgettable diving experience! The instructors were top-notch, and the locations were simply breathtaking.",
    name: "Rahul P",
    role: "Adventure Diver",
  },
  {
    img: anju,
    quote:
      "Professional team and excellent equipment. It was my first dive and I felt very safe and excited.",
    name: "Maria L",
    role: "New Diver",
  },
];

export function TestimonialCarousel() {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Auto-rotate logic
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Optional: dynamic height fix if content size varies
  useEffect(() => {
    const el = testimonialsRef.current;
    if (el && el.children[active]) {
      el.style.height = el.children[active].clientHeight + "px";
    }
  }, [active]);

  return (
    <>
      <div className="flex justify-center items-center mt-5">
        <span className="w-80 border-t border-dotted border-[#C3A357]"></span>
        <span className="relative z-10 p-4 text-black text-4xl font-normal Trirong">
          Our Guests Speak For Us
        </span>
        <span className="w-80 border-t border-dotted border-[#C3A357]"></span>
      </div>
      <section className="relative font-inter antialiase flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl mx-auto">
          <div className="flex justify-center">
            <div
              className="w-full max-w-3xl text-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Image Layer */}
              <div className="relative h-32 mb-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-blue-600/25 before:via-blue-700/5 before:via-25% before:to-indigo-500/0 before:to-75% before:rounded-full before:-z-10">
                  <div className="h-32 [mask-image:_linear-gradient(0deg,transparent,white_20%,white)]">
                    {testimonials.map((t, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.68,-0.3,0.32,1)] ${index === active
                          ? "opacity-100 rotate-0 z-10"
                          : "opacity-0 -rotate-[60deg] z-0"
                          }`}
                      >
                        <img
                          src={t.img}
                          alt={t.name}
                          width={56}
                          height={56}
                          className="relative top-11 left-1/2 -translate-x-1/2 rounded-full object-cover w-14 h-14"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quote Text */}
              <div
                ref={testimonialsRef}
                className="mb-9 relative transition-all duration-500"
              >
                {testimonials.map((t, index) => (
                  <div
                    key={index}
                    className={`absolute left-0 right-0 transition-all duration-500 ${index === active
                      ? "opacity-100 translate-x-0 relative"
                      : "opacity-0 translate-x-4 absolute"
                      }`}
                  >
                    <p className="text-xl font-semibold Poppins text-slate-900">
                      {t.quote}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap Poppins justify-center -m-1.5">
                {testimonials.map((t, index) => (
                  <button
                    key={index}
                    className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1.5 m-1.5 text-xs shadow-sm transition-colors duration-150 ${index === active
                      ? "bg-[#C3A357] text-white shadow-indigo-950/10"
                      : "bg-white hover:bg-indigo-100 text-slate-900"
                      }`}
                    onClick={() => setActive(index)}
                  >
                    <span>{t.name}</span>{" "}
                    <span
                      className={`mx-1 ${index === active ? "text-indigo-200" : "text-slate-300"
                        }`}
                    >
                      -
                    </span>{" "}
                    <span>{t.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
