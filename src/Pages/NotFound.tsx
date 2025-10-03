// Pages/NotFound.tsx
import React from 'react';
import notfound from "../assets/images/404.webp";

const NotFound: React.FC = () => {
    return (
        <div className="text-center flex flex-col justify-center items-center">
            <img src={notfound} alt="" />
            <p className="mb-10 text-gray-600 text-xl Poppins capitalize">The page you’re looking for doesn’t exist.</p>
        </div>
    );
};

export default NotFound;
