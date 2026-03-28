import { Calendar, Trophy, TrendingUp, Star, Globe, Newspaper, ChevronRight, Flame } from 'lucide-react'
import useAppStore from '../store/useAppStore.js'
import { getLastMatch, getNextMatch, getSeasonForm, getSeasonStats, getMatchResult } from '../data/matches.js'
import { getTopScorers } from '../data/squad.js'
import { standings } from '../data/standings.js'
import { getLatestNews } from '../data/news.js'

const resultColor = { W: 'bg-green-500', D: 'bg-yellow-400', L: 'bg-red-500' }
const resultLabel = { W: 'V', D: 'N', L: 'D' }

function FormDot({ result }) {
  return (
    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold ${resultColor[result]}`}>
      {resultLabel[result]}
    </span>
  )
}

function MatchCard({ match, type }) {
  if (!match) return null
  const isHome = match.homeTeam === 'OL'
  const result = type === 'last' ? getMatchResult(match) : null
  const borderColor = result === 'W' ? 'border-green-500' : result === 'L' ? 'border-red-500' : result === 'D' ? 'border-yellow-400' : 'border-[#032974]'

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${borderColor} flex-1`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#032974] text-white">{match.competition}</span>
        <span className="text-xs text-gray-500">{match.date} · {match.time}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-center flex-1">
          <p className={`font-black text-lg ${match.homeTeam === 'OL' ? 'text-[#E30613]' : 'text-gray-800'}`}>{match.homeTeam}</p>
          <p className="text-xs text-gray-400">{isHome ? 'Domicile' : ''}</p>
        </div>
        <div className="text-center px-4">
          {type === 'last' ? (
            <div>
              <p className="text-2xl font-black text-gray-800">{match.homeScore} – {match.awayScore}</p>
              <p className={`text-xs font-bold mt-1 ${result === 'W' ? 'text-green-600' : result === 'L' ? 'text-red-600' : 'text-yellow-600'}`}>
                {result === 'W' ? 'Victoire' : result === 'L' ? 'Défaite' : 'Match nul'}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold text-[#032974]">VS</p>
              <p className="text-xs text-gray-500">{match.time}</p>
            </div>
          )}
        </div>
        <div className="text-center flex-1">
          <p className={`font-black text-lg ${match.awayTeam === 'OL' ? 'text-[#E30613]' : 'text-gray-800'}`}>{match.awayTeam}</p>
          <p className="text-xs text-gray-400">{!isHome ? 'Extérieur' : ''}</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-3">📍 {match.venue}</p>
      {type === 'last' && match.scorers?.length > 0 && (
        <p className="text-xs text-gray-500 text-center mt-1">⚽ {match.scorers.join(' · ')}</p>
      )}
    </div>
  )
}

export default function Home() {
  const { setActivePage } = useAppStore()
  const lastMatch = getLastMatch()
  const nextMatch = getNextMatch()
  const form = getSeasonForm(5)
  const stats = getSeasonStats()
  const topScorers = getTopScorers(3)
  const latestNews = getLatestNews(3)
  const top6 = standings.slice(0, 6)

  return (
    <div className="space-y-8 pb-8">

      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-br from-[#032974] via-[#053da0] to-[#E30613] text-white rounded-2xl p-8 shadow-xl">
        <div className="text-center">
          <p className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-2">Saison 2025 / 2026</p>
          <h1 className="text-5xl md:text-6xl font-black mb-3">Allez l&apos;OL !</h1>
          <p className="text-blue-100 text-lg mb-6">Les Gones en route pour l&apos;Europe</p>

          {/* Season record */}
          <div className="flex justify-center gap-4 md:gap-8 mb-6 flex-wrap">
            {[
              { label: 'Victoires', value: stats.w, color: 'text-green-300' },
              { label: 'Nuls',      value: stats.d, color: 'text-yellow-300' },
              { label: 'Défaites', value: stats.l, color: 'text-red-300' },
              { label: 'Points',   value: stats.points, color: 'text-[#FFD700]' },
              { label: 'Matchs',   value: stats.played, color: 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className={`text-3xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-blue-200 uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2 text-sm font-semibold">
            <Trophy size={16} className="text-[#FFD700]" />
            <span>4ème en Ligue 1 · En quarts d&apos;Europa League !</span>
          </div>
        </div>
      </section>

      {/* ── DERNIER / PROCHAIN MATCH ── */}
      <section>
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Calendar size={22} className="text-[#E30613]" /> Derniers &amp; Prochains matchs
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Dernier résultat</p>
            <MatchCard match={lastMatch} type="last" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Prochain match</p>
            <MatchCard match={nextMatch} type="next" />
          </div>
        </div>
      </section>

      {/* ── FORME RÉCENTE + CLASSEMENT ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Forme récente */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-black text-[#032974] mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#E30613]" /> Forme récente (L1)
          </h3>
          <div className="flex gap-2 mb-3">
            {form.map((r, i) => <FormDot key={i} result={r} />)}
          </div>
          <p className="text-xs text-gray-500">5 derniers matchs de Ligue 1</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-black text-gray-800">{stats.gf}</p>
              <p className="text-xs text-gray-500">Buts marqués</p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-800">{stats.ga}</p>
              <p className="text-xs text-gray-500">Buts concédés</p>
            </div>
            <div>
              <p className="text-2xl font-black text-[#E30613]">+{stats.gf - stats.ga}</p>
              <p className="text-xs text-gray-500">Différence</p>
            </div>
          </div>
        </div>

        {/* Classement rapide */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="font-black text-[#032974] mb-4 flex items-center gap-2">
            <Star size={18} className="text-[#E30613]" /> Classement Ligue 1
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b">
                <th className="text-left pb-2">Pos</th>
                <th className="text-left pb-2">Club</th>
                <th className="text-right pb-2">Pts</th>
              </tr>
            </thead>
            <tbody>
              {top6.map((team) => (
                <tr key={team.position} className={`border-b border-gray-50 ${team.isOL ? 'bg-red-50' : ''}`}>
                  <td className="py-1.5 text-gray-600 font-bold">{team.position}</td>
                  <td className={`py-1.5 font-semibold ${team.isOL ? 'text-[#E30613]' : 'text-gray-800'}`}>
                    {team.isOL ? '⭐ ' : ''}{team.short}
                  </td>
                  <td className={`py-1.5 text-right font-black ${team.isOL ? 'text-[#E30613]' : 'text-gray-700'}`}>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setActivePage('standings')}
            className="mt-3 text-xs text-[#032974] font-semibold hover:text-[#E30613] flex items-center gap-1 transition-colors"
          >
            Voir le classement complet <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* ── TOP BUTEURS ── */}
      <section className="bg-white rounded-xl shadow-md p-5">
        <h2 className="font-black text-[#032974] mb-4 flex items-center gap-2">
          <Flame size={20} className="text-[#E30613]" /> Top buteurs OL
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {topScorers.map((player, idx) => (
            <div key={player.id} className={`flex items-center gap-3 p-3 rounded-lg ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm ${idx === 0 ? 'bg-[#FFD700]' : idx === 1 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{player.name}</p>
                <p className="text-xs text-gray-500">{player.position}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#E30613]">{player.goals}</p>
                <p className="text-xs text-gray-400">buts</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActivePage('stats')}
          className="mt-3 text-xs text-[#032974] font-semibold hover:text-[#E30613] flex items-center gap-1 transition-colors"
        >
          Toutes les statistiques <ChevronRight size={14} />
        </button>
      </section>

      {/* ── EN EUROPE ── */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl shadow-md p-6">
        <h2 className="font-black text-xl mb-3 flex items-center gap-2">
          <Globe size={22} /> Europa League 2025/26
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Phase de ligue', value: '5e', detail: '5V 2D 1N' },
            { label: 'Barrage', value: '✓', detail: 'vs Braga (3-1 agg.)' },
            { label: 'Huitièmes', value: '✓', detail: 'vs Lazio (3-1 agg.)' },
            { label: 'Quarts', value: '⬡', detail: 'vs Ajax (10 & 17 avr.)' },
          ].map(({ label, value, detail }) => (
            <div key={label} className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-black">{value}</p>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-orange-100">{detail}</p>
            </div>
          ))}
        </div>
        <p className="text-orange-100 text-sm">
          🎯 Prochain match européen : <strong>OL vs Ajax</strong> — 10 avril au Groupama Stadium
        </p>
      </section>

      {/* ── ACTUALITÉS ── */}
      <section>
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Newspaper size={22} className="text-[#E30613]" /> Dernières actualités
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestNews.map((article) => (
            <div key={article.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {article.isBreaking && (
                <div className="bg-[#E30613] text-white text-xs font-bold px-3 py-1 text-center">
                  🔴 BREAKING NEWS
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{article.image}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#032974]/10 text-[#032974]">
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm leading-snug">{article.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{article.excerpt}</p>
                <p className="text-xs text-gray-400 mt-2">{article.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
