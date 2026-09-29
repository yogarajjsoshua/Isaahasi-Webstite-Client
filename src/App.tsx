import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage } from './pages/HomePage';
import { OurStoryPage } from './pages/OurStoryPage';
import { OurTeam } from './pages/OurTeam';
import { HerStory } from './pages/HerStory';
import { OurWork } from './pages/OurWork';
import { VisionPage } from './pages/VisionPage';
import { UpdatesPage } from './pages/UpdatesPage';
import { PartnerPage } from './pages/PartnerPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import './styles/globals.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="our-story" element={<OurStoryPage />} />
          <Route path="our-team" element={<OurTeam />} />
          <Route path="her-story" element={<HerStory />} />
          <Route path="our-work" element={<OurWork />} />
          <Route path="vision" element={<VisionPage />} />
          <Route path="updates" element={<UpdatesPage />} />
          <Route path="partner" element={<PartnerPage />} />
          <Route path="volunteer" element={<VolunteerPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
