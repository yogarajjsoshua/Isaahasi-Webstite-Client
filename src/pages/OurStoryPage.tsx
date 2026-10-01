import React from 'react';
import './OurStoryPage.css';

// Image assets from Figma
const imgRectangle70 = "https://www.figma.com/api/mcp/asset/bd600e04-ab95-4418-9c13-004ad6f9cad8.png";
const imgSurekhaA31 = "https://www.figma.com/api/mcp/asset/dad4d27b-e350-49ff-81d4-01320cf6fb20.png";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export const OurStoryPage: React.FC = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2007",
      title: "Vision takes shape",
      description: "The foundation's vision began to take form through research and community engagement."
    },
    {
      year: "2014",
      title: "Research & Learning",
      description: "Extensive research and consultation with stakeholders to understand the needs of survivors."
    },
    {
      year: "2015",
      title: "Programme Development",
      description: "Development of comprehensive programmes focusing on education, health, community, and employment."
    },
    {
      year: "2016",
      title: "Foundation Established",
      description: "Official establishment of iSaahasi Academy India Foundation in June 2016."
    },
    {
      year: "2016 onwards",
      title: "Sustainable Transformation",
      description: "Ongoing commitment to sustainable transformation and empowerment of survivors."
    }
  ];

  return (
    <div className="our-story-page">
      {/* Hero Section */}
      <section className="story-hero-section">
        <img
          src={imgRectangle70}
          alt="Our Story Hero"
          className="story-hero-image"
        />
      </section>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="intro-content">
          <h1 className="intro-title">Our Story</h1>
          <p className="intro-text">
            iSaahasi Academy India Foundation was established in June 2016 with a vision to empower survivors of trafficking through holistic support and sustainable transformation.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="timeline-container">
          <div className="timeline-line"></div>
          <div className="timeline-items">
            {timelineEvents.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">
                  <h2 className="timeline-year-text">{event.year}</h2>
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-content-title">{event.title}</h3>
                  <p className="timeline-content-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote with Image Section */}
      <section className="quote-with-image-section">
        <div className="quote-image-container">
          <img 
            src={imgSurekhaA31} 
            alt="Education and Empowerment" 
            className="quote-image"
          />
        </div>
        <div className="quote-box">
          <div className="quote-box-content">
            <h2 className="quote-box-title">
              What <span className="text-dark-teal">She</span> has to say
            </h2>
            <blockquote className="quote-box-text">
              Education is not just about learning; it's about finding a pathway to dignity, independence, and a future we can build for ourselves.
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  );
};
