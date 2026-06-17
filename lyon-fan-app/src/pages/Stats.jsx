import { useState } from 'react'
import { Target, Zap, AlertTriangle, Shield, BarChart2, Globe } from 'lucide-react'
import { squad, getTopScorers, getTopAssisters } from '../data/squad.js'

const subTabs = [
  { id: 'scorers',  label: 'Buteurs',         Icon: Target },
  { id: 'assists',  label: 'Passeurs',         Icon: Zap },
  { id: 'discipline', label: 'Discipline',    Icon: AlertTriangle },
  { id: 'keepers', label: 'Gardiens',         Icon: Shield },
  { id: 'team',    label: 'Équipe',           Icon: BarChart2 },
  { id: 'europe',  label: 'Europa League',    Icon: Globe },
]

function StatBar({ label, value, max, color = '#032974' }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

function ScorersTable({ players }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#032974] text-white text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left">#</th>
            <th className="px-3 py-3 text-left">Joueur</th>
            <th className="px-2 py-3 text-center">MJ</th>
            <th className="px-2 py-3 text-center">Buts</th>
            <th className="px-2 py-3 text-center hidden sm:table-cell">Tirs cadrés</th>
            <th className="px-2 py-3 text-center hidden md:table-cell">Conv %</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => {
            const shotsOnTarget = player.stats?.shotsOnTarget || 0
            const conversion = shotsOnTarget > 0 ? ((player.goals / shotsOnTarget) * 100).toFixed(0) : '—'
            return (
              <tr key={player.id} className={`border-b border-gray-100 ${idx === 0 ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                <td className="px-3 py-2.5">
                  <span className={`font-black ${idx === 0 ? 'text-[#FFD700]' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span>{player.flag}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{player.name}</p>
                      <p className="text-xs text-gray-400">{player.position}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2.5 text-center text-gray-600">{player.appearances}</td>
                <td className="px-2 py-2.5 text-center">
                  <span className="font-black text-[#E30613] text-base">{player.goals}</span>
                </td>
                <td className="px-2 py-2.5 text-center text-gray-600 hidden sm:table-cell">{shotsOnTarget || '—'}</td>
                <td className="px-2 py-2.5 text-center hidden md:table-cell">
                  <span className={`font-semibold ${parseInt(conversion) >= 30 ? 'text-green-600' : 'text-gray-600'}`}>{conversion}{conversion !== '—' ? '%' : ''}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function AssistsTable({ players }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#032974] text-white text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left">#</th>
            <th className="px-3 py-3 text-left">Joueur</th>
            <th className="px-2 py-3 text-center">MJ</th>
            <th className="px-2 py-3 text-center">Passes D</th>
            <th className="px-2 py-3 text-center hidden sm:table-cell">Passes clés</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, idx) => (
            <tr key={player.id} className={`border-b border-gray-100 ${idx === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
              <td className="px-3 py-2.5">
                <span className="font-black text-gray-500">{idx + 1}</span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span>{player.flag}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.position}</p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-2.5 text-center text-gray-600">{player.appearances}</td>
              <td className="px-2 py-2.5 text-center">
                <span className="font-black text-[#032974] text-base">{player.assists}</span>
              </td>
              <td className="px-2 py-2.5 text-center text-gray-600 hidden sm:table-cell">
                {player.stats?.keyPasses || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Stats() {
  const [activeTab, setActiveTab] = useState('scorers')

  const topScorers = getTopScorers(10)
  const topAssisters = getTopAssisters(10)
  const keepers = squad.filter(p => p.positionCode === 'GK')
  const sorted = [...squad].sort((a, b) => b.yellowCards - a.yellowCards)

  const teamStats = [
    { label: 'Possession moyenne', value: '54%', detail: '54 % de possession par match en L1', pct: 54, color: '#032974' },
    { label: 'Tirs par match', value: '14.2', detail: 'Moyenne de 14.2 tirs par rencontre', pct: 71, color: '#E30613' },
    { label: 'Passes par match', value: '487', detail: 'Pression haute et jeu de possession', pct: 81, color: '#053da0' },
    { label: 'Clean sheets', value: '9', detail: '9 matchs sans encaisser en L1', pct: 32, color: '#22c55e' },
    { label: 'Tirs cadrés / match', value: '5.4', detail: 'Efficacité offensive', pct: 54, color: '#f97316' },
    { label: 'Précision passes (%)', value: '85.2', detail: '85.2 % de précision dans les passes', pct: 85, color: '#8b5cf6' },
  ]

  const elStats = [
    { stage: 'Phase de ligue', played: 8, w: 5, d: 2, l: 1, gf: 14, ga: 7 },
    { stage: 'Barrage', played: 2, w: 1, d: 1, l: 0, gf: 3, ga: 1 },
    { stage: 'Huitièmes', played: 2, w: 2, d: 0, l: 0, gf: 3, ga: 1 },
  ]

  const elScorers = [
    { name: 'Alexandre Lacazette', goals: 4, flag: '🇫🇷' },
    { name: 'Georges Mikautadze', goals: 3, flag: '🇬🇪' },
    { name: 'Ernest Nuamah', goals: 3, flag: '🇬🇭' },
    { name: 'Gift Orban', goals: 2, flag: '🇳🇴' },
    { name: 'Rayan Cherki', goals: 2, flag: '🇫🇷' },
    { name: 'Malick Fofana', goals: 1, flag: '🇧🇪' },
    { name: 'Wilfried Gnonto', goals: 1, flag: '🇮🇹' },
  ]

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Statistiques OL 2025/26</h1>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-2">
        {subTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
              ${activeTab === id
                ? 'bg-[#032974] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#032974] hover:text-[#032974]'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* BUTEURS */}
      {activeTab === 'scorers' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <Target size={20} className="text-[#E30613]" /> Classement des buteurs (L1)
          </h2>
          <ScorersTable players={topScorers} />
        </div>
      )}

      {/* PASSEURS */}
      {activeTab === 'assists' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <Zap size={20} className="text-[#E30613]" /> Classement des passeurs (L1)
          </h2>
          <AssistsTable players={topAssisters} />
        </div>
      )}

      {/* DISCIPLINE */}
      {activeTab === 'discipline' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <AlertTriangle size={20} className="text-yellow-500" /> Discipline (toutes compétitions)
          </h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#032974] text-white text-xs uppercase tracking-wider">
                  <th className="px-3 py-3 text-left">Joueur</th>
                  <th className="px-2 py-3 text-center">🟨 Jaunes</th>
                  <th className="px-2 py-3 text-center">🟥 Rouges</th>
                  <th className="px-2 py-3 text-center hidden sm:table-cell">MJ</th>
                </tr>
              </thead>
              <tbody>
                {sorted.filter(p => p.yellowCards > 0 || p.redCards > 0).map((player) => (
                  <tr key={player.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span>{player.flag}</span>
                        <span className="font-semibold text-gray-800">{player.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className="bg-yellow-400 text-yellow-900 font-black text-xs px-2 py-0.5 rounded">
                        {player.yellowCards}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      {player.redCards > 0 ? (
                        <span className="bg-red-500 text-white font-black text-xs px-2 py-0.5 rounded">
                          {player.redCards}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-500 hidden sm:table-cell">{player.appearances}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GARDIENS */}
      {activeTab === 'keepers' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <Shield size={20} className="text-[#E30613]" /> Statistiques gardiens
          </h2>
          <div className="grid gap-4">
            {keepers.map(gk => (
              <div key={gk.id} className="bg-white rounded-xl shadow-md p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-[#032974] rounded-full flex items-center justify-center text-white font-black text-xl">
                    #{gk.number}
                  </div>
                  <div>
                    <p className="font-black text-lg text-gray-800">{gk.name} {gk.flag}</p>
                    <p className="text-sm text-gray-500">{gk.nationality} · {gk.age} ans</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Matchs joués', value: gk.appearances },
                    { label: 'Clean Sheets', value: gk.cleanSheets },
                    { label: 'Arrêts', value: gk.stats?.saves || 0 },
                    { label: '% Arrêts', value: gk.savePercentage ? `${gk.savePercentage}%` : '—' },
                    { label: 'Sorties H.', value: gk.stats?.highClaims || 0 },
                    { label: 'Penaltys arrêtés', value: gk.stats?.penaltiesSaved || 0 },
                    { label: 'Cartons jaunes', value: gk.yellowCards },
                    { label: 'Minutes jouées', value: gk.minutesPlayed?.toLocaleString('fr-FR') || 0 },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
                      <p className="font-black text-[#032974] text-lg">{value}</p>
                      <p className="text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEAM STATS */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <BarChart2 size={20} className="text-[#E30613]" /> Statistiques d&apos;équipe (L1)
          </h2>
          <div className="bg-white rounded-xl shadow-md p-6 space-y-5">
            {teamStats.map(s => (
              <StatBar key={s.label} label={s.label} value={s.value} max={100} color={s.color} />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Plus grande victoire', value: '5-0', detail: 'vs Quevilly-Rouen (CDF)' },
              { label: 'Plus grosse défaite', value: '0-3', detail: 'vs PSG (J7)' },
              { label: 'Série en cours', value: '2V', detail: 'Reims 0-2, Brest 1-2' },
              { label: 'Plus long run W', value: '4V', detail: 'J18 → J21' },
              { label: 'Buts marqués (L1)', value: '53', detail: '28 journées' },
              { label: 'Buts concédés (L1)', value: '30', detail: 'Défense solide' },
            ].map(({ label, value, detail }) => (
              <div key={label} className="bg-white rounded-xl shadow-md p-4 text-center">
                <p className="text-3xl font-black text-[#032974]">{value}</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{label}</p>
                <p className="text-xs text-gray-400">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EUROPA LEAGUE */}
      {activeTab === 'europe' && (
        <div className="space-y-5">
          <h2 className="text-lg font-bold text-[#032974] flex items-center gap-2">
            <Globe size={20} className="text-orange-500" /> Statistiques Europa League
          </h2>

          {/* EL results summary */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-500 text-white text-xs uppercase tracking-wider">
                  <th className="px-3 py-3 text-left">Phase</th>
                  <th className="px-2 py-3 text-center">MJ</th>
                  <th className="px-2 py-3 text-center">V</th>
                  <th className="px-2 py-3 text-center">N</th>
                  <th className="px-2 py-3 text-center">D</th>
                  <th className="px-2 py-3 text-center">BP</th>
                  <th className="px-2 py-3 text-center">BC</th>
                </tr>
              </thead>
              <tbody>
                {elStats.map(row => (
                  <tr key={row.stage} className="border-b border-gray-100 hover:bg-orange-50">
                    <td className="px-3 py-2.5 font-semibold text-gray-800">{row.stage}</td>
                    <td className="px-2 py-2.5 text-center text-gray-600">{row.played}</td>
                    <td className="px-2 py-2.5 text-center text-green-600 font-semibold">{row.w}</td>
                    <td className="px-2 py-2.5 text-center text-yellow-600">{row.d}</td>
                    <td className="px-2 py-2.5 text-center text-red-500">{row.l}</td>
                    <td className="px-2 py-2.5 text-center text-gray-700 font-bold">{row.gf}</td>
                    <td className="px-2 py-2.5 text-center text-gray-500">{row.ga}</td>
                  </tr>
                ))}
                <tr className="bg-orange-50 font-bold">
                  <td className="px-3 py-2.5 text-orange-700">TOTAL</td>
                  <td className="px-2 py-2.5 text-center">12</td>
                  <td className="px-2 py-2.5 text-center text-green-600">8</td>
                  <td className="px-2 py-2.5 text-center text-yellow-600">3</td>
                  <td className="px-2 py-2.5 text-center text-red-500">1</td>
                  <td className="px-2 py-2.5 text-center text-orange-700">20</td>
                  <td className="px-2 py-2.5 text-center text-orange-700">9</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* EL scorers */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="font-bold text-[#032974] mb-3">Buteurs en Europa League</h3>
            <div className="space-y-2">
              {elScorers.map((p, idx) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-gray-400 font-bold w-5 text-center">{idx + 1}</span>
                  <span className="text-lg">{p.flag}</span>
                  <span className="flex-1 font-semibold text-gray-800">{p.name}</span>
                  <div className="flex gap-1">
                    {[...Array(p.goals)].map((_, i) => (
                      <span key={i} className="text-orange-500 text-sm">⚽</span>
                    ))}
                    <span className="font-black text-orange-600 ml-1">{p.goals}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
