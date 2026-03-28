import { X, Shield, Star, TrendingUp, Users } from 'lucide-react'
import useAppStore from '../store/useAppStore.js'
import { squad, staff } from '../data/squad.js'

const filterTabs = [
  { id: 'all',  label: 'Tous' },
  { id: 'GK',   label: 'Gardiens' },
  { id: 'DEF',  label: 'Défenseurs' },
  { id: 'MID',  label: 'Milieux' },
  { id: 'ATT',  label: 'Attaquants' },
]

const positionColor = {
  GK:  'bg-yellow-400 text-yellow-900',
  DEF: 'bg-blue-600 text-white',
  MID: 'bg-green-600 text-white',
  ATT: 'bg-[#E30613] text-white',
}

function PlayerCard({ player, onClick }) {
  return (
    <div
      onClick={() => onClick(player)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-gray-100"
    >
      {/* Number banner */}
      <div className="bg-gradient-to-r from-[#032974] to-[#053da0] p-3 flex items-center justify-between">
        <span className="text-4xl font-black text-white/90">#{player.number}</span>
        <div className="text-right">
          <span className="text-2xl">{player.flag}</span>
          {player.captain && (
            <div className="bg-[#FFD700] text-[#032974] text-xs font-black px-2 py-0.5 rounded-full mt-1">
              ©APITAINE
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-black text-gray-900 leading-tight">{player.name}</p>
            <p className="text-xs text-gray-500">{player.nationality}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${positionColor[player.positionCode]}`}>
            {player.positionCode}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div>
            <p className="text-xl font-black text-gray-800">{player.appearances}</p>
            <p className="text-xs text-gray-400">Matchs</p>
          </div>
          {player.positionCode === 'GK' ? (
            <div>
              <p className="text-xl font-black text-gray-800">{player.cleanSheets}</p>
              <p className="text-xs text-gray-400">CS</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-black text-[#E30613]">{player.goals}</p>
              <p className="text-xs text-gray-400">Buts</p>
            </div>
          )}
          <div>
            <p className="text-xl font-black text-[#032974]">{player.assists}</p>
            <p className="text-xs text-gray-400">Passes D</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>{player.age} ans · {player.height}</span>
          <span className="font-semibold text-[#032974]">{player.marketValue}</span>
        </div>
      </div>
    </div>
  )
}

function PlayerModal({ player, onClose }) {
  if (!player) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#032974] to-[#053da0] text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-black">#{player.number}</span>
              </div>
              <div>
                <p className="text-3xl font-black">{player.name}</p>
                <p className="text-blue-200 flex items-center gap-2 mt-1">
                  <span>{player.flag}</span>
                  <span>{player.nationality}</span>
                  {player.captain && <span className="bg-[#FFD700] text-[#032974] text-xs font-black px-2 py-0.5 rounded-full">CAPITAINE</span>}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Matchs', value: player.appearances },
              { label: player.positionCode === 'GK' ? 'Clean Sheets' : 'Buts', value: player.positionCode === 'GK' ? player.cleanSheets : player.goals },
              { label: 'Passes D', value: player.assists },
              { label: 'Minutes', value: player.minutesPlayed?.toLocaleString('fr-FR') },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-[#032974]">{value ?? '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <InfoRow label="Poste" value={player.position} />
              <InfoRow label="Âge" value={`${player.age} ans (${player.dateOfBirth})`} />
              <InfoRow label="Taille" value={player.height} />
              <InfoRow label="Poids" value={player.weight} />
            </div>
            <div className="space-y-2">
              <InfoRow label="Contrat" value={`Jusqu'en ${player.contractUntil}`} />
              <InfoRow label="Valeur marchande" value={player.marketValue} />
              <InfoRow label="Cartons jaunes" value={player.yellowCards} />
              <InfoRow label="Cartons rouges" value={player.redCards} />
            </div>
          </div>

          {/* Specific stats */}
          {player.stats && (
            <div>
              <h4 className="font-bold text-[#032974] mb-2 flex items-center gap-2">
                <TrendingUp size={16} /> Statistiques détaillées
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(player.stats).map(([key, val]) => (
                  <div key={key} className="bg-[#032974]/5 rounded-lg p-2 text-center">
                    <p className="font-black text-[#032974]">{val}</p>
                    <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {player.strengths && (
            <div>
              <h4 className="font-bold text-[#032974] mb-2 flex items-center gap-2">
                <Star size={16} /> Points forts
              </h4>
              <div className="flex flex-wrap gap-2">
                {player.strengths.map(s => (
                  <span key={s} className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          <div>
            <h4 className="font-bold text-[#032974] mb-2 flex items-center gap-2">
              <Shield size={16} /> Biographie
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{player.bio}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  )
}

export default function Squad() {
  const { squadFilter, setSquadFilter, selectedPlayer, setSelectedPlayer } = useAppStore()

  const filtered = squadFilter === 'all'
    ? squad
    : squad.filter(p => p.positionCode === squadFilter)

  const sections = [
    { code: 'GK',  label: 'Gardiens' },
    { code: 'DEF', label: 'Défenseurs' },
    { code: 'MID', label: 'Milieux' },
    { code: 'ATT', label: 'Attaquants' },
  ]

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Effectif 2025/26</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSquadFilter(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all
              ${squadFilter === tab.id
                ? 'bg-[#E30613] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E30613] hover:text-[#E30613]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Players by section */}
      {squadFilter === 'all' ? (
        sections.map(({ code, label }) => {
          const players = squad.filter(p => p.positionCode === code)
          return (
            <div key={code}>
              <h2 className="text-lg font-bold text-[#032974] border-b-2 border-[#E30613] pb-1 mb-4">{label}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {players.map(player => (
                  <PlayerCard key={player.id} player={player} onClick={setSelectedPlayer} />
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(player => (
            <PlayerCard key={player.id} player={player} onClick={setSelectedPlayer} />
          ))}
        </div>
      )}

      {/* Staff section */}
      <div>
        <h2 className="text-lg font-bold text-[#032974] border-b-2 border-[#E30613] pb-1 mb-4 flex items-center gap-2">
          <Users size={20} /> Staff technique &amp; direction
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 border border-gray-100">
              <div className="w-12 h-12 bg-[#032974] rounded-full flex items-center justify-center text-white font-black text-lg">
                {member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-xs text-[#E30613] font-semibold">{member.role}</p>
                <p className="text-xs text-gray-400">{member.nationality} · depuis {member.since}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player modal */}
      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  )
}
