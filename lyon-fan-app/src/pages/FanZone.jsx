import { useState } from 'react'
import { BarChart2, HelpCircle, Star, Image, Music } from 'lucide-react'
import useAppStore from '../store/useAppStore.js'

// ─── POLL DATA ─────────────────────────────────────────────────
const pollOptions = [
  { id: 'w2', label: 'Victoire 2-0', emoji: '✅', initialVotes: 312 },
  { id: 'w1', label: 'Victoire 1-0', emoji: '💪', initialVotes: 245 },
  { id: 'w3', label: 'Victoire 3-1', emoji: '🔥', initialVotes: 189 },
  { id: 'd',  label: 'Match nul',    emoji: '🤝', initialVotes: 98  },
  { id: 'l',  label: 'Défaite',      emoji: '😬', initialVotes: 34  },
]

// ─── QUIZ DATA ─────────────────────────────────────────────────
const quizQuestions = [
  {
    question: "En quelle année l'OL a-t-il remporté son premier titre de Champion de France ?",
    options: ['1998', '2000', '2002', '2004'],
    answer: 2,
    explanation: "L'OL a été sacré Champion de France pour la première fois en 2002, lançant une série historique de 7 titres consécutifs."
  },
  {
    question: "Quel joueur est le meilleur buteur de l'histoire de l'OL ?",
    options: ['Sonny Anderson', 'Sidney Govou', 'Karim Benzema', 'Alexandre Lacazette'],
    answer: 3,
    explanation: "Alexandre Lacazette dépasse Sonny Anderson (107 buts) avec plus de 172 buts au total sous le maillot lyonnais."
  },
  {
    question: "Quelle est la capacité du Groupama Stadium ?",
    options: ['50 000', '55 000', '59 186', '65 000'],
    answer: 2,
    explanation: "Le Groupama Stadium à Décines-Charpieu accueille 59 186 spectateurs, en faisant le plus grand stade de club en France."
  },
  {
    question: "Rayan Cherki est-il né à Lyon ou à Strasbourg ?",
    options: ['Lyon', 'Strasbourg', 'Villeurbanne', 'Décines'],
    answer: 0,
    explanation: "Rayan Cherki est né le 17 août 2003 à Lyon. Il est formé à l'OL depuis l'âge de 9 ans."
  },
  {
    question: "Contre quel club l'OL a-t-il joué le 'Derby' le plus célèbre de France ?",
    options: ['Marseille', 'Monaco', 'Saint-Étienne', 'PSG'],
    answer: 2,
    explanation: "Le Derby du Rhône, OL vs ASSE (Saint-Étienne), est l'une des rivalités les plus intenses du football français."
  },
]

// ─── RATING PLAYERS ────────────────────────────────────────────
const ratingPlayers = [
  { id: 'perri',    name: 'Lucas Perri',         pos: 'GK',  number: 1  },
  { id: 'kumbedi',  name: 'Saël Kumbedi',        pos: 'DEF', number: 22 },
  { id: 'obrien',   name: "Jake O'Brien",         pos: 'DEF', number: 5  },
  { id: 'tolisso',  name: 'Corentin Tolisso',     pos: 'MID', number: 8  },
  { id: 'lepenant', name: 'Johann Lepenant',      pos: 'MID', number: 29 },
  { id: 'cherki',   name: 'Rayan Cherki',         pos: 'ATT', number: 18 },
  { id: 'nuamah',   name: 'Ernest Nuamah',        pos: 'ATT', number: 7  },
  { id: 'lacazette',name: 'Alexandre Lacazette',  pos: 'ATT', number: 9  },
  { id: 'mikautadze',name: 'Georges Mikautadze',  pos: 'ATT', number: 77 },
]

