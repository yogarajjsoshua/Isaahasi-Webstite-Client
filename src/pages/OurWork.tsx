import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import imgRectangle77 from '../assets/images/our-work/hero-quote.jpg';
import imgImg57832 from '../assets/images/our-work/bridge-photo.png';
import imgRectangle102 from '../assets/images/our-work/education.jpg';
import imgRectangle105 from '../assets/images/our-work/health-1.jpg';
import imgRectangle106 from '../assets/images/our-work/health-2.jpg';
import imgRectangle108 from '../assets/images/our-work/employment-1.jpg';
import imgRectangle109 from '../assets/images/our-work/employment-2.jpg';
import imgRectangle107 from '../assets/images/our-work/community.jpg';
import imgStreamlineQualityEducation from '../assets/icons/our-work/quality-education.svg';
import imgFluentMdl2Health from '../assets/icons/our-work/health.svg';
import imgFluentPeopleCommunity32Regular from '../assets/icons/our-work/community.svg';
import imgBytesizeWork from '../assets/icons/our-work/work.svg';
import './OurWork.css';

const HEADER_OFFSET = 174;
const SCROLL_DURATION_MS = 1400;

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

let scrollAnimationFrame: number | null = null;

function smoothScrollTo(targetY: number, duration: number) {
  if (scrollAnimationFrame !== null) {
    cancelAnimationFrame(scrollAnimationFrame);
  }

  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime: number | null = null;

  function step(timestamp: number) {
    if (startTime === null) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    window.scrollTo({ top: startY + diff * easeInOutQuad(progress), left: 0, behavior: 'instant' });
    scrollAnimationFrame = progress < 1 ? requestAnimationFrame(step) : null;
  }

  scrollAnimationFrame = requestAnimationFrame(step);
}

const pillars = [
  {
    icon: imgStreamlineQualityEducation,
    title: 'Education',
    desc: 'Prepared for learning, job opportunities, and growth',
  },
  {
    icon: imgFluentMdl2Health,
    title: 'Health',
    desc: 'Healthy and resilient, with a renewed sense of purpose',
  },
  {
    icon: imgFluentPeopleCommunity32Regular,
    title: 'Community',
    desc: 'Supported through a community where they belong.',
  },
  {
    icon: imgBytesizeWork,
    title: 'Employment',
    desc: 'Equipped to make informed life choices and achieve financial independence.',
  },
];

