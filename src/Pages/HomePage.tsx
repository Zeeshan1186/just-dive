import CTA from '@/components/CTA';
import Banner from '../components/Banner';
import DiveLocation from '../components/DiveLocation';
import Packages from '../components/Packages';
import AboutUs from '@/components/HomeAbout';
import BlogSection from '@/components/BlogSection';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { Helmet } from 'react-helmet-async';
// import Clients from '@/components/Clients';

function HomePage() {
    return (
        <>
            <Helmet>
                <title>Scuba Diving in Murdeshwar | Just Dive Scuba</title>
                <meta name="description" content="Experience thrilling scuba diving in Murdeshwar with Just Dive Scuba. Explore coral reefs, marine life & safe guided dives with certified instructors." />
                <meta name="keywords" content=" Scuba Diving in Murdeshwa" />
            </Helmet>
            <Banner />
            <Packages />
            <DiveLocation />
            <AboutUs />
            <BlogSection />
            <TestimonialCarousel />
            <CTA />
            {/* <Clients /> */}

        </>
    );
}

export default HomePage;
