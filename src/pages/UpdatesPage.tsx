import React from 'react';
import womensDay from '../assets/images/updates/womens-day.jpg';
import environmentDay from '../assets/images/updates/environment-day.jpg';
import walkForFreedom from '../assets/images/updates/walk-for-freedom.jpg';
import './UpdatesPage.css';

const freedomQuotes = [
  { name: 'Disha', quote: 'Felt good that we are part of the movement creating awareness about human trafficking' },
  { name: 'Bhumi', quote: 'I felt peaceful as I walked, with the thought that even a simple act like this can create imopact.' },
  { name: 'Rachna', quote: 'We got our rights, now we need to help others to get their rights!' },
  { name: 'Ahana', quote: 'Felt good supporting others, when walking silently on the road with the placard. People were noticing. Felt good that we were creating awareness' },
  { name: 'Diana', quote: 'It made me feel empathetic' },
  { name: 'Soni', quote: 'Felt good to see parents explaining their kids about the movement' },
];

export const UpdatesPage: React.FC = () => {
  return (
    <div className="updates-page">
      <section className="updates-hero">
        <h1 className="updates-title">Updates</h1>
      </section>

      <div className="updates-grid">
        {/* Women's Day Celebration */}
        <article className="update-card">
          <div className="update-image">
            <img src={womensDay} alt="Women's Day Celebration 2026" />
          </div>
          <div className="update-content">
            <h2 className="update-card-title">women's Day Celebration</h2>
            <p className="update-date">6th March 2026</p>
            <hr className="update-divider" />
            <div className="update-description">
              <p>
                In celebration of International Women's Day, a special program was organized on 6th March 2026 around the theme "
                <strong>Give to Gain."</strong> This year's theme highlighted the importance of collective support, mentorship, and sharing of resources to accelerate gender equality.
              </p>
              <p>The celebration brought out this theme through various activities that filled the day. It was vibrant, interactive, and filled with moments of appreciation and encouragement. The program was hosted by two participants who led the day with confidence and enthusiasm, keeping the group engaged and energized throughout the event.</p>
              <p>The day began with a lively icebreaker game where participants had to balance themselves on a small piece of newspaper whenever the music stopped. This fun activity created an atmosphere of laughter and camaraderie, helping everyone relax and connect with each other.</p>
              <p>Distribution of report cards, based on their annual assessments was what followed. Most were surprised at how well they had performed.</p>
              <p>This was followed by a unique recognition activity in which each participant was presented with a badge carrying an adjective that described their strengths and positive qualities. The activity proved to be a meaningful and encouraging gesture, helping participants feel seen, valued, and appreciated for who they are.</p>
              <p><strong><em>One of the participants then performed a dance(mime) based on a song …….</em></strong></p>
              <p>Another highlight of the celebration was the Appreciation Card activity. Cards displaying individual photographs were placed for everyone to write one word of appreciation. Participants eagerly read the messages written about them, and the room was filled with smiles as they discovered how others perceived and valued them. It was truly a heartwarming moment that strengthened bonds within the group.</p>
              <p>During the event, four participants were specially recognized for their growth and achievements over the year and were awarded certificates of appreciation. This recognition not only boosted their confidence but also inspired others to continue working towards personal development and excellence.</p>
              <p><strong><em>3 participates then gave a speech.</em></strong></p>
              <p>The celebration continued with more games that brought out a lively and friendly competitive spirit among the participants. The activities kept the energy high and ensured that everyone was actively involved throughout the day.</p>
              <p>A delicious lunch featuring Hyderabadi biryani was enjoyed by all, providing a wonderful opportunity for participants to relax, interact, and celebrate together.</p>
              <p>The day concluded with the screening of the movie Control, which explores the potential dangers and ethical concerns surrounding artificial intelligence. The film encouraged participants to reflect on the growing influence of technology in our lives and the importance of awareness in the digital age.</p>
              <p>
                The celebration was more than just a day of activities—it was a reminder of the power of encouragement, recognition, and community. By appreciating each other's strengths, celebrating growth, and sharing moments of joy, the participants truly embodied the spirit of "Give to Gain." {' '}
                <strong><em>The event left everyone feeling inspired, valued, and motivated to continue supporting one another, reinforcing the belief that when women uplift each other, the entire community grows stronger.</em></strong>
              </p>
            </div>
          </div>
        </article>

        {/* Walk for Freedom 2026 */}
        <article className="update-card">
          <div className="update-image">
            <img src={walkForFreedom} alt="Walk for Freedom 2026" />
          </div>
          <div className="update-content">
            <h2 className="update-card-title">Walk for Freedom 2026 - Standing Together Against Human Trafficking</h2>
            <hr className="update-divider" />
            <div className="update-description">
              <p>
                <strong>The Walk for Freedom is an annual silent global march dedicated to raising awareness about human trafficking and modern slavery.</strong> In Mumbai, the event was hosted by The Movement India, bringing together individuals and organizations committed to advocating for freedom and justice.
              </p>
              <p>Participants dressed in black and walked in single file, symbolizing the countless individuals who have been trafficked or remain at risk of exploitation—those whose voices often go unheard. Each participant carried a placard bearing messages that highlighted the realities of human trafficking and encouraged the public to become more aware of its devastating impact.</p>
              <p>The march witnessed the participation of college students, representatives from NGOs, legal professionals, and leaders from various sectors of society. United by a shared commitment, they came together to raise awareness, demonstrate solidarity with survivors, and pledge that they would not allow human trafficking to go unnoticed or unchallenged in their generation.</p>
              <p>Our participants, along with the staff team, enthusiastically joined this meaningful initiative. Their day began early, travelling by local train at 5:30 a.m., long before sunrise, to reach the venue on time. Despite the early start, everyone remained energetic and committed to the cause. Throughout the silent march, they carried awareness placards with pride, ensuring that pedestrians and motorists alike had the opportunity to read the messages and reflect on the urgent need to end human trafficking. Their participation was a powerful reminder that even in silence, a united community can speak volumes for those who cannot.</p>
              <p>The Walk for Freedom reminds us that change begins when ordinary people choose not to remain silent. Together, we can shine a light on the reality of human trafficking, stand alongside survivors, and work towards a future where exploitation has no place in our communities.</p>
              <p><strong>Here's what some of them had to say about the event.</strong></p>
              <ul className="update-quote-list">
                {freedomQuotes.map(({ name, quote }) => (
                  <li key={name}>
                    <strong>{name}</strong> — "{quote}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Environment Day */}
        <article className="update-card">
          <div className="update-image">
            <img src={environmentDay} alt="Environment Day 2026" />
          </div>
          <div className="update-content">
            <h2 className="update-card-title">Environment Day</h2>
            <p className="update-date">5th June 2026</p>
            <hr className="update-divider" />
            <div className="update-description">
              <p><strong>Theme - Inspired by Nature. For Climate. For Our Future</strong></p>
              <p>At iSaahasi, we observed World Environment Day 2026 on the 8th of June, with enthusiasm and a shared commitment to protecting our planet.</p>
              <p>The day served as an opportunity to raise awareness about environmental conservation and encourage sustainable practices within our community. Our women researched and presented on topics of their choice from a list provided. For many of them concepts such as the ozone layer, the greenhouse effect, and the environmental impact of technology were new, making the activity both educational and engaging. Everyone was reminded that even small, consistent actions can make a significant difference in preserving the environment for future generations.</p>
              <p>To bring their learning into action, the women created plant pots using recycled bottles and other waste materials before planting seeds in them. Watching the seeds begin to sprout was an exciting and rewarding experience, and planting in recycled planters became a meaningful symbol of their commitment to caring for the environment.</p>
              <p>The celebration inspired participants to become more conscious of their daily choices and their impact on the Earth. World Environment Day reinforced our collective responsibility to care for nature and strengthened our resolve to contribute towards a cleaner, greener, and more sustainable future for all.</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
