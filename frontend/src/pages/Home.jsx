import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Radio, ArrowRight, Trophy, Users, Zap, TrendingUp } from 'lucide-react';
import {
  getCompetitions,
  getMatchesToday,
  getMatchesTomorrow,
  getLiveMatches,
  getUpcomingMatches,
} from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import MatchCard from '../components/MatchCard';

function Home() {
  const { t } = useLanguage();
  const [competitions, setCompetitions] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [todayMatches, setTodayMatches] = useState([]);
  const [tomorrowMatches, setTomorrowMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [compRes, liveRes, todayRes, tomorrowRes, upcomingRes] =
          await Promise.all([
            getCompetitions(),
            getLiveMatches().catch(() => ({ data: [] })),
            getMatchesToday().catch(() => ({ data: [] })),
            getMatchesTomorrow().catch(() => ({ data: [] })),
            getUpcomingMatches(7).catch(() => ({ data: [] })),
          ]);

        setCompetitions(compRes.data || []);
        setLiveMatches(liveRes.data || []);
        setTodayMatches(todayRes.data || []);
        setTomorrowMatches(tomorrowRes.data || []);
        setUpcomingMatches(upcomingRes.data || []);
      } catch (err) {
        setError(t('error.server'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-ink-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      {/* Hero */}
      <header className="mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-900 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-4">
            <Zap size={12} className="fill-current" />
            <span>Live Data · 2026/27 Season</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-ink-900 dark:text-white mb-3 tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-lg text-ink-500 dark:text-ink-400">{t('home.subtitle')}</p>
        </div>
      </header>

      {/* Live */}
      {liveMatches.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            icon={<Radio size={18} className="text-red-500" />}
            title={t('home.liveMatches')}
            count={liveMatches.length}
            live
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((m) => <MatchCard key={m.id} match={m} showCompetition />)}
          </div>
        </section>
      )}

      {/* Today */}
      {todayMatches.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            icon={<Calendar size={18} className="text-brand-600" />}
            title={t('home.todayMatches')}
            count={todayMatches.length}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayMatches.map((m) => <MatchCard key={m.id} match={m} showCompetition />)}
          </div>
        </section>
      )}

      {/* Tomorrow */}
      {tomorrowMatches.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            icon={<Calendar size={18} className="text-brand-600" />}
            title={t('home.tomorrowMatches')}
            count={tomorrowMatches.length}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tomorrowMatches.map((m) => <MatchCard key={m.id} match={m} showCompetition />)}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcomingMatches.length > 0 && (
        <section className="mb-12">
          <SectionHeader
            icon={<TrendingUp size={18} className="text-accent-500" />}
            title={t('home.upcomingMatches')}
            count={upcomingMatches.length}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.slice(0, 6).map((m) => (
              <MatchCard key={m.id} match={m} showCompetition />
            ))}
          </div>
        </section>
      )}

      {/* Competitions */}
      <section>
        <SectionHeader
          icon={<Trophy size={18} className="text-amber-500" />}
          title={t('home.featuredCompetitions')}
          count={competitions.length}
          action={
            <Link to="/competitions" className="flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2 transition-all">
              {t('home.viewAll')}
              <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {competitions.slice(0, 8).map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ icon, title, count, action, live }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          live
            ? 'bg-red-50 dark:bg-red-950/50'
            : 'bg-ink-100 dark:bg-ink-800'
        }`}>
          {icon}
        </div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-white">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

function CompetitionCard({ competition }) {
  const code = competition.code || competition.id;
  const teamsCount = competition._count?.teams || 0;
  const matchesCount = competition._count?.matches || 0;

  return (
    <Link
      to={`/competitions/${code}`}
      className="group block bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-card hover:shadow-card-hover dark:shadow-dark-card dark:hover:shadow-dark-hover transition-all duration-200 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        {competition.emblem ? (
          <img
            src={competition.emblem}
            alt={competition.name}
            className="w-12 h-12 object-contain"
            onError={(e) => (e.target.style.display = 'none')}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-ink-100 dark:bg-ink-800 flex items-center justify-center">
            <Trophy size={20} className="text-ink-400" />
          </div>
        )}
        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 tracking-wider">
          {code}
        </span>
      </div>

      <h3 className="font-bold text-sm text-ink-900 dark:text-white mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {competition.name}
      </h3>

      <p className="text-xs text-ink-500 dark:text-ink-500 mb-3">
        {competition.country}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-ink-100 dark:border-ink-800">
        <div className="flex items-center gap-3 text-[11px] text-ink-500 dark:text-ink-500">
          <span className="flex items-center gap-1">
            <Users size={11} />
            {teamsCount}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp size={11} />
            {matchesCount}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-ink-700 dark:text-ink-300">
          {competition.currentSeason}
        </span>
      </div>
    </Link>
  );
}

export default Home;