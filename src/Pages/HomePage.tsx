import CTA from '@/components/CTA';
import Banner from '../components/Banner';
import DiveLocation from '../components/DiveLocation';
import Packages from '../components/Packages';
import AboutUs from '@/components/AboutUs';
import BlogSection from '@/components/BlogSection';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import Clients from '@/components/Clients';

function HomePage() {
    return (
        <>
            <Banner />
            <Packages />
            <DiveLocation />
            <AboutUs />
            <BlogSection />
            <TestimonialCarousel />
            <CTA />
            <Clients />
        </>
    );
}

export default HomePage;
