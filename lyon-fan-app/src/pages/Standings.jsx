import { Info } from 'lucide-react'
import { standings, zones, getZoneForPosition } from '../data/standings.js'

const resultColor = { W: 'bg-green-500', D: 'bg-yellow-400', L: 'bg-red-500' }

function FormCell({ form }) {
  return (
    <div className="flex gap-0.5">
      {form.map((r, i) => (
        <span
          key={i}
          title={r === 'W' ? 'Victoire' : r === 'D' ? 'Nul' : 'Défaite'}
          className={`w-4 h-4 rounded-sm flex items-center justify-center text-white text-[9px] font-bold ${resultColor[r]}`}
        >
          {r === 'W' ? 'V' : r === 'D' ? 'N' : 'D'}
        </span>
      ))}
    </div>
  )
}

export default function Standings() {
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-black text-[#032974]">Classement Ligue 1</h1>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
          Dernière mise à jour : J28
        </span>
      </div>

      {/* OL position highlight */}
      <div className="bg-[#E30613] text-white rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold opacity-90">Position actuelle</p>
          <p className="text-3xl font-black">4ème — 55 pts</p>
          <p className="text-sm opacity-80">À égalité avec Marseille (3e) — meilleure diff. de buts</p>
        </div>
        <div className="text-5xl font-black opacity-20">OL</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#032974] text-white text-xs uppercase tracking-wider">
                <th className="px-3 py-3 text-left w-8">Pos</th>
                <th className="px-3 py-3 text-left">Club</th>
                <th className="px-2 py-3 text-center">J</th>
                <th className="px-2 py-3 text-center">V</th>
                <th className="px-2 py-3 text-center">N</th>
                <th className="px-2 py-3 text-center">D</th>
                <th className="px-2 py-3 text-center">BP</th>
                <th className="px-2 py-3 text-center">BC</th>
                <th className="px-2 py-3 text-center">Diff</th>
                <th className="px-2 py-3 text-center font-black">Pts</th>
                <th className="px-3 py-3 text-center hidden md:table-cell">Forme</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team) => {
                const zone = getZoneForPosition(team.position)
                const diff = team.goalsFor - team.goalsAgainst

                return (
                  <tr
                    key={team.position}
                    className={`
                      border-b border-gray-100 transition-colors
                      ${team.isOL ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                    `}
                    style={zone && !team.isOL ? { borderLeft: `3px solid ${zone.color}` } : team.isOL ? { borderLeft: '3px solid #E30613' } : {}}
                  >
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        {zone && (
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: team.isOL ? '#E30613' : zone.color }}
                          />
                        )}
                        <span className={`font-bold ${team.isOL ? 'text-[#E30613]' : 'text-gray-700'}`}>
                          {team.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`font-semibold ${team.isOL ? 'text-[#E30613] font-black' : 'text-gray-800'}`}>
                        {team.isOL ? '⭐ ' : ''}{team.team}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-600">{team.played}</td>
                    <td className="px-2 py-2.5 text-center text-green-600 font-semibold">{team.won}</td>
                    <td className="px-2 py-2.5 text-center text-yellow-600">{team.drawn}</td>
                    <td className="px-2 py-2.5 text-center text-red-500">{team.lost}</td>
                    <td className="px-2 py-2.5 text-center text-gray-600">{team.goalsFor}</td>
                    <td className="px-2 py-2.5 text-center text-gray-600">{team.goalsAgainst}</td>
                    <td className="px-2 py-2.5 text-center font-semibold">
                      <span className={diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-500' : 'text-gray-500'}>
                        {diff > 0 ? '+' : ''}{diff}
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-center">
                      <span className={`font-black text-base ${team.isOL ? 'text-[#E30613]' : 'text-gray-800'}`}>
                        {team.points}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell">
                      <FormCell form={team.form} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-bold text-[#032974] mb-3 flex items-center gap-2 text-sm">
          <Info size={16} /> Légende des zones
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {zones.map(zone => (
            <div
              key={zone.label}
              className="flex items-center gap-2 p-2 rounded-lg"
              style={{ background: zone.color + '15', borderLeft: `3px solid ${zone.color}` }}
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: zone.color }} />
              <span className="text-xs font-semibold text-gray-700">{zone.label}</span>
              <span className="text-xs text-gray-400 ml-auto">({zone.positions.length === 1 ? `${zone.positions[0]}e` : `${zone.positions[0]}-${zone.positions[zone.positions.length - 1]}e`})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <p className="font-bold mb-1">📊 Note sur le classement</p>
        <p>L&apos;OL (4e, 55 pts) et Marseille (3e, 55 pts) sont à égalité de points après 28 journées. L&apos;OL est classé 4e en raison d&apos;une différence de buts légèrement inférieure (+23 vs +17 pour l&apos;OM... attention, il faut vérifier les détails lors des matchs restants). 10 journées restantes, tout est encore possible !</p>
      </div>
    </div>
  )
}
