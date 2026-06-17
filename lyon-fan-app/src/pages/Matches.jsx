import { Calendar, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import useAppStore from '../store/useAppStore.js'
import { matches, competitions, getMatchResult, getNextMatch } from '../data/matches.js'

const filterTabs = [
  { id: 'all', label: 'Tous' },
  { id: 'L1',  label: 'Ligue 1' },
  { id: 'EL',  label: 'Europa League' },
  { id: 'CDF', label: 'Coupe de France' },
]

const resultConfig = {
  W: { border: 'border-green-500',  bg: 'bg-green-50',  badge: 'bg-green-500',  label: 'V', textColor: 'text-green-700' },
  D: { border: 'border-yellow-400', bg: 'bg-yellow-50', badge: 'bg-yellow-400', label: 'N', textColor: 'text-yellow-700' },
  L: { border: 'border-red-500',    bg: 'bg-red-50',    badge: 'bg-red-500',    label: 'D', textColor: 'text-red-700' },
}

const compColor = {
  L1:  'bg-[#032974]',
  EL:  'bg-orange-500',
  CDF: 'bg-[#FFD700] text-gray-800',
}

function groupByMonth(matchList) {
  const groups = {}
  matchList.forEach(m => {
    const d = new Date(m.date)
    const key = d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })
  return groups
}

function MatchRow({ match }) {
  const [expanded, setExpanded] = useState(false)
  const result = getMatchResult(match)
  const isOLMatch = match.homeTeam === 'OL' || match.awayTeam === 'OL'
  const rc = result ? resultConfig[result] : null
  const isUpcoming = match.status === 'upcoming'
  const nextM = getNextMatch()
  const isNext = nextM && nextM.id === match.id

  const compStyle = compColor[match.competition] || 'bg-gray-400'

  return (
    <div className={`
      rounded-xl border-l-4 shadow-sm mb-3 overflow-hidden transition-shadow hover:shadow-md
      ${rc ? rc.border : isUpcoming ? 'border-[#032974]' : 'border-gray-200'}
      ${rc ? rc.bg : 'bg-white'}
      ${isNext ? 'ring-2 ring-[#FFD700]' : ''}
    `}>
      {isNext && (
        <div className="bg-[#FFD700] text-[#032974] text-xs font-black text-center py-1 tracking-widest">
          ⭐ PROCHAIN MATCH ⭐
        </div>
      )}
      {match.isDerby && (
        <div className="bg-gradient-to-r from-[#E30613] to-[#032974] text-white text-xs font-black text-center py-1">
          🔥 DERBY — OL VS ASSE 🔥
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${compStyle}`}>
              {competitions[match.competition]?.short || match.competition}
            </span>
            <span className="text-xs text-gray-500">{match.matchday}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={12} />
            <span>{match.date} · {match.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex-1 text-right pr-4">
            <p className={`font-black text-lg ${match.homeTeam === 'OL' ? 'text-[#E30613]' : 'text-gray-800'}`}>
              {match.homeTeam}
            </p>
            {match.homeTeam === 'OL' && <p className="text-xs text-gray-400">Domicile</p>}
          </div>

          {/* Score */}
          <div className="text-center w-24">
            {match.status === 'played' ? (
              <div>
                <p className="text-2xl font-black text-gray-800">{match.homeScore} – {match.awayScore}</p>
                {rc && (
                  <span className={`text-xs text-white font-bold px-2 py-0.5 rounded-full ${rc.badge}`}>
                    {rc.label === 'V' ? 'Victoire' : rc.label === 'N' ? 'Nul' : 'Défaite'}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <p className="text-xl font-black text-[#032974]">À venir</p>
                <p className="text-xs text-gray-500">{match.time}</p>
              </div>
            )}
          </div>

          {/* Away team */}
          <div className="flex-1 pl-4">
            <p className={`font-black text-lg ${match.awayTeam === 'OL' ? 'text-[#E30613]' : 'text-gray-800'}`}>
              {match.awayTeam}
            </p>
            {match.awayTeam === 'OL' && <p className="text-xs text-gray-400">Extérieur</p>}
          </div>
        </div>

        {/* Venue + expandable */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin size={12} />
            <span>{match.venue}</span>
            {match.attendance && (
              <>
                <Users size={12} className="ml-2" />
                <span>{match.attendance.toLocaleString('fr-FR')}</span>
              </>
            )}
          </div>
          {(match.scorers?.length > 0 || match.motm) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-[#032974] font-semibold flex items-center gap-1 hover:text-[#E30613]"
            >
              Détails {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 space-y-1">
            {match.scorers?.length > 0 && (
              <p>⚽ <strong>Buteurs :</strong> {match.scorers.join(' · ')}</p>
            )}
            {match.motm && (
              <p>⭐ <strong>Homme du match :</strong> {match.motm}</p>
            )}
            {match.note && (
              <p>📝 {match.note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Matches() {
  const { matchFilter, setMatchFilter } = useAppStore()

  const filtered = matches.filter(m =>
    (m.homeTeam === 'OL' || m.awayTeam === 'OL') &&
    (matchFilter === 'all' || m.competition === matchFilter)
  )

  const grouped = groupByMonth(filtered)

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Matchs &amp; Résultats</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setMatchFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all
              ${matchFilter === tab.id
                ? 'bg-[#E30613] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E30613] hover:text-[#E30613]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Victoire</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Nul</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Défaite</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#032974] inline-block" /> À venir</span>
      </div>

      {/* Matches grouped by month */}
      {Object.entries(grouped).map(([month, monthMatches]) => (
        <div key={month}>
          <h2 className="text-lg font-bold text-[#032974] capitalize mb-3 border-b-2 border-[#E30613] pb-1">
            {month}
          </h2>
          {monthMatches.map(match => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Calendar size={48} className="mx-auto mb-3 opacity-30" />
          <p>Aucun match dans cette catégorie</p>
        </div>
      )}
    </div>
  )
}
