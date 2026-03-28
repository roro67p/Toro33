import { MapPin, Users, Calendar, Award, Bus, Car, Utensils, ShoppingBag, Camera } from 'lucide-react'

const sections = [
  { name: 'Virage Nord', emoji: '🔥', desc: 'Tribune des ultras, la Bad Gones et les Hooligans du Kop. Ambiance la plus électrique.', capacity: '~8 000' },
  { name: 'Tribune Est',  emoji: '🟦', desc: 'Tribune latérale Est, vue optimale sur le jeu et bonne ambiance.', capacity: '~16 000' },
  { name: 'Tribune Ouest', emoji: '🟥', desc: 'Tribune principale, accueil de la presse, des loges VIP et des espaces hospitalité.', capacity: '~18 000' },
  { name: 'Virage Sud',  emoji: '🏳️', desc: 'Tribune des supporters adverses et familles. Vue face au Virage Nord.', capacity: '~6 500' },
]

const facts = [
  '🏗️ Construit en seulement 3 ans (2013-2016) pour un coût de 405 millions d\'euros',
  '🌱 Pelouse chauffée par des câbles enterrés dans le sol',
  '🌧️ Toit entièrement fermé couvrant l\'intégralité des gradins',
  '🔊 Système acoustique parmi les meilleurs d\'Europe',
  '♻️ Certification environnementale HQE (Haute Qualité Environnementale)',
  '🏨 Un hôtel 4 étoiles "Marriott" est intégré au stade',
  '🍽️ Plus de 2 500 m² d\'espaces de restauration',
  '🎥 Le stade a accueilli 3 matchs de l\'Euro 2016, dont un quart de finale',
  '⚽ Record d\'affluence : 59 186 spectateurs pour OL vs Juventus (mars 2018)',
  '🚗 7 000 places de parking directement accessibles depuis le stade',
]

const facilities = [
  { icon: Camera,      name: 'Musée OL', desc: 'L\'histoire du club racontée en 1 000 m² d\'expositions interactives' },
  { icon: Utensils,    name: 'Restaurant', desc: 'Plusieurs restaurants et buvettes, dont le restaurant panoramique "Le Cercle"' },
  { icon: ShoppingBag, name: 'Boutique officielle', desc: 'La plus grande boutique OL, ouverte les jours de match et toute la semaine' },
  { icon: Award,       name: 'Hotel Marriott', desc: 'Hôtel 4 étoiles avec vue sur la pelouse, directement intégré dans l\'enceinte' },
]

