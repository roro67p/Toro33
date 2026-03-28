export const competitions = {
  L1: { name: "Ligue 1 McDonald's", short: "L1", color: "#032974", logo: "⚽" },
  CDL: { name: "Coupe de la Ligue", short: "CDL", color: "#E30613", logo: "🏆" },
  CDF: { name: "Coupe de France", short: "CDF", color: "#FFD700", logo: "🥇" },
  EL: { name: "Europa League", short: "EL", color: "#FF6900", logo: "🌍" },
  TC: { name: "Trophée des Champions", short: "TC", color: "#C0C0C0", logo: "🏅" }
}

// Statuts: 'played' | 'upcoming' | 'live'
export const matches = [
  // ── LIGUE 1 – JOURNÉE 1 ───────────────────────────────────────
  { id: 1, date: "2025-08-10", time: "17:00", homeTeam: "OL", awayTeam: "Strasbourg", homeScore: 3, awayScore: 0, competition: "L1", matchday: 1, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 14'", "Mikautadze 44'", "Orban 71'"], attendance: 52800, motm: "Lacazette" },
  { id: 2, date: "2025-08-17", time: "20:45", homeTeam: "Nice", awayTeam: "OL", homeScore: 1, awayScore: 2, competition: "L1", matchday: 2, venue: "Allianz Riviera", status: "played", scorers: ["Cherki 23'", "Nuamah 58'"], attendance: 35000, motm: "Cherki" },
  { id: 3, date: "2025-08-24", time: "17:00", homeTeam: "OL", awayTeam: "Nantes", homeScore: 2, awayScore: 2, competition: "L1", matchday: 3, venue: "Groupama Stadium", status: "played", scorers: ["Mikautadze 8'", "Tolisso 61'"], attendance: 49200, motm: "Mikautadze" },
  { id: 4, date: "2025-09-01", time: "21:00", homeTeam: "Lens", awayTeam: "OL", homeScore: 0, awayScore: 1, competition: "L1", matchday: 4, venue: "Stade Bollaert", status: "played", scorers: ["Lacazette 77'"], attendance: 38000, motm: "Perri" },
  { id: 5, date: "2025-09-14", time: "17:00", homeTeam: "OL", awayTeam: "Montpellier", homeScore: 4, awayScore: 1, competition: "L1", matchday: 5, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 12'", "Fofana 31'", "Cherki 54'", "Orban 88'"], attendance: 51000, motm: "Fofana" },
  { id: 6, date: "2025-09-20", time: "20:45", homeTeam: "Rennes", awayTeam: "OL", homeScore: 1, awayScore: 1, competition: "L1", matchday: 6, venue: "Roazhon Park", status: "played", scorers: ["Nuamah 45'"], attendance: 27000, motm: "Kumbedi" },
  { id: 7, date: "2025-09-28", time: "21:00", homeTeam: "OL", awayTeam: "PSG", homeScore: 1, awayScore: 3, competition: "L1", matchday: 7, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 39'"], attendance: 58000, motm: "Lacazette" },
  { id: 8, date: "2025-10-05", time: "17:00", homeTeam: "Toulouse", awayTeam: "OL", homeScore: 0, awayScore: 2, competition: "L1", matchday: 8, venue: "Stadium TFC", status: "played", scorers: ["Mikautadze 28'", "Gnonto 70'"], attendance: 30000, motm: "Mikautadze" },
  { id: 9, date: "2025-10-19", time: "17:00", homeTeam: "OL", awayTeam: "Brest", homeScore: 3, awayScore: 1, competition: "L1", matchday: 9, venue: "Groupama Stadium", status: "played", scorers: ["Cherki 10'", "Lacazette 48'", "Orban 81'"], attendance: 50500, motm: "Orban" },
  { id: 10, date: "2025-10-26", time: "20:45", homeTeam: "Monaco", awayTeam: "OL", homeScore: 2, awayScore: 1, competition: "L1", matchday: 10, venue: "Stade Louis II", status: "played", scorers: ["Lacazette 63'"], attendance: 18000, motm: "Perri" },
  { id: 11, date: "2025-11-02", time: "17:00", homeTeam: "OL", awayTeam: "Reims", homeScore: 2, awayScore: 0, competition: "L1", matchday: 11, venue: "Groupama Stadium", status: "played", scorers: ["Fofana 22'", "Lacazette 55'"], attendance: 46800, motm: "Fofana" },
  { id: 12, date: "2025-11-09", time: "21:00", homeTeam: "Le Havre", awayTeam: "OL", homeScore: 0, awayScore: 3, competition: "L1", matchday: 12, venue: "Stade Océane", status: "played", scorers: ["Mikautadze 14'", "Mikautadze 44'", "Cherki 89'"], attendance: 24000, motm: "Mikautadze" },
  { id: 13, date: "2025-11-23", time: "17:00", homeTeam: "OL", awayTeam: "Marseille", homeScore: 1, awayScore: 1, competition: "L1", matchday: 13, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 76'"], attendance: 58000, motm: "O'Brien" },
  { id: 14, date: "2025-11-30", time: "20:45", homeTeam: "Auxerre", awayTeam: "OL", homeScore: 1, awayScore: 2, competition: "L1", matchday: 14, venue: "Abbé-Deschamps", status: "played", scorers: ["Nuamah 33'", "Orban 62'"], attendance: 18500, motm: "Nuamah" },
  { id: 15, date: "2025-12-07", time: "17:00", homeTeam: "OL", awayTeam: "Angers", homeScore: 3, awayScore: 0, competition: "L1", matchday: 15, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 21'", "Gnonto 48'", "Lepenant 77'"], attendance: 47600, motm: "Lacazette" },
  { id: 16, date: "2025-12-14", time: "21:00", homeTeam: "Lille", awayTeam: "OL", homeScore: 2, awayScore: 2, competition: "L1", matchday: 16, venue: "Stade Pierre-Mauroy", status: "played", scorers: ["Cherki 8'", "Tolisso 71'"], attendance: 48000, motm: "Tolisso" },
  { id: 17, date: "2025-12-21", time: "17:00", homeTeam: "OL", awayTeam: "Saint-Étienne", homeScore: 3, awayScore: 1, competition: "L1", matchday: 17, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 12'", "Lacazette 34'", "Orban 68'"], attendance: 58000, motm: "Lacazette", isDerby: true },
  { id: 18, date: "2026-01-11", time: "17:00", homeTeam: "Strasbourg", awayTeam: "OL", homeScore: 0, awayScore: 1, competition: "L1", matchday: 18, venue: "Stade de la Meinau", status: "played", scorers: ["Cherki 54'"], attendance: 26000, motm: "Perri" },
  { id: 19, date: "2026-01-18", time: "20:45", homeTeam: "OL", awayTeam: "Nice", homeScore: 2, awayScore: 1, competition: "L1", matchday: 19, venue: "Groupama Stadium", status: "played", scorers: ["Mikautadze 37'", "Gnonto 82'"], attendance: 50200, motm: "Gnonto" },
  { id: 20, date: "2026-01-25", time: "17:00", homeTeam: "Nantes", awayTeam: "OL", homeScore: 1, awayScore: 3, competition: "L1", matchday: 20, venue: "La Beaujoire", status: "played", scorers: ["Orban 19'", "Cherki 44'", "Nuamah 78'"], attendance: 33000, motm: "Orban" },
  { id: 21, date: "2026-02-01", time: "21:00", homeTeam: "OL", awayTeam: "Lens", homeScore: 1, awayScore: 0, competition: "L1", matchday: 21, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 90+2'"], attendance: 53400, motm: "Lacazette" },
  { id: 22, date: "2026-02-08", time: "17:00", homeTeam: "Montpellier", awayTeam: "OL", homeScore: 0, awayScore: 2, competition: "L1", matchday: 22, venue: "Stade de la Mosson", status: "played", scorers: ["Fofana 15'", "Lacazette 70'"], attendance: 25000, motm: "Fofana" },
  { id: 23, date: "2026-02-15", time: "20:45", homeTeam: "OL", awayTeam: "Rennes", homeScore: 0, awayScore: 0, competition: "L1", matchday: 23, venue: "Groupama Stadium", status: "played", scorers: [], attendance: 48900, motm: "Perri" },
  { id: 24, date: "2026-02-22", time: "17:00", homeTeam: "PSG", awayTeam: "OL", homeScore: 2, awayScore: 0, competition: "L1", matchday: 24, venue: "Parc des Princes", status: "played", scorers: [], attendance: 47000, motm: null },
  { id: 25, date: "2026-03-01", time: "17:00", homeTeam: "OL", awayTeam: "Toulouse", homeScore: 2, awayScore: 1, competition: "L1", matchday: 25, venue: "Groupama Stadium", status: "played", scorers: ["Mikautadze 28'", "Cherki 62'"], attendance: 49100, motm: "Cherki" },
  { id: 26, date: "2026-03-08", time: "21:00", homeTeam: "Brest", awayTeam: "OL", homeScore: 1, awayScore: 2, competition: "L1", matchday: 26, venue: "Stade Francis-Le Blé", status: "played", scorers: ["Orban 41'", "Nuamah 86'"], attendance: 15000, motm: "Nuamah" },
  { id: 27, date: "2026-03-15", time: "17:00", homeTeam: "OL", awayTeam: "Monaco", homeScore: 1, awayScore: 2, competition: "L1", matchday: 27, venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 23'"], attendance: 54200, motm: "Perri" },
  { id: 28, date: "2026-03-22", time: "20:45", homeTeam: "Reims", awayTeam: "OL", homeScore: 0, awayScore: 2, competition: "L1", matchday: 28, venue: "Stade Auguste-Delaune", status: "played", scorers: ["Mikautadze 33'", "Lacazette 75'"], attendance: 20000, motm: "Mikautadze" },

  // Matchday 29 - aujourd'hui (28 mars 2026) - match à venir
  { id: 29, date: "2026-03-28", time: "21:00", homeTeam: "OL", awayTeam: "Lille", homeScore: null, awayScore: null, competition: "L1", matchday: 29, venue: "Groupama Stadium", status: "upcoming", scorers: [], attendance: null, motm: null },

  // Journées futures
  { id: 30, date: "2026-04-05", time: "17:00", homeTeam: "Angers", awayTeam: "OL", homeScore: null, awayScore: null, competition: "L1", matchday: 30, venue: "Stade Raymond-Kopa", status: "upcoming", scorers: [], attendance: null, motm: null },
  { id: 31, date: "2026-04-12", time: "20:45", homeTeam: "OL", awayTeam: "Le Havre", homeScore: null, awayScore: null, competition: "L1", matchday: 31, venue: "Groupama Stadium", status: "upcoming", scorers: [], attendance: null, motm: null },
  { id: 32, date: "2026-04-19", time: "17:00", homeTeam: "Marseille", awayTeam: "OL", homeScore: null, awayScore: null, competition: "L1", matchday: 32, venue: "Stade Vélodrome", status: "upcoming", scorers: [], attendance: null, motm: null },
  { id: 33, date: "2026-04-26", time: "20:45", homeTeam: "OL", awayTeam: "Auxerre", homeScore: null, awayScore: null, competition: "L1", matchday: 33, venue: "Groupama Stadium", status: "upcoming", scorers: [], attendance: null, motm: null },
  { id: 34, date: "2026-05-10", time: "17:00", homeTeam: "Saint-Étienne", awayTeam: "OL", homeScore: null, awayScore: null, competition: "L1", matchday: 34, venue: "Stade Geoffroy-Guichard", status: "upcoming", scorers: [], attendance: null, motm: null, isDerby: true },

  // ── EUROPA LEAGUE ─────────────────────────────────────────────
  { id: 50, date: "2025-09-18", time: "21:00", homeTeam: "OL", awayTeam: "Hoffenheim", homeScore: 2, awayScore: 0, competition: "EL", matchday: "Phase de ligue J1", venue: "Groupama Stadium", status: "played", scorers: ["Cherki 18'", "Mikautadze 56'"], attendance: 47000 },
  { id: 51, date: "2025-10-03", time: "21:00", homeTeam: "Athletic Bilbao", awayTeam: "OL", homeScore: 1, awayScore: 1, competition: "EL", matchday: "Phase de ligue J2", venue: "San Mamés", status: "played", scorers: ["Lacazette 44'"], attendance: 53000 },
  { id: 52, date: "2025-10-23", time: "21:00", homeTeam: "OL", awayTeam: "AZ Alkmaar", homeScore: 3, awayScore: 1, competition: "EL", matchday: "Phase de ligue J3", venue: "Groupama Stadium", status: "played", scorers: ["Nuamah 12'", "Orban 38'", "Fofana 73'"], attendance: 44000 },
  { id: 53, date: "2025-11-07", time: "21:00", homeTeam: "Galatasaray", awayTeam: "OL", homeScore: 2, awayScore: 2, competition: "EL", matchday: "Phase de ligue J4", venue: "Rams Park", status: "played", scorers: ["Mikautadze 29'", "Lacazette 67'"], attendance: 51000 },
  { id: 54, date: "2025-11-27", time: "21:00", homeTeam: "OL", awayTeam: "Ferencváros", homeScore: 4, awayScore: 0, competition: "EL", matchday: "Phase de ligue J5", venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 9'", "Cherki 22'", "Orban 55'", "Gnonto 79'"], attendance: 43500 },
  { id: 55, date: "2025-12-11", time: "21:00", homeTeam: "Eintracht Frankfurt", awayTeam: "OL", homeScore: 1, awayScore: 0, competition: "EL", matchday: "Phase de ligue J6", venue: "Deutsche Bank Park", status: "played", scorers: [], attendance: 58000 },
  { id: 56, date: "2026-01-23", time: "21:00", homeTeam: "OL", awayTeam: "AS Roma", homeScore: 1, awayScore: 0, competition: "EL", matchday: "Phase de ligue J7", venue: "Groupama Stadium", status: "played", scorers: ["Nuamah 71'"], attendance: 52000 },
  { id: 57, date: "2026-02-05", time: "21:00", homeTeam: "Tottenham", awayTeam: "OL", homeScore: 2, awayScore: 1, competition: "EL", matchday: "Phase de ligue J8", venue: "Tottenham Hotspur Stadium", status: "played", scorers: ["Lacazette 33'"], attendance: 62000 },
  // Barrage EL
  { id: 58, date: "2026-02-19", time: "21:00", homeTeam: "OL", awayTeam: "Braga", homeScore: 2, awayScore: 0, competition: "EL", matchday: "Barrage aller", venue: "Groupama Stadium", status: "played", scorers: ["Mikautadze 37'", "Cherki 54'"], attendance: 53000 },
  { id: 59, date: "2026-02-26", time: "21:00", homeTeam: "Braga", awayTeam: "OL", homeScore: 1, awayScore: 1, competition: "EL", matchday: "Barrage retour", venue: "Estádio Municipal de Braga", status: "played", scorers: ["Lacazette 28'"], attendance: 30000 },
  // 8ème EL
  { id: 60, date: "2026-03-12", time: "21:00", homeTeam: "OL", awayTeam: "Lazio Roma", homeScore: 2, awayScore: 1, competition: "EL", matchday: "8ème aller", venue: "Groupama Stadium", status: "played", scorers: ["Orban 19'", "Nuamah 62'"], attendance: 56000 },
  { id: 61, date: "2026-03-19", time: "21:00", homeTeam: "Lazio Roma", awayTeam: "OL", homeScore: 0, awayScore: 1, competition: "EL", matchday: "8ème retour", venue: "Stadio Olimpico", status: "played", scorers: ["Lacazette 85'"], attendance: 65000 },
  // Quart EL
  { id: 62, date: "2026-04-10", time: "21:00", homeTeam: "OL", awayTeam: "Ajax", homeScore: null, awayScore: null, competition: "EL", matchday: "Quart aller", venue: "Groupama Stadium", status: "upcoming", scorers: [], attendance: null },
  { id: 63, date: "2026-04-17", time: "21:00", homeTeam: "Ajax", awayTeam: "OL", homeScore: null, awayScore: null, competition: "EL", matchday: "Quart retour", venue: "Johan Cruyff Arena", status: "upcoming", scorers: [], attendance: null },

  // ── COUPE DE FRANCE ───────────────────────────────────────────
  { id: 70, date: "2026-01-05", time: "20:45", homeTeam: "OL", awayTeam: "Quevilly-Rouen", homeScore: 5, awayScore: 0, competition: "CDF", matchday: "32èmes de finale", venue: "Groupama Stadium", status: "played", scorers: ["Gnonto 8'", "Orban 22'", "Orban 44'", "Baldé 63'", "Mikautadze 77'"], attendance: 21000 },
  { id: 71, date: "2026-01-29", time: "20:45", homeTeam: "OL", awayTeam: "Valenciennes", homeScore: 3, awayScore: 1, competition: "CDF", matchday: "16èmes de finale", venue: "Groupama Stadium", status: "played", scorers: ["Cherki 18'", "Lacazette 52'", "Fofana 80'"], attendance: 28000 },
  { id: 72, date: "2026-02-18", time: "20:45", homeTeam: "Lens", awayTeam: "OL", homeScore: 0, awayScore: 2, competition: "CDF", matchday: "8èmes de finale", venue: "Stade Bollaert", status: "played", scorers: ["Mikautadze 35'", "Nuamah 68'"], attendance: 36000 },
  { id: 73, date: "2026-03-25", time: "20:45", homeTeam: "OL", awayTeam: "Monaco", homeScore: 1, awayScore: 1, competition: "CDF", matchday: "Quart de finale", venue: "Groupama Stadium", status: "played", scorers: ["Lacazette 44'"], note: "Victoire aux TAB 4-3", attendance: 57000 },
  { id: 74, date: "2026-04-22", time: "20:45", homeTeam: "OL", awayTeam: "Marseille", homeScore: null, awayScore: null, competition: "CDF", matchday: "Demi-finale", venue: "Stade de France", status: "upcoming", scorers: [], attendance: null },
]

export const getLastMatch = () => {
  const played = matches.filter(m => m.status === 'played' && (m.homeTeam === 'OL' || m.awayTeam === 'OL'))
  return played[played.length - 1]
}

export const getNextMatch = () => {
  return matches.find(m => m.status === 'upcoming' && (m.homeTeam === 'OL' || m.awayTeam === 'OL'))
}

export const getMatchResult = (match) => {
  if (!match || match.status !== 'played') return null
  const isHome = match.homeTeam === 'OL'
  const olScore = isHome ? match.homeScore : match.awayScore
  const oppScore = isHome ? match.awayScore : match.homeScore
  if (olScore > oppScore) return 'W'
  if (olScore < oppScore) return 'L'
  return 'D'
}

export const getSeasonForm = (last = 5) => {
  const played = matches
    .filter(m => m.status === 'played' && m.competition === 'L1' && (m.homeTeam === 'OL' || m.awayTeam === 'OL'))
  return played.slice(-last).map(m => getMatchResult(m))
}

export const getSeasonStats = () => {
  const l1 = matches.filter(m => m.competition === 'L1' && m.status === 'played' && (m.homeTeam === 'OL' || m.awayTeam === 'OL'))
  let w = 0, d = 0, l = 0, gf = 0, ga = 0
  l1.forEach(m => {
    const isHome = m.homeTeam === 'OL'
    const olScore = isHome ? m.homeScore : m.awayScore
    const oppScore = isHome ? m.awayScore : m.homeScore
    gf += olScore
    ga += oppScore
    if (olScore > oppScore) w++
    else if (olScore === oppScore) d++
    else l++
  })
  return { played: l1.length, w, d, l, gf, ga, points: w * 3 + d }
}