// ─── GALLERY ───────────────────────────────────────────────────
const gallery = [
  { emoji: '🏆', title: 'Qualification Europa League', date: '19 mars 2026', desc: 'Lacazette marque à la 85e à Rome et qualifie l\'OL en quarts !' },
  { emoji: '🔥', title: 'Derby OL - ASSE 3-1', date: '21 décembre 2025', desc: 'Lacazette s\'offre un doublé dans le Derby du Rhône devant 58 000 supporters en fête.' },
  { emoji: '⭐', title: 'Cherki, 1ère en Équipe de France', date: '24 mars 2026', desc: 'Le joyau lyonnais convoqué pour la première fois chez les Bleus par Deschamps.' },
  { emoji: '🌍', title: 'OL - Lazio 2-1 au Groupama', date: '12 mars 2026', desc: 'Un Groupama Stadium en feu pour les 8es de finale d\'Europa League !' },
  { emoji: '⚽', title: 'Mikautadze hat-trick vs Montpellier', date: '14 septembre 2025', desc: 'Le Géorgien s\'illustre avec un doublé en 5 matchs. Saison de rêve.' },
  { emoji: '🎉', title: 'Pierre Sage prolongé jusqu\'en 2028', date: '5 mars 2026', desc: 'Le coach lyonnais prolonge et confirme sa confiance dans le projet OL.' },
]

// ─── CHANTS ────────────────────────────────────────────────────
const chants = [
  {
    title: "Allez l'OL (chant officiel)",
    lyrics: `Allez l'OL, allez l'OL !
On est les Gones, les plus forts de France
On a le cœur, on a la chance
Allez l'OL, allez l'OL !
Rouge et bleu jusqu'à la mort !`
  },
  {
    title: "Les supporters du Virage Nord",
    lyrics: `Qui ne saute pas n'est pas Lyonnais !
Qui ne saute pas n'est pas Lyonnais !
(saut répété)
Allez Lyon !`
  },
  {
    title: "Hommage à Lacazette",
    lyrics: `Lacazette, Lacazette !
Il est Lyonnais, il est Lyonnais !
Lacazette, notre capitaine
On t'aime jusqu'à la dernière peine !`
  },
  {
    title: "Sept titres consécutifs",
    lyrics: `Sept fois champions, sept fois champions !
Personne n'a fait mieux en France, non non non !
De 2002 à 2008
Les Gones ont régné en maîtres absolus !`
  },
]

