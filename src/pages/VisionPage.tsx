import React from 'react';
import './VisionPage.css';

// Image assets from Figma
const heroImage = "https://www.figma.com/api/mcp/asset/bc24784d-2b06-4755-ac9b-7eb1b332362c.png";
const handshakeIcon = "https://www.figma.com/api/mcp/asset/3e30a5ea-edb2-4c57-b5c2-1434562434d3.svg";
const agencyIcon = "https://www.figma.com/api/mcp/asset/b58f68c8-d709-4876-b99a-433365faa5ce.svg";
const communityIcon = "https://www.figma.com/api/mcp/asset/7e4ce0a4-45aa-4a74-9433-dd2b763845af.svg";
const heartIcon = "https://www.figma.com/api/mcp/asset/62b58a07-a66f-49eb-a22e-34d666a2d187.svg";

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
