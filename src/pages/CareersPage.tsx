import React from 'react';
import './CareersPage.css';
import heroImage from '../assets/images/careers/hero.webp';

export const CareersPage: React.FC = () => {
  return (
    <div className="careers-page">
      <section className="careers-hero">
        <img
          src={heroImage}
          alt="Women gathered in a group discussion at iSaahasi"
          className="careers-hero-image"
        />
      </section>

      <section className="careers-content">
        <h1 className="careers-title">Careers</h1>
        <div className="careers-divider" />
        <div className="careers-body">
          <p>
            <strong>iSaahasi Academy India Foundation</strong> is a non-profit
            organization dedicated to empowering young, vulnerable women to
            become confident individuals capable of making informed choices. We
            achieve this through education, counseling, mentoring, and the
            development of workplace skills.
          </p>
          <p>
            In partnership with our affiliated organization, our participants
            gain financial independence while receiving job training, workplace
            skills, and hands-on experience in a supportive environment.
          </p>
          <p>
            Currently, we’re not hiring for any new positions, but we’re always
            eager to connect with individuals who share our passion and vision.
          </p>
          <p>Please feel free to check back periodically for future opportunities.</p>
        </div>
      </section>
    </div>
  );
};
