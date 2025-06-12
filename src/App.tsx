// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import BookingPage from './Pages/BookingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import NotFound from './Pages/NotFound';
import IteneraryCardPage from './Pages/ItineraryCardPage';
import AboutUsPage from './Pages/AboutUsPage';
import Faq from './Pages/Faq';
import ScubaPackages from './Pages/ScubaPackages';
import ContactUsPage from './Pages/ContactUsPage';
import ThankYouMessage from './components/ThankYouMessage';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/itinery" element={<IteneraryCardPage />} />
        <Route path="/scubapackages" element={<ScubaPackages />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contactus" element={<ContactUsPage />} />
        <Route path="/thankyou" element={<ThankYouMessage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
