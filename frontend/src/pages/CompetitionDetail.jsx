import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users, Calendar, Globe, TrendingUp, MapPin } from 'lucide-react';
import { getCompetitionByCode, getTeamsByCompetition, getMatchesByCompetition } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import MatchCard from '../components/MatchCard';

function CompetitionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [competition, setCompetition] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('matches'); // matches | teams

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [compRes, teamsRes, matchesRes] = await Promise.all([
          getCompetitionByCode(id),
          getTeamsByCompetition(id),
          getMatchesByCompetition(id, { limit: 100 }),
        ]);
        setCompetition(compRes.data);
        setTeams(teamsRes.data || []);
        setMatches(matchesRes.data || []);
      } catch (err) {
        setError(t('error.competition'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-8">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            {t('common.backHome')}
          </Link>
        </div>
      </div>
    );
  }

  const code = competition.code || competition.id;

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-ink-600 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('common.back')}
      </button>

      {/* Hero Card */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/60 dark:border-ink-800 shadow-card dark:shadow-dark-card overflow-hidden mb-6">
        <div className="relative bg-gradient-to-br from-brand-700 via-brand-800 to-ink-900 p-8 md:p-10 text-white">
          <div className="absolute inset-0 opacity-5">
            <Trophy className="absolute top-8 right-8 w-48 h-48" />
          </div>
          <div className="relative flex items-center gap-6 flex-wrap">
            {competition.emblem ? (
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center justify-center p-4">
                <img
                  src={competition.emblem}
                  alt={competition.name}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center justify-center">
                <Trophy size={48} />
              </div>
            )}
            <div className="flex-1 min-w-[250px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                {code}
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">
                {competition.name}
              </h1>
              <p className="text-brand-100 text-sm font-medium">
                {competition.type === 'CUP'
                  ? t('competition.continentalCup')
                  : t('competition.localLeague')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink-100 dark:divide-ink-800 border-t border-ink-100 dark:border-ink-800">
          <StatBox
            icon={<Globe size={16} />}
            label={t('competition.country')}
            value={competition.country}
          />
          <StatBox
            icon={<Calendar size={16} />}
            label={t('competition.season')}
            value={competition.currentSeason || '—'}
          />
          <StatBox
            icon={<Users size={16} />}
            label={t('competition.teams')}
            value={teams.length}
          />
          <StatBox
            icon={<TrendingUp size={16} />}
            label={t('competition.matches')}
            value={matches.length}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-ink-200/60 dark:border-ink-800">
        <TabButton active={tab === 'matches'} onClick={() => setTab('matches')}>
          {t('competition.matches')} ({matches.length})
        </TabButton>
        <TabButton active={tab === 'teams'} onClick={() => setTab('teams')}>
          {t('competition.teams')} ({teams.length})
        </TabButton>
      </div>

      {/* Content */}
      {tab === 'matches' && (
        <>
          {matches.length === 0 ? (
            <EmptyState message={t('competition.noMatches')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'teams' && (
        <>
          {teams.length === 0 ? (
            <EmptyState message={t('competition.noTeams')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="p-4 md:p-5">
      <div className="flex items-center gap-2 text-ink-500 dark:text-ink-500 text-xs font-medium mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base md:text-lg font-bold text-ink-900 dark:text-white truncate">
        {value || '—'}
      </p>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
        active
          ? 'border-brand-600 text-brand-600 dark:text-brand-400'
          : 'border-transparent text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function TeamCard({ team }) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="group block bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-card hover:shadow-card-hover dark:shadow-dark-card dark:hover:shadow-dark-hover transition-all duration-200 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        {team.crest ? (
          <img
            src={team.crest}
            alt={team.name}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 items-center justify-center text-white text-sm font-bold ${
            team.crest ? 'hidden' : 'flex'
          }`}
        >
          {team.tla?.substring(0, 2) || '??'}
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 tracking-wider">
          {team.tla || '—'}
        </span>
      </div>
      <h3 className="font-bold text-sm text-ink-900 dark:text-white mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {team.name}
      </h3>
      {team.venue && (
        <p className="text-xs text-ink-500 dark:text-ink-500 flex items-center gap-1.5 truncate">
          <MapPin size={11} />
          <span className="truncate">{team.venue}</span>
        </p>
      )}
    </Link>
  );
}

function EmptyState({ message }) {
  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
        <Trophy size={24} className="text-ink-400" />
      </div>
      <p className="text-ink-500 dark:text-ink-400">{message}</p>
    </div>
  );
}

export default CompetitionDetail;