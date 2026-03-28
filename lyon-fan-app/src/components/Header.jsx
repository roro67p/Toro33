import { Trophy, Star, Zap } from 'lucide-react'
import { matches } from '../data/matches.js'

const todayStr = new Date().toISOString().split('T')[0]
const todayMatch = matches.find(m => m.date === todayStr)

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-[#032974] via-[#053080] to-black text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-4">
            {/* OL Logo */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-[#E30613]">
                <div className="text-center leading-none">
                  <span className="text-[#032974] font-black text-xl block">OL</span>
                </div>
              </div>
              {/* Gold star above logo */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#FFD700] text-xs">★</div>
            </div>

            {/* Club info */}
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none">
                Olympique <span className="text-[#E30613]">Lyonnais</span>
              </h1>
              <p className="text-blue-200 text-sm mt-0.5 font-medium">
                Les Gones • Fondé en 1950
              </p>
            </div>
          </div>

          {/* Center — 7x Champions badge */}
          <div className="hidden md:flex flex-col items-center gap-1">
            <div className="flex items-center gap-1 text-[#FFD700]">
              {[...Array(7)].map((_, i) => (
                <Star key={i} size={14} fill="#FFD700" />
              ))}
            </div>
            <span className="text-xs text-[#FFD700] font-bold tracking-widest uppercase">
              7× Champions de France
            </span>
          </div>

          {/* Right side — season + live match */}
          <div className="flex flex-col items-end gap-2">
            <div className="bg-[#E30613] text-white text-xs font-bold px-3 py-1 rounded-full">
              Saison 2025 / 2026
            </div>

            {todayMatch ? (
              <div className="flex items-center gap-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                <Zap size={12} />
                <span>
                  {todayMatch.status === 'live'
                    ? 'MATCH EN DIRECT'
                    : `Match ce soir — ${todayMatch.homeTeam} vs ${todayMatch.awayTeam} ${todayMatch.time}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-blue-200 text-xs">
                <Trophy size={12} />
                <span>Allez l&apos;OL !</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar — tagline */}
        <div className="mt-3 pt-3 border-t border-white/10 text-center">
          <p className="text-blue-200/70 text-xs italic tracking-wider">
            "Le football, c'est une religion à Lyon" — Tout pour les Gones
          </p>
        </div>
      </div>
    </header>
  )
}
