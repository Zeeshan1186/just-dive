// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import BookingPage from './Pages/BookingPage';
import Header from './components/Header';
import Footer from './components/Footer';
import AboutUs from './Pages/AboutUs';
import NotFound from './Pages/NotFound';

const App: React.FC = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="*" element={<NotFound />} /> {/* catch-all route */}
      </Routes>
      <Footer />
    </>
  );
};

export default App;
