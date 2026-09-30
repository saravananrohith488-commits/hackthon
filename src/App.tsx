import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { CommandCenter } from './pages/CommandCenter';
import { BhashaShieldPage } from './pages/BhashaShieldPage';
import { AttackDnaPage } from './pages/AttackDnaPage';
import { MutationTracePage } from './pages/MutationTracePage';
import { UrlIntelligencePage } from './pages/UrlIntelligencePage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { CampaignGraphPage } from './pages/CampaignGraphPage';
import { InvestigationWorkspace } from './pages/InvestigationWorkspace';
import { ForensicReportPage } from './pages/ForensicReportPage';
import { AttackHistoryPage } from './pages/AttackHistoryPage';
import { ChittiChatPage } from './pages/ChittiChatPage';
import SettingsPage from './pages/Settings';

export const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/chitti-ai" element={<ChittiChatPage />} />
          <Route path="/bhashashield" element={<BhashaShieldPage />} />
          <Route path="/attack-dna" element={<AttackDnaPage />} />
          <Route path="/mutation-trace" element={<MutationTracePage />} />
          <Route path="/url-intelligence" element={<UrlIntelligencePage />} />
          <Route path="/infrastructure" element={<InfrastructurePage />} />
          <Route path="/campaign-graph" element={<CampaignGraphPage />} />
          <Route path="/investigations" element={<InvestigationWorkspace />} />
          <Route path="/reports" element={<ForensicReportPage />} />
          <Route path="/attack-history" element={<AttackHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
