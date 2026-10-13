import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Competitions from './pages/Competitions';
import CompetitionDetail from './pages/CompetitionDetail';
import TeamDetail from './pages/TeamDetail';
import MatchDetail from './pages/MatchDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/competitions/:id" element={<CompetitionDetail />} />
          <Route path="/teams/:id" element={<TeamDetail />} />
          <Route path="/matches/:id" element={<MatchDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;