export default function Stadium() {
  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Groupama Stadium</h1>

      {/* Hero card */}
      <div className="bg-gradient-to-br from-[#032974] to-[#053da0] text-white rounded-2xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <div className="text-7xl mb-3">🏟️</div>
          <h2 className="text-3xl font-black mb-1">Groupama Stadium</h2>
          <p className="text-blue-200 text-sm">Décines-Charpieu, Métropole de Lyon</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Capacité', value: '59 186', icon: '👥' },
            { label: 'Inauguré', value: '2016', icon: '📅' },
            { label: 'Surface', value: '65 000 m²', icon: '📐' },
            { label: 'Rang', value: '1er de club', icon: '🥇' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
              <p className="text-2xl mb-1">{icon}</p>
              <p className="text-xl font-black">{value}</p>
              <p className="text-xs text-blue-200">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
          <h3 className="font-black text-[#032974] text-lg">Informations générales</h3>
          {[
            { label: 'Nom officiel', value: 'Groupama Stadium', icon: Award },
            { label: 'Anciens noms', value: 'Parc Olympique Lyonnais (2016)', icon: Calendar },
            { label: 'Adresse', value: '10 av. Simone Veil, 69150 Décines-Charpieu', icon: MapPin },
            { label: 'Capacité', value: '59 186 places (bientôt 60 000)', icon: Users },
            { label: 'Architecte', value: 'Cabinet Populous (Londres)', icon: Award },
            { label: 'Coût', value: '405 millions d\'euros', icon: Award },
            { label: 'Propriétaire', value: 'Olympique Lyonnais (OL Groupe)', icon: Award },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={16} className="text-[#E30613] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-semibold text-gray-800">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 space-y-3">
          <h3 className="font-black text-[#032974] text-lg">Records &amp; distinctions</h3>
          <div className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-600 font-bold uppercase">Record d&apos;affluence</p>
              <p className="font-black text-gray-800">59 186 spectateurs</p>
              <p className="text-xs text-gray-500">OL vs Juventus Turin · 8e de finale Ligue des Champions · Mars 2018</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-600 font-bold uppercase">Euro 2016</p>
              <p className="font-black text-gray-800">3 matchs dont 1 quart de finale</p>
              <p className="text-xs text-gray-500">Allemagne vs Italie (quart) · Pologne vs Portugal (quart)</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-600 font-bold uppercase">Label UEFA 5 étoiles</p>
              <p className="font-black text-gray-800">Certification Elite</p>
              <p className="text-xs text-gray-500">L&apos;un des rares stades de France à bénéficier de cette distinction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sections du stade */}
      <div>
        <h2 className="text-xl font-black text-[#032974] mb-4">Plan des tribunes</h2>

        {/* Visual stadium plan */}
        <div className="bg-[#1a472a] rounded-2xl p-6 text-white text-center mb-4 shadow-xl">
          <p className="text-xs text-green-300 mb-4 tracking-widest uppercase">Plan schématique du Groupama Stadium</p>
          <div className="max-w-sm mx-auto space-y-2 font-mono text-sm">
            <div className="bg-red-700/80 rounded-t-full py-2 px-8">🔥 Virage Nord — Bad Gones</div>
            <div className="flex gap-1">
              <div className="flex-1 bg-blue-700/70 rounded-l-full py-8 text-xs leading-tight">
                Tribune<br/>Ouest<br/>VIP
              </div>
              <div className="flex-1 bg-green-800/60 rounded flex items-center justify-center text-green-300 text-xs">
                ⚽ Pelouse ⚽<br/>68 × 105 m
              </div>
              <div className="flex-1 bg-blue-600/70 rounded-r-full py-8 text-xs leading-tight">
                Tribune<br/>Est
              </div>
            </div>
            <div className="bg-gray-600/80 rounded-b-full py-2 px-8">🏳️ Virage Sud — Visiteurs</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sections.map(section => (
            <div key={section.name} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-[#032974]">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{section.emoji}</span>
                <div>
                  <p className="font-black text-gray-800">{section.name}</p>
                  <p className="text-xs text-[#E30613] font-semibold">{section.capacity} places</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{section.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accès */}
      <div className="bg-white rounded-xl shadow-md p-5">
        <h2 className="font-black text-[#032974] text-lg mb-4 flex items-center gap-2">
          <Bus size={20} className="text-[#E30613]" /> Comment y accéder
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Bus size={16} /> En transports en commun</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🚋 <strong>Tramway T7</strong> — Arrêt "Groupama Stadium" (direct depuis Vieux-Lyon)</li>
              <li>🚌 <strong>Bus navette</strong> — Lignes spéciales les soirs de match depuis Part-Dieu</li>
              <li>🚇 <strong>Métro D</strong> → Tram T5 → T7 depuis le centre-ville</li>
              <li>🚆 <strong>Train</strong> — Gare de Meyzieu puis tram T7 (10 min)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Car size={16} /> En voiture</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🛣️ Sortie <strong>Décines / Groupama Stadium</strong> depuis le périphérique est</li>
              <li>🅿️ <strong>7 000 places de parking</strong> P1 à P5 autour du stade</li>
              <li>🚗 Parkings relais disponibles sur les axes A43 et A42</li>
              <li>📍 10 av. Simone Veil, 69150 Décines-Charpieu</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Installations */}
      <div>
        <h2 className="text-xl font-black text-[#032974] mb-4">Installations &amp; services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facilities.map(({ icon: Icon, name, desc }) => (
            <div key={name} className="bg-white rounded-xl shadow-md p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-[#032974] rounded-full flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="font-black text-gray-800">{name}</p>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fun facts */}
      <div className="bg-[#032974] text-white rounded-xl p-6">
        <h2 className="font-black text-xl mb-4 flex items-center gap-2">
          <Camera size={20} className="text-[#FFD700]" /> Le saviez-vous ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {facts.map((fact, i) => (
            <div key={i} className="flex items-start gap-2 bg-white/10 rounded-lg p-3 text-sm">
              {fact}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
