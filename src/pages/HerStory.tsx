import React from 'react';
import './HerStory.css';

// Image assets from Figma
const imgHero = "https://www.figma.com/api/mcp/asset/517507d0-33f7-49ac-8cca-7a1c3421f2d9.png";
const imgSeemaBg = "https://www.figma.com/api/mcp/asset/a5d6cef9-40e7-49ac-a37e-a37fff0a6513.png";
const imgRubyBg = "https://www.figma.com/api/mcp/asset/5e8b584b-440e-439c-8178-5ddf837fa4b2.png";
const imgRachnaBg = "https://www.figma.com/api/mcp/asset/37a79b48-6fff-46b7-b629-f68669e86fba.png";
const imgDivider = "https://www.figma.com/api/mcp/asset/fda40e85-fae8-4a8c-b968-7782b5cb7841.svg";

interface Story {
  name: string;
  subtitle: string;
  image: string;
  paragraphs: string[];
}

const stories: Story[] = [
  {
    name: 'SEEMA',
    subtitle: 'courage. perseverance. steady growth.',
    image: imgSeemaBg,
    paragraphs: [
      "Seema lost her parents when she was just 5 years old and instead of receiving care and protection, she was betrayed and sold into a household where she faced harsh treatment, forced labor, and abuse. At age of 12 she escaped only to be sold again, and this time into a brothel in Mumbai. Life began with deep loss and hardship but young as she was, she held onto her courage. In one brave moment, she fled and sought help and was placed in safe shelter. For the first time, Seema had a safe space where she could rest from the chaos of her early years.",
      "From here she moved to another safe home for 3 years where she had the opportunity to learn basic literacy, tailoring skills and received regular counselling that helped her journey through her brokenness.",
      "Seema Joined iSaahasi in 2016, she still carried deep scars of mistrust and anger, showing little desire for personal or educational growth. Years of exploitation had conditioned her to shut herself off emotionally.",
      "With encouragement, she enrolled in the education program, though she struggled at first. Over time, she developed resilience, embraced learning, and started seeing education as a stepping stone for growth.",
      "Alongside academics, Seema grew as a leader. She took on responsibilities at the Academy, serving her colleagues. Her creativity and willingness to serve others helped her discover her voice and confidence, managing responsibilities with maturity and courage.",
      "Seema got married in 2024 and was blessed with a baby girl in October 2025. In May 2026, she graduated from Make Up Artist course, a long-time interest, which she pursued through every challenges.",
      "Today, Seema reflects on her journey with gratitude. From a child denied education and safety, to a young woman who now speaks with confidence, earns with dignity, and values education as her path to a brighter future; her transformation is remarkable.",
    ],
  },
  {
    name: 'RUBY',
    subtitle: 'courage. resilience. transformation.',
    image: imgRubyBg,
    paragraphs: [
      "When Ruby first came to iSaahasi in 2020, right in the middle of Covid, she was quiet, unsure of herself, and uncertain about her future. With consistent encouragement and a safe, supportive environment, as she learned English, mathematics, and essential life skills, her determination to build a better future became clear.",
      "iSaahasi supported Ruby in obtaining her legal documentation and encouraged her as she completed her high school education through homeschooling. She dreamed of studying psychology and becoming a counsellor, determined to one day help others facing challenges similar to her own.",
      "Then came an unexpected setback. Ruby's exam results were lower than the grades required for university admission. But instead of giving up, she chose another path.",
      "Drawing on the confidence and resilience she had developed, Ruby arranged an interview with the principal of a prestigious college of social work in Mumbai. She shared her story, her dreams, and her determination to succeed. Moved by her courage and ability to advocate for herself, the principal offered her a place at the university.",
      "To ensure finances would not stand in the way of her education, we committed to supporting her living expenses throughout her three-year degree while continuing to walk alongside her.",
      "Today, Ruby is no longer defined by uncertainty. She is confidently pursuing her dream of creating a better future for herself—and one day helping others do the same. She has completed her Graduation in social work and is currently interning with iSaahasi, teaching new participants and encouraging them to persevere.",
      "Her story is a powerful reminder that when young people are given safety, encouragement, and opportunity, they can achieve far more than they ever imagined.",
    ],
  },
  {
    name: 'RACHNA',
    subtitle: 'courage. resilience. transformation.',
    image: imgRachnaBg,
    paragraphs: [
      "Rachna was born into poverty in a small village and grew up in a fractured family, dividing her childhood between her mother and father. Her mother was passive and often depended on others to make important decisions, leaving Rachna vulnerable.",
      "Rachna was just seven years old, when a couple from Mumbai approached her mother saying they wanted to adopt and educate her. Perhaps she didn't understand and therefore did not reply to the couple. Later, in her absence, the couple convinced a relative to send Rachna with them. That moment sealed her fate.",
      "Instead of a loving home and a chance to study, Rachna was forced into domestic slavery. She spent her days cleaning, cooking, and serving the household. She was denied adequate food, made to sleep on the floor, and severely beaten and burned if she ate without permission. The promises of education and care were never fulfilled.",
      "Two years later, when Rachna was 9 years old, a neighbor noticed her screams, went to enquire where he saw the signs of abuse, and immediately reported it to the police. The child helpline was called, and Rachna was rescued from the slavery she was living in.",
      "She was placed in a safe home, where she stayed for the next eleven years. It became a place of healing and growth. She arrived there unable to speak but bit by bit, Rachna started building her life again.",
      "At eighteen, she moved in with another NGO for After Care support, and through them, she was introduced to iSaahasi.",
      "For the 5 years that she has been with iSaahasi, Rachna has worked hard not just academically but emotionally. Having missed her childhood education, it wasn't easy, but she worked hard at reading, writing and language skills. With constant encouragement, she completed her 12th grade. With regular counselling, she worked on forgiving her family members who once failed to protect her.",
      "Today, she is able to speak fluently in Hindi and enjoys communicating in English as well. She is married into a loving family, who genuinely care and encourage her to move forward. To her, \"Freedom is a choice. Freedom is dignity,\" she says. She continues to pray for resilience and positivity to face every challenge, proving that with compassion, opportunity, and support, healing and hope are possible.",
    ],
  },
];

export const HerStory: React.FC = () => {
  return (
    <div className="her-story-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={imgHero} alt="Her Story" className="hero-image" />
      </section>

      {/* Stories Section */}
      <section className="stories-section">
        {stories.map((story) => (
          <article key={story.name} className="story-card">
            <div className="story-card-bg" aria-hidden="true">
              <img src={story.image} alt="" className="story-card-bg-image" />
            </div>
            <div className="story-card-content">
              <div className="story-header">
                <h2 className="story-name">{story.name}</h2>
                <p className="story-subtitle">{story.subtitle}</p>
              </div>
              <img src={imgDivider} alt="" className="story-divider" />
              <div className="story-body">
                {story.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
