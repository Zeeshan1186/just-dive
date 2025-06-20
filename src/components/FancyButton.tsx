import React from 'react';
import '../FancyButton.css';

export const FancyButton: React.FC = () => {
    return (
        <>
            <button
                className="fancy-btn"
                style={{ ['--content' as any]: "'Book Now'" }}
            >
                <div className="left"></div>
                Book Now
                <div className="right"></div>
            </button>
        </>
    );
};
