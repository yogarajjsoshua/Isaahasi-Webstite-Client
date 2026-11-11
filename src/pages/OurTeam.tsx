import React from 'react';
import './OurTeam.css';
import teamHeroImage from '../assets/images/team/hero.webp';
import photoKavi from '../assets/images/team/photo-kavi.webp';
import photoRenjanKoshy from '../assets/images/team/photo-renjan-koshy.webp';
import photoKoshy from '../assets/images/team/photo-koshy.webp';
import photoVeena from '../assets/images/team/photo-veena.webp';
import photoSonal from '../assets/images/team/photo-sonal.webp';
import photoAtiya from '../assets/images/team/photo-atiya.webp';
import frameBoard from '../assets/images/team/frame-board.svg';
import frameVeena from '../assets/images/team/frame-veena.svg';
import frameSonal from '../assets/images/team/frame-sonal.svg';
import frameAtiya from '../assets/images/team/frame-atiya.svg';

interface TeamMember {
  name: string;
  title?: string;
  bio: string;
  photo: string;
  frame: string;
}

export const OurTeam: React.FC = () => {
  const boardMembers: TeamMember[] = [
    {
      name: "Kaveendran Balasubramaniam",
      title: "",
      bio: `Kaveendran (Kavi) Balasubramaniam is an educator, researcher, and academic with over 15 years of experience in higher education, research, and cross-cultural engagement. He currently serves as an Associate Professor of Mechanical and Materials Engineering, teaching undergraduate and master's students from around the world while leading funded research and industry collaborations. His experience spans mentoring, strategic planning, and working with multinational teams, bringing a collaborative and strategic approach to leadership.

From a young age, Kavi has had a heart for serving people on the margins of society. Moved by compassion and a deep belief that every human being has inherent worth, he has sought opportunities to walk alongside others and become involved in initiatives that bring hope to vulnerable communities. He is passionate about supporting work that restores hope, upholds human dignity, and empowers individuals and families to flourish.`,
      photo: photoKavi,
      frame: frameBoard
    },
    {
      name: "Mr. Renjan Oommen",
      title: "",
      bio: `Renjan is a retired Naval Officer and former procurement leader at Maersk and has  had over 24 years of rich and diverse experience in the area of Leadership, Procurement, Consulting, Armed forces and Social sector covering Defence, Shipping and Life sciences Industries. He has delivered strong results by leading teams, projects, and categories across a diverse spectrum of industries bringing significant business value, effectiveness, and impact at both strategic and tactical levels. Alongside his corporate and social sector engagement, he has been in pastoral care for the last 12 years building and empowering people at a different realm.`,
      photo: photoRenjanKoshy,
      frame: frameBoard
    },
    {
      name: "Dr. Koshy C. George",
      title: "Medical Superintendent, Kotagiri Medical Fellowship Hospital, Kotagiri",
      bio: `Dr. Koshy C. George is a pediatrician and the Medical Superintendent of Kotagiri Medical Fellowship Hospital, Kotagiri, Tamil Nadu.

He completed his schooling in Tiruchirappalli before pursuing his undergraduate and postgraduate medical education at the prestigious Christian Medical College, Vellore. An accomplished student, he was recognized as the Best Outgoing Student in MD Pediatrics and awarded the Gold Medal for academic excellence.

Driven by a deep commitment to serving underserved communities, Dr. George has worked extensively across northern and northeastern India, particularly among economically and socially disadvantaged populations. His work has addressed a wide range of public health and social challenges, including childhood malnutrition, human trafficking, disease prevention, disability prevention, and rehabilitation.

He continues to bring his clinical expertise and experience in community healthcare to the Nilgiris, with a particular interest in improving access to quality healthcare for vulnerable and marginalized populations.

Having received specialized training in palliative care, Dr. George, together with his wife, Dr. Miriam, is actively involved in caring for individuals and families facing life-limiting illnesses in the Nilgiris. Their work reflects a shared commitment to compassionate, holistic, and dignified care.

Dr. George and Dr. Miriam have two sons, both of whom study at Riverside Public School in Kotagiri.

His professional journey reflects a commitment to clinical excellence, community service, and the belief that quality healthcare should be accessible to all, especially those most in need.`,
      photo: photoKoshy,
      frame: frameBoard
    }
  ];

  const staffMembers: TeamMember[] = [
    {
      name: "Veena Rodrigues",
      title: "Programme Manager",
      bio: `Veena Rodrigues is the Program Manager at iSaahasi Academy India Foundation, where she is passionate about empowering women to rebuild their lives through education, life skills, and sustainable livelihood opportunities. She holds a Master's degree in Commerce (M.Com.) and is PMP® certified. With over nine years of experience across the corporate and social development sectors, Veena has built expertise in program management, stakeholder engagement, monitoring and evaluation, and process improvement. She believes in creating safe, supportive spaces where every woman can discover her strengths, build confidence, and move towards a future of independence and dignity. Through compassionate leadership and collaborative partnerships, she is committed to creating meaningful and lasting social impact.`,
      photo: photoVeena,
      frame: frameVeena
    },
    {
      name: "Sonal Pandya",
      title: "Finance & Admin",
      bio: `I have been with I-Sanctuary for 4 and half years, as an Finance & Administrative Coordinator. My professional background includes serving as an Account and Audit Assistant at a Chartered Accountancy firm, (CA)  alongside extensive experience lecturing for professional courses like CA, Company Secretary , and Masters in Business Administration.  With a passion for numbers and helping others grow, I blend financial expertise with a dedication to the iSanctuary mission.`,
      photo: photoSonal,
      frame: frameSonal
    },
    {
      name: "Atiya Rawat",
      title: "Educator",
      bio: ` A social changemaker and educator with nearly a decade of experience empowering marginalized communities through education. A Teach For India Fellow and curriculum designer, she specializes in creating transformative learning experiences for underserved youth, combining innovation with compassion to drive lasting impact. As an educator with Isaahasi Academy India Foundation, she thrives in a collaborative environment where the work is deeply meaningful.`,
      photo: photoAtiya,
      frame: frameAtiya
    }
  ];

  return (
    <div className="our-team-page">
      {/* Hero Section */}
      <section className="team-hero">
        <img src={teamHeroImage} alt="Our Team" className="team-hero-image" />
      </section>

      {/* Board of Directors Section */}
      <h1 className="team-page-title">The board of directors</h1>
      <div className="section-divider" />

      {boardMembers.map((member, index) => (
        <React.Fragment key={`board-${index}`}>
          <div className="team-member">
            <div className="team-member-image-container">
              <img src={member.frame} alt="" className="team-member-frame" />
              <img src={member.photo} alt={member.name} className="team-member-photo" />
            </div>
            <div className="team-member-content">
              <h2 className="team-member-name">{member.name}</h2>
              {member.title && <p className="team-member-title">{member.title}</p>}
              <p className="team-member-bio">{member.bio}</p>
            </div>
          </div>
          {index < boardMembers.length - 1 && <div className="section-divider" />}
        </React.Fragment>
      ))}

      {/* Staff Section */}
      <h2 className="staff-section-title">The Staff</h2>
      <div className="section-divider" />

      {staffMembers.map((member, index) => (
        <React.Fragment key={`staff-${index}`}>
          <div className="team-member">
            <div className="team-member-image-container">
              <img src={member.frame} alt="" className="team-member-frame" />
              <img src={member.photo} alt={member.name} className="team-member-photo" />
            </div>
            <div className="team-member-content">
              <h3 className="team-member-name">
                {member.name}
                {member.title && <span className="team-member-title">: {member.title}</span>}
              </h3>
              <p className="team-member-bio">{member.bio}</p>
            </div>
          </div>
          {index < staffMembers.length - 1 && <div className="section-divider" />}
        </React.Fragment>
      ))}
    </div>
  );
};
