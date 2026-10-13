import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Target, ExternalLink } from 'lucide-react';
import { getMatchById } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

function MatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getMatchById(id);
        setMatch(result.data);
      } catch (err) {
        setError(t('error.match'));
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

  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE';

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

      {/* Match Card */}
      <div className="bg-white dark:bg-ink-900 rounded-2xl border border-ink-200/60 dark:border-ink-800 shadow-card dark:shadow-dark-card overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950 p-6 md:p-8 text-white">
          {isLive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 animate-pulse" />
          )}

          {match.competition && (
            <Link
              to={`/competitions/${match.competition.code || match.competition.id}`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-bold mb-6 hover:bg-white/20 transition-colors"
            >
              {match.competition.emblem && (
                <img
                  src={match.competition.emblem}
                  alt=""
                  className="w-4 h-4 object-contain"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <span>{match.competition.name}</span>
              <ExternalLink size={10} />
            </Link>
          )}

          {/* Teams & Score */}
          <div className="grid grid-cols-3 gap-4 items-center mt-4">
            {/* Home Team */}
            <Link to={`/teams/${match.homeTeam.id}`} className="text-center group">
              {match.homeTeam.crest ? (
                <img
                  src={match.homeTeam.crest}
                  alt={match.homeTeam.name}
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-xl font-black">
                  {match.homeTeam.tla?.substring(0, 2) || '??'}
                </div>
              )}
              <p className="text-sm md:text-base font-bold group-hover:text-accent-400 transition-colors line-clamp-2">
                {match.homeTeam.name}
              </p>
            </Link>

            {/* Score */}
            <div className="text-center">
              {(isFinished || isLive) ? (
                <div>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className={`text-4xl md:text-6xl font-black tabular-nums ${isLive ? 'text-red-400' : ''}`}>
                      {match.homeScore ?? 0}
                    </span>
                    <span className="text-2xl md:text-3xl font-light opacity-40">—</span>
                    <span className={`text-4xl md:text-6xl font-black tabular-nums ${isLive ? 'text-red-400' : ''}`}>
                      {match.awayScore ?? 0}
                    </span>
                  </div>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                      {t('match.finished')}
                    </span>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-2xl md:text-4xl font-black mb-2 tabular-nums">
                    {formatTime(match.matchDate, language)}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                    {t('match.scheduled')}
                  </span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <Link to={`/teams/${match.awayTeam.id}`} className="text-center group">
              {match.awayTeam.crest ? (
                <img
                  src={match.awayTeam.crest}
                  alt={match.awayTeam.name}
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 object-contain group-hover:scale-110 transition-transform"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-xl font-black">
                  {match.awayTeam.tla?.substring(0, 2) || '??'}
                </div>
              )}
              <p className="text-sm md:text-base font-bold group-hover:text-accent-400 transition-colors line-clamp-2">
                {match.awayTeam.name}
              </p>
            </Link>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink-100 dark:divide-ink-800">
          <DetailBox
            icon={<Calendar size={16} />}
            label={t('match.date')}
            value={formatDate(match.matchDate, language)}
          />
          <DetailBox
            icon={<MapPin size={16} />}
            label={t('match.stadium')}
            value={match.stadium}
          />
          <DetailBox
            icon={<Target size={16} />}
            label={t('match.matchday')}
            value={match.matchday ? `${t('match.matchday')} ${match.matchday}` : '—'}
          />
        </div>
      </div>
    </div>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="p-5 text-center">
      <div className="inline-flex items-center gap-2 text-ink-500 dark:text-ink-500 text-xs font-medium mb-1.5">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-sm md:text-base font-bold text-ink-900 dark:text-white">{value || '—'}</p>
    </div>
  );
}

function formatDate(dateStr, language) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const locale = language === 'ar' ? 'ar-MA' : 'fr-FR';
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(dateStr, language) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const locale = language === 'ar' ? 'ar-MA' : 'fr-FR';
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default MatchDetail;