// ─── SUBCOMPONENTS ─────────────────────────────────────────────
function Poll() {
  const [votes, setVotes] = useState(pollOptions.map(o => o.initialVotes))
  const [voted, setVoted] = useState(null)
  const total = votes.reduce((a, b) => a + b, 0)

  const handleVote = (idx) => {
    if (voted !== null) return
    setVoted(idx)
    setVotes(prev => prev.map((v, i) => i === idx ? v + 1 : v))
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#032974] text-white rounded-xl p-4">
        <p className="font-black text-lg mb-1">📊 Sondage du moment</p>
        <p className="text-blue-200">Quel sera le résultat d&apos;OL vs Lille ce soir ?</p>
      </div>

      <div className="space-y-3">
        {pollOptions.map((option, idx) => {
          const pct = total > 0 ? Math.round((votes[idx] / total) * 100) : 0
          const isSelected = voted === idx
          return (
            <button
              key={option.id}
              onClick={() => handleVote(idx)}
              disabled={voted !== null}
              className={`w-full text-left rounded-xl border-2 overflow-hidden transition-all
                ${voted !== null ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}
                ${isSelected ? 'border-[#E30613]' : 'border-gray-200'}`}
            >
              <div className="p-3 relative">
                {voted !== null && (
                  <div
                    className={`absolute inset-0 rounded-xl transition-all ${isSelected ? 'bg-[#E30613]/15' : 'bg-gray-100'}`}
                    style={{ width: `${pct}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{option.emoji}</span>
                    <span className={`font-semibold ${isSelected ? 'text-[#E30613]' : 'text-gray-800'}`}>{option.label}</span>
                  </div>
                  {voted !== null && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{votes[idx]} votes</span>
                      <span className={`font-black text-sm ${isSelected ? 'text-[#E30613]' : 'text-gray-600'}`}>{pct}%</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {voted !== null ? (
        <p className="text-center text-sm text-gray-500">
          Vous avez voté pour : <strong className="text-[#E30613]">{pollOptions[voted].label}</strong> · {total} votes au total
        </p>
      ) : (
        <p className="text-center text-xs text-gray-400">Cliquez pour voter — {total} votes</p>
      )}
    </div>
  )
}

function Quiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState([])

  const q = quizQuestions[currentQ]

  const handleAnswer = (idx) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === q.answer
    if (correct) setScore(s => s + 1)
    setAnswers(prev => [...prev, { selected: idx, correct }])
  }

  const handleNext = () => {
    if (currentQ + 1 >= quizQuestions.length) {
      setFinished(true)
    } else {
      setCurrentQ(c => c + 1)
      setSelected(null)
    }
  }

  const handleReset = () => {
    setCurrentQ(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setAnswers([])
  }

  if (finished) {
    const pct = Math.round((score / quizQuestions.length) * 100)
    return (
      <div className="space-y-4 text-center">
        <div className="text-6xl">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
        <h3 className="text-2xl font-black text-[#032974]">Quiz terminé !</h3>
        <p className="text-4xl font-black text-[#E30613]">{score} / {quizQuestions.length}</p>
        <p className="text-gray-600">{pct >= 80 ? 'Bravo, vous êtes un vrai supporter lyonnais !' : pct >= 60 ? 'Bon score ! Encore un peu de révisions...' : 'Il faut revoir l\'histoire de l\'OL !'}</p>

        <div className="space-y-2 text-left mt-4">
          {quizQuestions.map((question, i) => (
            <div key={i} className={`p-3 rounded-lg text-sm ${answers[i]?.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-semibold">{answers[i]?.correct ? '✅' : '❌'} {question.question}</p>
              {!answers[i]?.correct && <p className="text-xs text-gray-500 mt-1">{question.explanation}</p>}
            </div>
          ))}
        </div>

        <button onClick={handleReset} className="bg-[#E30613] text-white font-bold px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
          Rejouer
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">Question {currentQ + 1} / {quizQuestions.length}</span>
        <div className="flex gap-1">
          {quizQuestions.map((_, i) => (
            <div key={i} className={`w-6 h-1.5 rounded-full ${i < currentQ ? 'bg-[#032974]' : i === currentQ ? 'bg-[#E30613]' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      <div className="bg-[#032974] text-white rounded-xl p-4">
        <p className="font-bold text-base">{q.question}</p>
      </div>

      <div className="space-y-2">
        {q.options.map((opt, idx) => {
          let style = 'bg-white border-2 border-gray-200 text-gray-800 hover:border-[#032974]'
          if (selected !== null) {
            if (idx === q.answer) style = 'bg-green-50 border-2 border-green-500 text-green-800'
            else if (idx === selected) style = 'bg-red-50 border-2 border-red-400 text-red-700'
            else style = 'bg-gray-50 border-2 border-gray-200 text-gray-500 opacity-60'
          }

          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all text-sm ${style} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="font-black mr-2">{['A', 'B', 'C', 'D'][idx]}.</span> {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div>
          <p className={`text-sm p-3 rounded-lg mb-3 ${selected === q.answer ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {selected === q.answer ? '✅ Bonne réponse !' : `❌ Mauvaise réponse. ${q.explanation}`}
          </p>
          <button onClick={handleNext} className="w-full bg-[#032974] text-white font-bold py-3 rounded-xl hover:bg-[#053da0] transition-colors">
            {currentQ + 1 >= quizQuestions.length ? 'Voir les résultats' : 'Question suivante →'}
          </button>
        </div>
      )}
    </div>
  )
}

function RatePlayers() {
  const [ratings, setRatings] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const setRating = (playerId, stars) => {
    if (submitted) return
    setRatings(prev => ({ ...prev, [playerId]: stars }))
  }

  const posColor = { GK: 'bg-yellow-400 text-yellow-900', DEF: 'bg-blue-600 text-white', MID: 'bg-green-600 text-white', ATT: 'bg-[#E30613] text-white' }

  const avg = Object.values(ratings).length > 0
    ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
    : null

  return (
    <div className="space-y-4">
      <div className="bg-[#032974] text-white rounded-xl p-4">
        <p className="font-black text-lg mb-1">⭐ Notez les joueurs</p>
        <p className="text-blue-200 text-sm">Dernier match : OL 2-0 Reims (J28)</p>
      </div>

      {submitted ? (
        <div className="text-center space-y-3 py-4">
          <div className="text-5xl">🙏</div>
          <p className="font-black text-[#032974] text-2xl">Merci pour vos notes !</p>
          <p className="text-gray-600">Note moyenne de l&apos;équipe : <strong className="text-[#E30613] text-xl">{avg}/5</strong></p>
          <div className="space-y-1">
            {ratingPlayers.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1 border-b border-gray-100">
                <span className="text-gray-700">{p.name}</span>
                <span className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-sm ${(ratings[p.id] || 0) >= s ? 'text-[#FFD700]' : 'text-gray-200'}`}>★</span>
                  ))}
                  <span className="ml-1 font-bold text-[#032974]">{ratings[p.id] || '—'}</span>
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => { setRatings({}); setSubmitted(false) }} className="bg-gray-200 text-gray-700 font-bold px-5 py-2 rounded-xl hover:bg-gray-300 text-sm">
            Recommencer
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {ratingPlayers.map(p => (
              <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-[#032974] rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {p.number}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{p.name}</p>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${posColor[p.pos]}`}>{p.pos}</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => setRating(p.id, star)}
                      className={`text-2xl transition-transform hover:scale-110 ${(ratings[p.id] || 0) >= star ? 'text-[#FFD700]' : 'text-gray-200'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(ratings).length === 0}
            className="w-full bg-[#E30613] disabled:opacity-50 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Soumettre mes notes
          </button>
          <p className="text-center text-xs text-gray-400">{Object.keys(ratings).length} / {ratingPlayers.length} joueurs notés</p>
        </>
      )}
    </div>
  )
}

function Gallery() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="space-y-4">
      <div className="bg-[#032974] text-white rounded-xl p-4">
        <p className="font-black text-lg mb-1">📸 Galerie de la saison</p>
        <p className="text-blue-200 text-sm">Les moments forts de 2025/26</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className="bg-gradient-to-br from-[#032974] to-[#053da0] text-white rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-0.5 aspect-square flex flex-col items-center justify-center gap-2"
          >
            <span className="text-5xl">{item.emoji}</span>
            <p className="text-xs font-bold leading-tight">{item.title}</p>
            <p className="text-xs text-blue-200">{item.date}</p>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 text-center">
          <div className="text-6xl mb-3">{gallery[selected].emoji}</div>
          <h3 className="font-black text-[#032974] text-lg">{gallery[selected].title}</h3>
          <p className="text-sm text-gray-500 mt-1">{gallery[selected].date}</p>
          <p className="text-gray-600 mt-2">{gallery[selected].desc}</p>
          <button onClick={() => setSelected(null)} className="mt-3 text-xs text-gray-400 hover:text-gray-600">Fermer</button>
        </div>
      )}
    </div>
  )
}

function Chants() {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-4">
      <div className="bg-[#032974] text-white rounded-xl p-4">
        <p className="font-black text-lg mb-1">🎵 Chants des Gones</p>
        <p className="text-blue-200 text-sm">Les classiques du Groupama Stadium</p>
      </div>
      <div className="space-y-3">
        {chants.map((chant, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpen(open === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎵</span>
                <span className="font-bold text-gray-800">{chant.title}</span>
              </div>
              <span className="text-gray-400 text-lg">{open === idx ? '▲' : '▼'}</span>
            </button>
            {open === idx && (
              <div className="px-4 pb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans bg-[#032974]/5 rounded-lg p-3 leading-relaxed">
                  {chant.lyrics}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN FAN ZONE ─────────────────────────────────────────────
const tabsConfig = [
  { id: 'poll',    label: 'Sondage',       Icon: BarChart2, component: Poll },
  { id: 'quiz',    label: 'Quiz',          Icon: HelpCircle, component: Quiz },
  { id: 'rate',    label: 'Notez',         Icon: Star, component: RatePlayers },
  { id: 'gallery', label: 'Galerie',       Icon: Image, component: Gallery },
  { id: 'chants',  label: 'Chants',        Icon: Music, component: Chants },
]

export default function FanZone() {
  const { fanZoneTab, setFanZoneTab } = useAppStore()
  const activeConfig = tabsConfig.find(t => t.id === fanZoneTab)
  const Component = activeConfig?.component || Poll

  return (
    <div className="space-y-5 pb-8">
      <h1 className="text-2xl font-black text-[#032974]">Fan Zone 🔴🔵</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabsConfig.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setFanZoneTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all
              ${fanZoneTab === id
                ? 'bg-[#E30613] text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#E30613] hover:text-[#E30613]'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-5">
        <Component />
      </div>
    </div>
  )
}
