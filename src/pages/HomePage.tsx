import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// Image assets from Figma
const jeevanAadharLogo = "https://www.figma.com/api/mcp/asset/c3569f4d-52e3-4f84-a1ad-f51ad6a6c0d3.png";
const btcLogo = "https://www.figma.com/api/mcp/asset/f6ff090d-59c8-4148-ad7d-ed6bd62ab1e3.png";
const catherinesLogo = "https://www.figma.com/api/mcp/asset/b42a280f-37d5-4264-8f9e-04440af6d953.png";
const tmiLogo = "https://www.figma.com/api/mcp/asset/44a9dfd1-06c3-4e0e-8292-21e3d240ccba.png";
const ywcaLogo = "https://www.figma.com/api/mcp/asset/3f9d21a8-9cef-4eb1-9a4e-44a96e9fd1e5.png";
const ellysAcademyLogo = "https://www.figma.com/api/mcp/asset/0850cdda-2938-423b-bfbe-1e277758e697.png";
const actLogo = "https://www.figma.com/api/mcp/asset/e8a24247-6581-4a96-a353-9b157852a6d4.png";
const buddyTeaching = "https://www.figma.com/api/mcp/asset/c0f9b639-7363-45d6-bf5e-2a17b8687d6a.png";
const img2134 = "https://www.figma.com/api/mcp/asset/8155d6a2-4137-4ad5-92fb-9fc346ebf4b4.png";
const img2324 = "https://www.figma.com/api/mcp/asset/8891f986-b98c-4406-9077-03ce9ea133c3.png";
const img2280 = "https://www.figma.com/api/mcp/asset/56df708a-fa05-478f-b9bd-93308540ce58.png";
const img2223 = "https://www.figma.com/api/mcp/asset/cc629e1f-afeb-4961-ba4a-019171ff7462.png";
const img2344 = "https://www.figma.com/api/mcp/asset/e1b5cfe3-0018-4014-a897-6c5d607920d4.png";
const img2360 = "https://www.figma.com/api/mcp/asset/dfa20359-750e-419a-8cd6-acf78996d089.png";
const img2351 = "https://www.figma.com/api/mcp/asset/1e91702e-bef3-4337-9709-63007ed1190f.png";

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
      <section className="mission-section">
        <div className="mission-image">
          <img
            src={img2360}
            alt="Together, to help her succeed"
            width="600"
            height="400"
            loading="lazy"
          />
        </div>
        <div className="mission-content">
          <h1 className="mission-title">
            Together, to help <span className="text-teal">her</span> succeed, whatever it takes!
          </h1>
          <div className="mission-text">
            <p>
              We believe that for every survivor of trafficking, being rescued is the first step of the journey to freedom. The lasting impact of exploitation runs deep - affecting self-worth, confidence, relationships, and the ability to imagine a different future.
            </p>
            <p>
              <strong>iSaahasi bridges this gap</strong> - walking alongside the women as they rebuild their lives with hope and dignity, growing them into capable, strong, confident and secure individuals.
            </p>
          </div>
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
      <section className="testimonial-section">
        <div className="testimonial-content">
          <h2 className="testimonial-title">
            What <span className="text-dark-teal">She</span> has to say
          </h2>
          <blockquote className="testimonial-quote">
            iSaahasi has given me the courage and confidence to believe in myself. And know my potential. I feel encouraged to keep growing by learning something new all the time.
          </blockquote>
          <p className="testimonial-author">- Disha</p>
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
