// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import BookingPage from './Pages/BookingPage';
import NotFound from './Pages/NotFound';
import IteneraryCardPage from './Pages/ItineraryCardPage';
import AboutUsPage from './Pages/AboutUsPage';
import LoginPage from './Pages/LoginPage';
import { RootLayout } from './layouts/RootLayouts';
import DashboardPage from './Pages/admin/DashboardPage';
import PrivateLayout from './layouts/PrivateLayout';
import Faq from './Pages/Faq';
import ScubaPackages from './Pages/ScubaPackages';
import ContactUsPage from './Pages/ContactUsPage';
import ThankYouMessage from './components/ThankYouMessage';
import LocationPage from './Pages/admin/LocationPage';
import AddLocation from './components/Location/AddLocation';
import EditLocation from './components/Location/EditLocation';
import CouponPage from './Pages/admin/CouponPage';
import AddCoupon from './components/Coupon/AddCoupon';
import AddPackage from './components/Package/AddPackage';
import PackagePage from './Pages/admin/PackagePage';
import EditPackage from './components/Package/EditPackage';
import ItineraryCardPage from './Pages/ItineraryCardPage';
import BlogDetailPage from './components/BlogDetailPage';
import Blogs from './Pages/Blogs';
import Media from './Pages/Media';

const App: React.FC = () => {
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/itinerypage" element={<IteneraryCardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<PrivateLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          {/* Location Url */}
          <Route path="location" element={<LocationPage />} />
          <Route path="location/add" element={<AddLocation />} />
          <Route path="location/edit/:id" element={<EditLocation />} />
          {/* Coupon Url */}
          <Route path="coupon" element={<CouponPage />} />
          <Route path="coupon/add" element={<AddCoupon />} />
          {/* Package Url */}
          <Route path="add-package" element={<AddPackage />} />
          <Route path="package" element={<PackagePage />} />
          <Route path="package/edit/:id" element={<EditPackage />} />
        </Route>
        <Route path="/itinerary/:packageId" element={<ItineraryCardPage />} />
        <Route path="/scubapackages" element={<ScubaPackages />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/media" element={<Media />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/thankyou" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
