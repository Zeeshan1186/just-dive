import CTA from '@/components/CTA';
import Banner from '../components/Banner';
import DiveLocation from '../components/DiveLocation';
import Header from '../components/Header';
import Packages from '../components/Packages';
import AboutUs from '@/components/AboutUs';
import BlogSection from '@/components/BlogSection';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import Footer from '@/components/Footer';

function HomePage() {
    return (
        <>
            <Header />
            <Banner />
            <Packages />
            <DiveLocation />
            <AboutUs />
            <BlogSection />
            <TestimonialCarousel />
            <CTA />
            <Footer />
        </>
    );
}

export default HomePage;
