import React from 'react';
import './HerStory.css';

// Image assets from Figma
const imgRectangle65 = "https://www.figma.com/api/mcp/asset/d767fdab-9834-4da1-b38c-74724b4e8ddd.png";
const imgRectangle66 = "https://www.figma.com/api/mcp/asset/2572dd68-4a5b-4f9b-9f91-157130ad8d65.png";
const imgRectangle67 = "https://www.figma.com/api/mcp/asset/e0f331d8-e4df-4680-99ff-6a2ddc6cbcaf.png";
const imgRectangle68 = "https://www.figma.com/api/mcp/asset/c9c78685-6add-4b06-b117-c91525655286.png";

export const HerStory: React.FC = () => {
  return (
    <div className="her-story-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img
          src={imgRectangle65}
          alt="Her Story"
          className="hero-image"
        />
      </section>

      {/* Stories Section */}
      <section className="stories-section">
        {/* SEEMA Story Card */}
        <article className="story-card">
          <div className="story-card-content">
            <div className="story-image">
              <img src={imgRectangle66} alt="Seema" />
            </div>
            <div className="story-text">
              <div className="story-header">
                <h2 className="story-name">SEEMA</h2>
                <p className="story-subtitle">courage. resilience. transformation.</p>
              </div>
              <div className="story-divider"></div>
              <div className="story-body">
                <p>
                  Seema's journey is one of incredible courage and transformation. After being rescued from trafficking, she found hope and support through iSaahasi's programs. With dedicated mentorship and skills training, she has rebuilt her life with dignity and purpose.
                </p>
                <p>
                  Today, Seema works as a professional seamstress and is pursuing her education. She has become a beacon of hope for other survivors, showing them that a better future is possible. Her story exemplifies the power of resilience and the impact of comprehensive support in healing and rebuilding lives.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* RUBY Story Card */}
        <article className="story-card">
          <div className="story-card-content">
            <div className="story-image">
              <img src={imgRectangle67} alt="Ruby" />
            </div>
            <div className="story-text">
              <div className="story-header">
                <h2 className="story-name">RUBY</h2>
                <p className="story-subtitle">courage. resilience. transformation.</p>
              </div>
              <div className="story-divider"></div>
              <div className="story-body">
                <p>
                  Ruby's path to freedom began when she was rescued and connected with iSaahasi. Through the organization's holistic approach, she received counseling, vocational training, and life skills education. Her determination to create a new life for herself has been truly inspiring.
                </p>
                <p>
                  Now a confident young woman, Ruby has completed her education and is working in the hospitality industry. She credits iSaahasi for helping her discover her potential and giving her the tools to build a successful future. Ruby's transformation demonstrates the lasting impact of compassionate support and empowerment.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* RACHNA Story Card */}
        <article className="story-card">
          <div className="story-card-content">
            <div className="story-image">
              <img src={imgRectangle68} alt="Rachna" />
            </div>
            <div className="story-text">
              <div className="story-header">
                <h2 className="story-name">RACHNA</h2>
                <p className="story-subtitle">courage. resilience. transformation.</p>
              </div>
              <div className="story-divider"></div>
              <div className="story-body">
                <p>
                  Rachna's story is a testament to the human spirit's capacity to heal and thrive. After enduring unimaginable hardships, she found a safe haven and supportive community at iSaahasi. The organization's comprehensive programs helped her rebuild her confidence and discover her strengths.
                </p>
                <p>
                  Through vocational training in beauty and wellness, Rachna has found her calling. She now works as a professional beautician and is saving to open her own salon. Her journey from survivor to entrepreneur inspires everyone at iSaahasi, proving that with the right support, transformation is not just possible—it's inevitable.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};
