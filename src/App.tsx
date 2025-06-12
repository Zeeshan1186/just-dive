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
        </Route>
        <Route path="/itinery" element={<IteneraryCardPage />} />
        <Route path="/scubapackages" element={<ScubaPackages />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/thankyou" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
