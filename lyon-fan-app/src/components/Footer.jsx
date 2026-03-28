import { ExternalLink, Heart } from 'lucide-react'

const links = [
  { label: 'Site Officiel', href: 'https://www.ol.fr' },
  { label: 'Boutique',      href: 'https://boutique.ol.fr' },
  { label: 'Billetterie',   href: 'https://billetterie.ol.fr' },
  { label: 'Académie',      href: 'https://www.ol.fr/academie' },
]

const socials = [
  { label: 'X / Twitter', icon: '𝕏', href: 'https://twitter.com/OL' },
  { label: 'Instagram',   icon: '📷', href: 'https://instagram.com/ol' },
  { label: 'Facebook',    icon: 'f',  href: 'https://facebook.com/ol' },
  { label: 'YouTube',     icon: '▶',  href: 'https://youtube.com/ol' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-black via-[#021a4a] to-[#032974] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border-2 border-[#E30613]">
                <span className="text-[#032974] font-black text-base">OL</span>
              </div>
              <div>
                <p className="font-black text-lg leading-none">Olympique Lyonnais</p>
                <p className="text-blue-200 text-xs">Fondé le 3 août 1950</p>
              </div>
            </div>
            <p className="text-[#FFD700] font-bold text-sm mb-1">🏆 7 fois Champions de France</p>
            <p className="text-[#FFD700] text-xs">2002 · 2003 · 2004 · 2005 · 2006 · 2007 · 2008</p>
            <p className="text-blue-200/60 text-xs mt-2">Domination inégalée dans l'histoire du football français</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#E30613] mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    <ExternalLink size={12} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-[#E30613] mb-4">Réseaux sociaux</h3>
            <div className="flex gap-3 mb-6">
              {socials.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 bg-white/10 hover:bg-[#E30613] rounded-full flex items-center justify-center text-sm font-bold transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
            <p className="text-blue-200/60 text-xs">
              Groupama Stadium · Décines-Charpieu<br />
              59 186 places · Ouvert depuis 2016
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-200/50">
          <p>Application fan non-officielle · Saison 2025/2026</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart size={11} fill="#E30613" color="#E30613" /> par des supporters lyonnais
          </p>
          <p>© 2026 OL Fan App · Tous droits réservés</p>
        </div>
      </div>
    </footer>
  )
}
