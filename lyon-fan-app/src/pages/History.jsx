import { Trophy, Star, Clock, Zap } from 'lucide-react'
import { trophies, timeline, legends } from '../data/history.js'

const trophyMeta = {
  'Ligue 1':                         { emoji: '🏆', color: 'bg-[#FFD700] text-[#032974]' },
  'Coupe de France':                  { emoji: '🥇', color: 'bg-blue-600 text-white' },
  'Coupe de la Ligue':               { emoji: '🏅', color: 'bg-gray-600 text-white' },
  'Trophée des Champions':           { emoji: '🎖️', color: 'bg-[#E30613] text-white' },
  'Ligue des Champions Féminine':    { emoji: '🌟', color: 'bg-purple-600 text-white' },
  'D1 Arkema':                       { emoji: '⭐', color: 'bg-pink-500 text-white' },
}

const timelineTypeConfig = {
  success:   { color: 'border-[#FFD700] bg-yellow-50',   icon: '🏆', dot: 'bg-[#FFD700]' },
  milestone: { color: 'border-[#032974] bg-blue-50',     icon: '📌', dot: 'bg-[#032974]' },
  transfer:  { color: 'border-green-500 bg-green-50',    icon: '🔄', dot: 'bg-green-500' },
  stadium:   { color: 'border-[#E30613] bg-red-50',      icon: '🏟️', dot: 'bg-[#E30613]' },
}

const positionColors = {
  'Avant-centre':        'bg-[#E30613] text-white',
  'Milieu offensif':     'bg-[#032974] text-white',
  'Gardien':             'bg-yellow-400 text-yellow-900',
  'Défenseur':           'bg-blue-700 text-white',
  'Ailier':              'bg-green-600 text-white',
  'Milieu défensif':     'bg-gray-700 text-white',
  'Ailier / Attaquant':  'bg-orange-500 text-white',
}

