import React from 'react';
import './OurStoryPage.css';

// Image assets from Figma
const imgRectangle70 = "https://www.figma.com/api/mcp/asset/bd600e04-ab95-4418-9c13-004ad6f9cad8.png";
const imgSurekhaA31 = "https://www.figma.com/api/mcp/asset/dad4d27b-e350-49ff-81d4-01320cf6fb20.png";

interface TimelineEvent {
  year: string;
  title: string;
  description?: string;
  highlightBold?: string;
  highlightText?: string;
}

export const OurStoryPage: React.FC = () => {
  const timelineEvents: TimelineEvent[] = [
    {
      year: "2007",
      title: "The vision takes shape",
      description: "Our founders had been working closely with young women who were survivors of human trafficking, abuse, and other forms of exploitation, recognize the need to thoughtfully design learning programme that could help the women rebuild meaningful futures."
    },
    {
      year: "2014",
      title: "Research & Learning and Consultation",
      description: "The vision evolved into a comprehensive model, connected with like-minded educators, social workers, and community leaders."
    },
    {
      year: "2015",
      title: "Programme Development",
      description: "Developed a learning model that respected each woman's unique educational journey while addressing their individual needs."
    },
    {
      year: "2016",
      title: "iSaahasi Academy India Foundation is Established",
      highlightBold: "With the mission “Together, to help her succeed whatever it takes”,",
      highlightText: " combining education, skilling and holistic support as a pathway to dignity, hope, freedom and lasting social change"
    },
    {
      year: "2016 Onwards",
      title: "Sustainable Transformation",
      description: "iSaahasi continues to ensure that every women who joins the programme, receives high-quality education as well as a safe, respectful, and empowering community where they can learn, heal, and thrive."
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
          <p className="story-section-label">Our Story</p>
          <p className="intro-text">
            iSaahasi Academy India Foundation was established in June 2016 with the vision of creating educational opportunities for young women whose learning journeys had been interrupted due to challenging life circumstances.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <p className="story-section-label">The Beginning</p>
        <div className="timeline-container">
          <div className="timeline-line"></div>
          <div className="timeline-items">
            {timelineEvents.map((event, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-year">
                  <h2 className="timeline-year-text">{event.year}</h2>
                </div>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3 className="timeline-content-title">{event.title}</h3>
                  {event.description && (
                    <p className="timeline-content-description">{event.description}</p>
                  )}
                  {event.highlightBold && (
                    <p className="timeline-content-description">
                      <strong>{event.highlightBold}</strong>
                      {event.highlightText}
                    </p>
                  )}
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
            alt="iSaahasi vision board"
            className="quote-image"
          />
        </div>
        <div className="quote-box">
          <div className="quote-box-content">
            <blockquote className="quote-box-text">
              At iSaahasi, education is more than acquiring knowledge&mdash;it is a pathway to dignity, hope, freedom, and lasting social change.
            </blockquote>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="story-closing-section">
        <div className="story-closing-content">
          <p>
            Today, iSaahasi continues to empower women through education, believing that every woman deserves the opportunity to learn, grow, and realize her full potential, regardless of her past circumstances.
          </p>
          <p>
            Every woman who enters iSaahasi brings unique experiences, strengths, and aspirations. By combining education with mentorship, counselling, health care and holistic support, we help participants rediscover their potential, pursue meaningful opportunities, and become leaders in their families, workplaces, and communities.
          </p>
        </div>
      </section>
    </div>
  );
};
