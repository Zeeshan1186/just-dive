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
import Faq from './Pages/FaqPage';
import ScubaPackages from './Pages/murdeshwarpackages';
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
import EditCoupon from './components/Coupon/EditCoupon';
import AdminBookingPage from './Pages/admin/BookingPage';
import BlogDetailPage from './Pages/BlogDetailPage';
import Blogs from './Pages/BlogsPage';
import Media from './Pages/MediaPage';
import AdminBlogs from './Pages/admin/AdminBlogsList';
import AddBlog from './Pages/admin/AddBlog';
import AddAdminBooking from './components/Booking/addAdminBooking';
import AdminMedia from './Pages/admin/AddMedia';
import AdminTermsCondition from './Pages/admin/AdminTermsCondition';
import TermsAndConditions from './Pages/TermsAndConditions';
import TermsCondition from './Pages/admin/TermsCondition';
import ReportPage from './Pages/admin/ReportPage';
import BlogsCategories from './Pages/admin/BlogsCategories';
import CategoryBlogsPage from './Pages/CategoryBlogsPage';
import ScrollToTop from './components/ScrollToTop';
import Murdeshwar from './Pages/Murdeshwar';
import PrivacyPolicy from './Pages/PrivacyPolicy';

const App: React.FC = () => {
  return (
    <RootLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/booking/:id" element={<BookingPage />} />
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
          <Route path="coupon/edit/:id" element={<EditCoupon />} />
          {/* Package Url */}
          <Route path="add-package" element={<AddPackage />} />
          <Route path="package" element={<PackagePage />} />
          <Route path="package/edit/:id" element={<EditPackage />} />
          {/* Booking Url */}
          <Route path="booking" element={<AdminBookingPage />} />
          <Route path="booking/add" element={<AddAdminBooking />} />

          {/* Report Url */}
          <Route path="report" element={<ReportPage />} />

          {/* Blog Url */}
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="edit-blog/:id" element={<AddBlog />} />
          <Route path="/admin/add-blog" element={<AddBlog />} />
          <Route path="/admin/edit-blog/:id" element={<AddBlog />} />
          <Route path="/admin/blogcategories" element={<BlogsCategories />} />
          <Route path="/admin/Addmedia" element={<AdminMedia />} />
          <Route path="/admin/AddTermscondition" element={<AdminTermsCondition />} />
          <Route path="/admin/Termscondition" element={<TermsCondition />} />
        </Route>
        <Route path="/:packageId" element={<ItineraryCardPage />} />
        <Route path="/murdeshwar" element={<Murdeshwar />} />
        <Route path="/murdeshwarpackages" element={<ScubaPackages />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/category/:categoryId" element={<CategoryBlogsPage />} />
        <Route path="/media" element={<Media />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/termsandcondition" element={<TermsAndConditions />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/thankyou" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes >
    </RootLayout >
  );
};

export default App;