function TrophySection({ competition }) {
  const meta = trophyMeta[competition] || { emoji: '🏆', color: 'bg-gray-500 text-white' }
  const items = trophies.filter(t => t.competition === competition)
  if (items.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-full ${meta.color} font-black`}>
          {meta.emoji}
        </span>
        <div>
          <p className="font-black text-gray-800">{competition}</p>
          <p className="text-sm text-[#E30613] font-bold">{items.length}× titres</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(t => (
          <span
            key={t.id}
            className={`text-xs font-bold px-2 py-1 rounded-full ${meta.color}`}
            title={t.detail}
          >
            {t.year}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function History() {
  const competitions = [...new Set(trophies.map(t => t.competition))]

  const l1Count = trophies.filter(t => t.competition === 'Ligue 1').length
  const cdfCount = trophies.filter(t => t.competition === 'Coupe de France').length
  const wclCount = trophies.filter(t => t.competition === 'Ligue des Champions Féminine').length

  return (
    <div className="space-y-8 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Palmarès &amp; Histoire</h1>

      {/* Summary bar */}
      <div className="bg-gradient-to-r from-[#032974] to-black text-white rounded-2xl p-6 shadow-xl">
        <p className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-2">
          Olympique Lyonnais · Fondé le 3 août 1950
        </p>
        <h2 className="text-4xl font-black mb-4">Un club de légende</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Champion de France', value: `${l1Count}×`, sub: '2002-2008' },
            { label: 'Coupe de France', value: `${cdfCount}×`, sub: '1964-2012' },
            { label: 'Champions League F.', value: `${wclCount}×`, sub: 'Record mondial' },
            { label: 'Trophées au total', value: `${trophies.length}+`, sub: 'Toutes compétitions' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-3xl font-black text-[#FFD700]">{value}</p>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-xs text-blue-200">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 7 en Série spotlight */}
      <div className="bg-[#FFD700] rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-[#032974] text-[#FFD700] font-black text-3xl w-14 h-14 rounded-full flex items-center justify-center">7</div>
          <div>
            <h2 className="text-2xl font-black text-[#032974]">7 en série — Record absolu</h2>
            <p className="text-[#032974]/80 text-sm">La plus grande série de championnats consécutifs de l&apos;histoire du football français</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {[2002, 2003, 2004, 2005, 2006, 2007, 2008].map(year => (
            <div key={year} className="bg-[#032974] text-[#FFD700] font-black px-4 py-2 rounded-lg text-center">
              <p className="text-xl">{year}</p>
              <p className="text-xs">Champion</p>
            </div>
          ))}
        </div>
        <p className="text-[#032974]/80 text-sm mt-3">
          Record encore inégalé à ce jour — Juninho, Benzema, Govou, Coupet... Une génération dorée unique en France.
        </p>
      </div>

      {/* Trophy cabinet */}
      <div>
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Trophy size={22} className="text-[#E30613]" /> Palmarès complet
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitions.map(comp => (
            <TrophySection key={comp} competition={comp} />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Clock size={22} className="text-[#E30613]" /> Moments clés de l&apos;histoire
        </h2>
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

          {timeline.map((event, idx) => {
            const config = timelineTypeConfig[event.type] || timelineTypeConfig.milestone
            return (
              <div key={idx} className="flex gap-4 items-start">
                {/* Year dot */}
                <div className="relative z-10 flex-shrink-0 flex flex-col items-center hidden md:flex">
                  <div className={`w-4 h-4 rounded-full mt-1 ${config.dot}`} />
                </div>

                <div className={`flex-1 rounded-xl border-l-4 p-4 shadow-sm ${config.color}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{config.icon}</span>
                    <span className="bg-white/70 text-[#032974] font-black text-sm px-2 py-0.5 rounded-full">{event.year}</span>
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      {event.type === 'success' ? 'Titre' : event.type === 'transfer' ? 'Transfert' : event.type === 'stadium' ? 'Stade' : 'Étape'}
                    </span>
                  </div>
                  <h3 className="font-black text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legends */}
      <div>
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Star size={22} className="text-[#E30613]" /> Joueurs légendaires
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {legends.map((legend, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-[#032974] to-[#053da0] p-4 flex items-center justify-between">
                <div>
                  <p className="font-black text-white text-lg">{legend.name}</p>
                  <p className="text-blue-200 text-sm">{legend.years}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${positionColors[legend.position] || 'bg-gray-600 text-white'}`}>
                  {legend.position}
                </span>
              </div>
              <div className="p-4">
                <div className="flex gap-6 mb-3">
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#E30613]">{legend.goals}</p>
                    <p className="text-xs text-gray-500">Buts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-[#032974]">{legend.caps}</p>
                    <p className="text-xs text-gray-500">Matchs</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{legend.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Club records */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="text-xl font-black text-[#032974] mb-4 flex items-center gap-2">
          <Zap size={22} className="text-[#E30613]" /> Records du club
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Meilleur buteur historique', value: 'Alexandre Lacazette', detail: '172+ buts (en cours)' },
            { label: 'Plus grande victoire', value: '10-0', detail: 'vs Nantes, 1954' },
            { label: 'Joueur le plus capé', value: 'Grégory Coupet', detail: '338 matchs (1997-2008)' },
            { label: 'Plus grande affluence', value: '59 186', detail: 'OL vs Juventus, 2018' },
            { label: 'Plus jeune buteur', value: 'Rayan Cherki', detail: '16 ans et 102 jours, 2020' },
            { label: 'Meilleure saison en L1', value: '83 pts', detail: 'Saison 2005-2006' },
            { label: 'Plus grosses ventes', value: 'Benzema', detail: '35M€ → Real Madrid, 2009' },
            { label: 'Série sans défaite', value: '22 matchs', detail: 'Saison 2005-2006' },
            { label: 'Titres mondiaux féminins', value: '8×', detail: 'OL Féminin, record mondial' },
          ].map(({ label, value, detail }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-black text-[#E30613]">{value}</p>
              <p className="text-sm font-bold text-gray-800">{label}</p>
              <p className="text-xs text-gray-500">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
