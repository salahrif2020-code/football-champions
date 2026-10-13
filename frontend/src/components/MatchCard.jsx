import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, Radio, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

function MatchCard({ match, showCompetition = false }) {
  const { t, language } = useLanguage();
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE';
  const isScheduled = match.status === 'SCHEDULED';

  return (
    <Link
      to={`/matches/${match.id}`}
      className="group block bg-white dark:bg-ink-900 rounded-xl border border-ink-200/60 dark:border-ink-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-card hover:shadow-card-hover dark:shadow-dark-card dark:hover:shadow-dark-hover transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
        <div className="flex items-center gap-2 min-w-0">
          {showCompetition && match.competition && (
            <>
              {match.competition.emblem && (
                <img
                  src={match.competition.emblem}
                  alt={match.competition.name}
                  className="w-4 h-4 object-contain flex-shrink-0"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              )}
              <span className="text-xs font-semibold text-ink-600 dark:text-ink-400 truncate">
                {match.competition.name}
              </span>
            </>
          )}
        </div>
        <span className="text-xs font-medium text-ink-500 dark:text-ink-500 whitespace-nowrap ms-2">
          {formatDate(match.matchDate, language)}
        </span>
      </div>

      {/* Teams */}
      <div className="px-4 py-3 space-y-2.5">
        <TeamRow team={match.homeTeam} score={match.homeScore} showScore={isFinished || isLive} isLive={isLive} />
        <TeamRow team={match.awayTeam} score={match.awayScore} showScore={isFinished || isLive} isLive={isLive} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-ink-100 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-950/50">
        <StatusBadge status={match.status} t={t} />
        {match.matchday && (
          <span className="flex items-center gap-1 text-xs font-medium text-ink-500 dark:text-ink-500">
            <Calendar size={12} />
            <span>J{match.matchday}</span>
          </span>
        )}
      </div>
    </Link>
  );
}

function TeamRow({ team, score, showScore, isLive }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {team.crest ? (
          <img
            src={team.crest}
            alt={team.name}
            className="w-6 h-6 object-contain flex-shrink-0"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-6 h-6 rounded-md bg-gradient-to-br from-brand-600 to-brand-800 items-center justify-center text-white text-[10px] font-bold flex-shrink-0 ${
            team.crest ? 'hidden' : 'flex'
          }`}
        >
          {team.tla?.substring(0, 2) || team.shortName?.substring(0, 2) || '??'}
        </div>
        <span className="text-sm font-medium text-ink-800 dark:text-ink-200 truncate">
          {team.shortName || team.name}
        </span>
      </div>
      {showScore && (
        <span
          className={`text-base font-bold tabular-nums min-w-[1.25rem] text-center ${
            isLive ? 'text-red-500' : 'text-ink-900 dark:text-white'
          }`}
        >
          {score ?? 0}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status, t }) {
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold';

  if (status === 'LIVE') {
    return (
      <span className={`${base} bg-red-500 text-white`}>
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        LIVE
      </span>
    );
  }

  if (status === 'FINISHED') {
    return (
      <span className={`${base} bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-400`}>
        <CheckCircle2 size={11} />
        {t('match.finished')}
      </span>
    );
  }

  return (
    <span className={`${base} bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400`}>
      <Clock size={11} />
      {t('match.scheduled')}
    </span>
  );
}

function formatDate(dateStr, language) {
  const date = new Date(dateStr);
  const locale = language === 'ar' ? 'ar-EG' : 'fr-FR';
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default MatchCard;