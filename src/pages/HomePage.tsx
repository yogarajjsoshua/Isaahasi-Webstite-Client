import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import jeevanAadharLogo from '../assets/images/home/partners/jeevan-aadhar.jpg';
import btcLogo from '../assets/images/home/partners/btc.png';
import catherinesLogo from '../assets/images/home/partners/catherines.png';
import tmiLogo from '../assets/images/home/partners/tmi.png';
import ywcaLogo from '../assets/images/home/partners/ywca.png';
import ellysAcademyLogo from '../assets/images/home/partners/ellys-academy.png';
import actLogo from '../assets/images/home/partners/act.jpg';
import buddyTeaching from '../assets/images/home/buddy-teaching.jpg';
import img2134 from '../assets/images/home/img-2134.jpg';
import img2324 from '../assets/images/home/img-2324.jpg';
import img2280 from '../assets/images/home/img-2280.jpg';
import img2223 from '../assets/images/home/img-2223.jpg';
import img2344 from '../assets/images/home/img-2344.png';
import img2360 from '../assets/images/home/img-2360.png';
import img2351 from '../assets/images/home/img-2351.png';

export const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselImages = [
    img2344, // First slide
    img2223,
    img2280,
    img2324,
    img2134,
    buddyTeaching
  ];

  const partnerLogos = [
    jeevanAadharLogo,
    btcLogo,
    catherinesLogo,
    tmiLogo,
    ywcaLogo,
    ellysAcademyLogo,
    actLogo
  ];

  // Auto-advance carousel (respects user motion preferences)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  return (
    <div className="homepage">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-container">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'carousel-slide--active' : ''}`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                width="1200"
                height="600"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
              />
            </div>
          ))}
        </div>
        <div className="carousel-indicators">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentSlide ? 'carousel-indicator--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="home-mission-section">
        <div className="home-mission-content">
          <h1 className="home-mission-title">
            Together, to help <span className="text-teal">her</span> succeed, whatever it takes!
          </h1>
          <div className="home-mission-text">
            <p>
              We believe that for every survivor of trafficking, being rescued is the first step of the journey to freedom. The lasting impact of exploitation runs deep - affecting self-worth, confidence, relationships, and the ability to imagine a different future.
            </p>
            <p>
              <strong>iSaahasi bridges this gap</strong> - walking alongside the women as they rebuild their lives with hope and dignity, growing them into capable, strong, confident and secure individuals.
            </p>
          </div>
        </div>
        <div className="home-mission-image">
          <img
            src={img2360}
            alt="Together, to help her succeed"
            width="600"
            height="400"
            loading="lazy"
          />
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-content">
          <blockquote className="quote-text">
            <p className="quote-line">"FOR SURVIVORS OF TRAFFICKING FREEDOM BEGINS WITH BEING RESCUED...</p>
            <p className="quote-line quote-line--indented">...BEING RESCUED IS ONLY THE BEGINNING"</p>
          </blockquote>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section-wrapper">
        <div className="testimonial-section">
          <div className="testimonial-content">
            <h2 className="testimonial-title">
              What <span className="text-dark-teal">She</span> has to say
            </h2>
            <blockquote className="testimonial-quote">
              iSaahasi has given me the courage and confidence to believe in myself. And know my potential. I feel encouraged to keep growing by learning something new all the time.
            </blockquote>
            <p className="testimonial-author">- Disha</p>
          </div>
        </div>
      </section>

      {/* Her Story Preview */}
      <section className="her-story-preview">
        <div className="her-story-content">
          <div className="her-story-image">
            <img
              src={img2351}
              alt="Her Story"
              width="500"
              height="500"
              loading="lazy"
            />
          </div>
          <div className="her-story-text">
            <h2 className="her-story-title">
              <span className="text-teal">her</span> story.
            </h2>
            <Link to="/her-story" className="know-more-button">
              know more
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-header">
          <p className="stats-years">10 YEARS SINCE</p>
          <h2 className="stats-title">The path from rescue to freedom</h2>
          <div className="stats-divider"></div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">24</div>
            <p className="stat-label">Currently Enrolled</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">355+</div>
            <p className="stat-label">Women Served/ Employed</p>
          </div>
          <div className="stat-item">
            <div className="stat-number">150+</div>
            <p className="stat-label">Women Served through outreach programme or through partners</p>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <h2 className="partners-title">Our Partners</h2>
        <div className="partners-slider">
          <div className="partners-track">
            {/* Duplicate logos for seamless loop */}
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div key={index} className="partner-logo">
                <img
                  src={logo}
                  alt={`Partner ${(index % partnerLogos.length) + 1}`}
                  width="120"
                  height="80"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3 className="newsletter-subtitle">FOR NEWS AND UPDATES</h3>
            <p className="newsletter-description">
              To know more about the organization and get updates sign up now to our newsletter
            </p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => {
            e.preventDefault();
            console.log('Newsletter signup (Stage 1)');
          }}>
            <input
              type="email"
              placeholder="Enter Email ID"
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">
              Sign Up Now!
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
