import React from 'react';
import './UpdatesPage.css';

// Image assets from Figma
const womensDay = "https://www.figma.com/api/mcp/asset/c5e8f7d4-3a2b-4c1e-9f6a-8d7e5c4b3a2d.png";
const walkForFreedom = "https://www.figma.com/api/mcp/asset/a4b3c2d1-e0f9-8g7h-6i5j-4k3l2m1n0o9p.png";
const environmentDay = "https://www.figma.com/api/mcp/asset/b5c4d3e2-f1g0-h9i8-j7k6-l5m4n3o2p1q0.png";

export const UpdatesPage: React.FC = () => {
  return (
    <div className="updates-page">
      {/* Hero Section */}
      <section className="updates-hero">
        <h1 className="updates-title">Updates</h1>
      </section>

      {/* Updates Grid */}
      <div className="updates-grid">
        {/* Women's Day Celebration */}
        <article className="update-card">
          <div className="update-image">
            <img src={womensDay} alt="Women's Day Celebration 2026" />
          </div>
          <div className="update-content">
            <p className="update-date">March 8, 2026</p>
            <h2 className="update-card-title">Women's Day Celebration</h2>
            <p className="update-description">
              Join us in celebrating International Women's Day with our community of survivors.
              This special event honors the strength, resilience, and achievements of women who
              have overcome trafficking and are now thriving in their new lives. The celebration
              includes workshops, testimonials, and cultural performances that showcase their
              incredible journey towards freedom and empowerment.
            </p>
          </div>
        </article>

        {/* Walk for Freedom 2026 */}
        <article className="update-card">
          <div className="update-image">
            <img src={walkForFreedom} alt="Walk for Freedom 2026" />
          </div>
          <div className="update-content">
            <p className="update-date">October 19, 2026</p>
            <h2 className="update-card-title">Walk for Freedom 2026</h2>
            <p className="update-description">
              Be part of the global movement against human trafficking. Our annual Walk for Freedom
              brings together communities to raise awareness and stand in solidarity with survivors.
              This peaceful demonstration spreads hope and educates the public about the reality of
              modern-day slavery. Together, we walk to give voice to those who cannot speak and to
              show that freedom is everyone's right.
            </p>
          </div>
        </article>

        {/* Environment Day Activities */}
        <article className="update-card">
          <div className="update-image">
            <img src={environmentDay} alt="Environment Day 2026" />
          </div>
          <div className="update-content">
            <p className="update-date">June 5, 2026</p>
            <h2 className="update-card-title">Environment Day Activities</h2>
            <p className="update-description">
              Our women participated in tree planting and environmental awareness activities to
              celebrate World Environment Day. This initiative not only helps create a greener
              future but also empowers our community members through skill-building and collective
              action. The day included hands-on activities, educational sessions about sustainability,
              and a commitment to ongoing environmental stewardship in our local area.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