export const OurWork: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      smoothScrollTo(targetY, SCROLL_DURATION_MS);
    }
  }, [location.hash]);

  return (
    <div className="our-work">
      {/* Hero Section */}
      <section className="our-work-hero">
        <div className="our-work-hero-quote">
          <p>"For every survivor of trafficking, being rescued is only the first step toward freedom"</p>
        </div>
        <div className="our-work-hero-image">
          <img alt="" src={imgRectangle77} />
        </div>
      </section>

      {/* Why Section */}
      <section id="our-work-why" className="our-work-why">
        <h2 className="our-work-section-title">Why iSAAHASI?</h2>
        <div className="our-work-why-body">
          <p>The lasting impact of exploitation runs deep. Having lost their childhoods, as well as opportunity to complete their basic education, many live with complex physical, psychological, and emotional health challenges that can significantly hinder their recovery and overall well-being.</p>
          <p>Years of trauma, isolation, and exploitation often leaves them with limited social and interpersonal skills, and a profound sense of disconnection and loneliness. In addition, many lack the vocational skills, work experience, and financial resources needed to rebuild lives. These barriers increase their vulnerability affecting self-worth, confidence, relationships, and the ability to imagine a different future.</p>
        </div>
      </section>

      {/* Bridge Section */}
      <section className="our-work-bridge">
        <div className="our-work-bridge-image">
          <img alt="" src={imgImg57832} />
        </div>
        <div className="our-work-bridge-content">
          <ul className="our-work-bridge-list">
            <li>
              <strong>iSaahasi bridges this gap</strong>
              {` - working alongside women survivors of human trafficking as they rebuild their lives with hope and dignity.`}
            </li>
            <li>
              <strong>Women step into a safe, non-residential space</strong>
              {` that is both structured and supportive. Here, each woman is celebrated for who she is today and who she is becoming.`}
            </li>
            <li>
              <strong>In a safe, supportive community</strong>
              {` women begin to heal and reclaim what was taken from them - trust, confidence, and a sense of possibility. We walk alongside each survivor - doing whatever it takes to support her journey forward.`}
            </li>
          </ul>
          <p className="our-work-bridge-intro">
            Our growth-focused program is built around four core pillars that provide a foundation through which survivors receive the well-rounded care they need to rebuild their lives and step into the futures they deserve.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section id="our-work-what" className="our-work-what">
        <h2 className="our-work-section-title">What We Do?</h2>
        <p className="our-work-what-body">
          {`Our growth-focused program is built around four core pillars of EDUCATION- HEALTH- COMMUNITY - EMPLOYMENT provides a foundation to grow in capacity, strength, confidence, and security.  `}
        </p>

        <div className="pillars-grid">
          {pillars.map((pillar) => (
            <div className="pillar-card" key={pillar.title}>
              <img alt="" className="pillar-card-icon" src={pillar.icon} />
              <p className="pillar-card-title">{pillar.title}</p>
              <p className="pillar-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Detail */}
      <section className="pillar-detail">
        <h3 className="pillar-detail-title">Education</h3>
        <div className="pillar-detail-row pillar-detail-row--reverse">
          <div className="pillar-detail-images pillar-detail-images--single">
            <img alt="" src={imgRectangle102} />
          </div>
          <div className="pillar-detail-text">
            <p>{`Education is essential for survivors of human trafficking to prevent re-victimization and rebuild their lives. `}</p>
            <p>{`The iSaahasi education programme therefore focuses on strengthening the knowledge, skills, and confidence of the women so that they grow into capable individuals who can make informed decisions and pursue education, vocational training, and professional opportunities, `}</p>
            <p>{` This is achieved through structured need-based teaching sessions, personalized guidance, and meaningful exposure, extracurricular activities, including educational field visits and cultural events, to enhance learning and personal development. `}</p>
          </div>
        </div>
      </section>

      {/* Health Detail */}
      <section className="pillar-detail pillar-detail--beige">
        <h3 className="pillar-detail-title">Health</h3>
        <div className="pillar-detail-row">
          <div className="pillar-detail-images">
            <img alt="" src={imgRectangle105} />
            <img alt="" src={imgRectangle106} />
          </div>
        </div>
        <div className="pillar-detail-text pillar-detail-text--full">
          <p>Survivors of human trafficking and abuse often face complex physical, psychological, and emotional health challenges that can hinder their recovery and well-being. Access to comprehensive, trauma-informed healthcare is essential for healing, addressing the lasting effects of trauma, and restoring a sense of safety, dignity, and personal agency.</p>
          <p>{`The iSaahasi Healthcare Initiative aims to promote physical fitness, mental wellness, emotional resilience, and healthy lifestyle practices so that the women Grow into strong, resilient, and self-aware individuals. `}</p>
          <p>Besides comprehensive medical assessments, timely medical care, fitness sessions, health and hygiene awareness, nutrition education, counselling, the programme equips participants with the knowledge, skills, and support needed to make informed choices about their well-being and lead healthier, more independent lives.</p>
        </div>
      </section>

      {/* Community Detail */}
      <section className="pillar-detail">
        <h3 className="pillar-detail-title">Community</h3>
        <div className="pillar-detail-row pillar-detail-row--reverse">
          <div className="pillar-detail-images pillar-detail-images--single">
            <img alt="" src={imgRectangle107} />
          </div>
          <div className="pillar-detail-text">
            <p>{`Many of the women rescued from trafficking have experienced prolonged trauma, isolation, and exploitation, leaving them with limited social and interpersonal skills, little or no knowledge of their families' whereabouts, and a deep sense of disconnection and isolation. `}</p>
            <p>The iSaahasi programme aims to build that community and provides a safe, supportive environment where participants rebuild trust, confidence, and meaningful connections which creates a foundation for lasting personal development and grow into confident and connected individuals.</p>
            <p>Through interpersonal and communication skills coaching, safe residential care in the initial phase, social events, personal development sessions, and life skills training. Participants develop improved communication, problem-solving, critical thinking, and conflict resolution skills while building healthy relationships and supportive networks. As their confidence and sense of belonging grow, they become better equipped to live independently, make informed decisions, and contribute positively to their communities.</p>
          </div>
        </div>
      </section>

      {/* Employment Detail */}
      <section className="pillar-detail pillar-detail--beige">
        <h3 className="pillar-detail-title">Employment</h3>
        <div className="pillar-detail-row">
          <div className="pillar-detail-images">
            <img alt="" src={imgRectangle108} />
            <img alt="" src={imgRectangle109} />
          </div>
        </div>
        <div className="pillar-detail-text pillar-detail-text--full">
          <p>{`Many women rescued from trafficking lack the skills, work experience, and financial resources needed to rebuild their lives, leaving them vulnerable to continued dependence and exploitation. `}</p>
          <p>{`The Employment component of iSaahasi's program aims to grow the participants into secure and independent individuals and therefore addresses this by equipping participants with practical skills, workplace experience, and financial knowledge to achieve long-term independence `}</p>
          <p>Through on-the-job training and internships, women develop professional competencies, employment readiness, and essential life skills. Financial literacy sessions on budgeting, saving, and money management are reinforced through a monthly stipend and matched savings scheme that encourage positive financial habits. Together, these interventions prepare participants for sustainable livelihoods by strengthening workplace behaviours, improving decision-making, building financial confidence, and enabling them to secure employment, generate stable incomes, and build safe, self-reliant futures.</p>
        </div>
      </section>
    </div>
  );
};
