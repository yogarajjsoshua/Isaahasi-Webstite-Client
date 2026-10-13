import React from 'react';
import './VisionPage.css';
import heroImage from '../assets/images/vision/hero.jpg';
import handshakeIcon from '../assets/icons/vision/handshake.svg';
import agencyIcon from '../assets/icons/vision/agency.svg';
import communityIcon from '../assets/icons/vision/community.svg';
import heartIcon from '../assets/icons/vision/heart.svg';

export const VisionPage: React.FC = () => {
  return (
    <div className="vision-page">
      {/* Hero Image Section */}
      <section className="hero-image">
        <img src={heroImage} alt="Women with signs" />
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <p className="mission-label">OUR MISSION</p>
        <h1 className="mission-title">
          Together, to help her succeed, whatever it takes!
        </h1>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <h2 className="values-title">OUR VALUES</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">
              <img src={handshakeIcon} alt="Dignity and Respect" />
            </div>
            <p className="value-label">Dignity/Respect</p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <img src={agencyIcon} alt="The Primacy of Agency" />
            </div>
            <p className="value-label">The Primacy of Agency</p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <img src={communityIcon} alt="Community" />
            </div>
            <p className="value-label">Community</p>
          </div>
          <div className="value-item">
            <div className="value-icon">
              <img src={heartIcon} alt="Servant-hearted" />
            </div>
            <p className="value-label">Servant-hearted</p>
          </div>
        </div>
      </section>
    </div>
  );
};
