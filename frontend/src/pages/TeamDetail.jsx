import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Globe, Building2, Users, TrendingUp, ExternalLink } from 'lucide-react';
import { getTeamById, getMatchesByTeam } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import MatchCard from '../components/MatchCard';

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all | finished | scheduled

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [teamRes, matchesRes] = await Promise.all([
          getTeamById(id),
          getMatchesByTeam(id),
        ]);
        setTeam(teamRes.data);
        setMatches(matchesRes.data || []);
      } catch (err) {
        setError(t('error.team'));
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

  const filtered = matches.filter((m) => {
    if (filter === 'finished') return m.status === 'FINISHED';
    if (filter === 'scheduled') return m.status === 'SCHEDULED';
    return true;
  });

  const finishedCount = matches.filter((m) => m.status === 'FINISHED').length;
  const scheduledCount = matches.filter((m) => m.status === 'SCHEDULED').length;

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-ink-600 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft size={16} />
        {t('common.back')}
      </button>

      {/* Hero */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/60 dark:border-ink-800 shadow-card dark:shadow-dark-card overflow-hidden mb-6">
        <div className="relative bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950 p-8 md:p-10 text-white">
          <div className="absolute inset-0 opacity-5">
            <Users className="absolute top-8 right-8 w-48 h-48" />
          </div>
          <div className="relative flex items-center gap-6 flex-wrap">
            {team.crest ? (
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center justify-center p-4">
                <img
                  src={team.crest}
                  alt={team.name}
                  className="w-full h-full object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white/10 backdrop-blur rounded-2xl border border-white/20 flex items-center justify-center text-3xl font-black">
                {team.tla?.substring(0, 2) || '??'}
              </div>
            )}
            <div className="flex-1 min-w-[250px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                {team.tla || '—'}
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
                {team.name}
              </h1>
              {team.competition && (
                <Link
                  to={`/competitions/${team.competition.code || team.competition.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-brand-100 hover:text-white transition-colors"
                >
                  <span>{team.competition.name}</span>
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink-100 dark:divide-ink-800 border-t border-ink-100 dark:border-ink-800">
          <StatBox icon={<Globe size={16} />} label={t('team.country')} value={team.country} />
          <StatBox icon={<MapPin size={16} />} label={t('team.stadium')} value={team.venue || team.stadium} />
          <StatBox icon={<Building2 size={16} />} label={t('team.city')} value={team.clubColors || '—'} />
          <StatBox icon={<Calendar size={16} />} label={t('team.founded')} value={team.founded} />
        </div>
      </div>

      {/* Info Bar */}
      {(team.website || team.clubColors) && (
        <div className="flex items-center gap-4 flex-wrap mb-6 text-sm">
          {team.website && (
            <a
              href={team.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ExternalLink size={14} />
              {t('team.website')}
            </a>
          )}
          {team.clubColors && (
            <span className="text-ink-500 dark:text-ink-500">
              {t('team.clubColors')}: <span className="font-medium text-ink-700 dark:text-ink-300">{team.clubColors}</span>
            </span>
          )}
        </div>
      )}

      {/* Matches */}
      <section>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
              <TrendingUp size={16} className="text-ink-600 dark:text-ink-400" />
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-white">
              {t('team.matches')}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400">
              {matches.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
              {t('common.all')} ({matches.length})
            </FilterButton>
            <FilterButton active={filter === 'finished'} onClick={() => setFilter('finished')}>
              {t('match.finished')} ({finishedCount})
            </FilterButton>
            <FilterButton active={filter === 'scheduled'} onClick={() => setFilter('scheduled')}>
              {t('match.scheduled')} ({scheduledCount})
            </FilterButton>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 p-12 text-center">
            <p className="text-ink-500 dark:text-ink-400">{t('team.noMatches')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((match) => (
              <MatchCard key={match.id} match={match} showCompetition />
            ))}
          </div>
        )}
      </section>
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
      <p className="text-sm md:text-base font-bold text-ink-900 dark:text-white truncate">
        {value || '—'}
      </p>
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-brand-600 text-white'
          : 'bg-white dark:bg-ink-900 text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 border border-ink-200/60 dark:border-ink-800'
      }`}
    >
      {children}
    </button>
  );
}

export default TeamDetail;