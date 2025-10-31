import CTA from '@/components/CTA';
import Banner from '../components/Banner';
import Packages from '../components/Packages';
// import DiveLocation from '../components/DiveLocation';
// import AboutUs from '@/components/HomeAbout';
// import BlogSection from '@/components/BlogSection';
// import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import React, { Suspense, useEffect, useState } from 'react';
import type { IPackage } from '@/interface/package';
import { getActiveSpecificPackages } from '@/services/apiService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Imports component with lazy loading
const DiveLocation = React.lazy(() => import('../components/DiveLocation'));
const AboutUs = React.lazy(() => import('@/components/HomeAbout'));
const BlogSection = React.lazy(() => import('@/components/BlogSection'));

function HomePage() {
    const [packages, setPackages] = useState<IPackage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPackages = async () => {
        try {
            const res = await getActiveSpecificPackages();
            setPackages(res?.data?.data);
        } catch (err) {
            console.error("Packages API error:", err);
            toast.error("Failed to load packages");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPackages();
    }, []);

    const TestimonialCarousel = React.lazy(() =>
        import('@/components/TestimonialCarousel').then(module => ({ default: module.TestimonialCarousel }))
    );

    return (
        <>
            {!loading && packages.length > 0 ? <Banner packagesData={packages} /> : <Banner packagesData={[]} />}
            <Packages packages={packages} loading={loading} />
            <DiveLocation />
            <AboutUs />
            <BlogSection />
            <Suspense fallback={
                <div className='h-28 flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div>
            }>
                <TestimonialCarousel />
            </Suspense>
            <CTA />
            {/* <Clients /> */}

        </>
    );
}

export default HomePage;
