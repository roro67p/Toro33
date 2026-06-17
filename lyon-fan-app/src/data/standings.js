export const standings = [
  { position: 1,  team: "Paris Saint-Germain", short: "PSG",   played: 28, won: 22, drawn: 4, lost: 2, goalsFor: 72, goalsAgainst: 24, points: 70, form: ["W","W","W","D","W"], color: "#004170", isOL: false },
  { position: 2,  team: "Monaco",               short: "MON",   played: 28, won: 18, drawn: 5, lost: 5, goalsFor: 58, goalsAgainst: 33, points: 59, form: ["W","W","L","W","W"], color: "#E4101B", isOL: false },
  { position: 3,  team: "Marseille",             short: "OM",    played: 28, won: 17, drawn: 4, lost: 7, goalsFor: 55, goalsAgainst: 38, points: 55, form: ["D","W","W","L","W"], color: "#2FAEE0", isOL: false },
  { position: 4,  team: "Olympique Lyonnais",    short: "OL",    played: 28, won: 16, drawn: 7, lost: 5, goalsFor: 53, goalsAgainst: 30, points: 55, form: ["W","L","W","W","W"], color: "#E30613", isOL: true  },
  { position: 5,  team: "Lille",                 short: "LOSC",  played: 28, won: 15, drawn: 7, lost: 6, goalsFor: 47, goalsAgainst: 32, points: 52, form: ["D","W","D","W","L"], color: "#D9001B", isOL: false },
  { position: 6,  team: "Nice",                  short: "OGCN",  played: 28, won: 14, drawn: 6, lost: 8, goalsFor: 46, goalsAgainst: 36, points: 48, form: ["L","D","W","W","D"], color: "#EF3340", isOL: false },
  { position: 7,  team: "Lens",                  short: "RCL",   played: 28, won: 13, drawn: 7, lost: 8, goalsFor: 44, goalsAgainst: 35, points: 46, form: ["W","D","L","D","W"], color: "#FFB401", isOL: false },
  { position: 8,  team: "Rennes",                short: "SRFC",  played: 28, won: 12, drawn: 8, lost: 8, goalsFor: 40, goalsAgainst: 38, points: 44, form: ["D","W","D","L","D"], color: "#E43017", isOL: false },
  { position: 9,  team: "Brest",                 short: "SB29",  played: 28, won: 11, drawn: 7, lost: 10, goalsFor: 42, goalsAgainst: 44, points: 40, form: ["L","D","W","L","W"], color: "#E4001B", isOL: false },
  { position: 10, team: "Toulouse",              short: "TFC",   played: 28, won: 10, drawn: 9, lost: 9, goalsFor: 38, goalsAgainst: 40, points: 39, form: ["D","L","D","W","D"], color: "#7B0036", isOL: false },
  { position: 11, team: "Nantes",                short: "FCN",   played: 28, won: 10, drawn: 7, lost: 11, goalsFor: 37, goalsAgainst: 43, points: 37, form: ["L","W","D","L","L"], color: "#FFFF00", isOL: false },
  { position: 12, team: "Strasbourg",            short: "RCSA",  played: 28, won: 9,  drawn: 9, lost: 10, goalsFor: 36, goalsAgainst: 42, points: 36, form: ["D","D","L","W","D"], color: "#005BAA", isOL: false },
  { position: 13, team: "Reims",                 short: "SDR",   played: 28, won: 9,  drawn: 6, lost: 13, goalsFor: 34, goalsAgainst: 46, points: 33, form: ["L","L","W","D","L"], color: "#E30613", isOL: false },
  { position: 14, team: "Auxerre",               short: "AJA",   played: 28, won: 8,  drawn: 7, lost: 13, goalsFor: 32, goalsAgainst: 48, points: 31, form: ["L","W","L","D","L"], color: "#005BBB", isOL: false },
  { position: 15, team: "Montpellier",           short: "MHSC",  played: 28, won: 7,  drawn: 9, lost: 12, goalsFor: 30, goalsAgainst: 47, points: 30, form: ["D","D","L","L","D"], color: "#F57923", isOL: false },
  { position: 16, team: "Le Havre",              short: "HAC",   played: 28, won: 7,  drawn: 8, lost: 13, goalsFor: 28, goalsAgainst: 49, points: 29, form: ["L","D","W","L","D"], color: "#0055A4", isOL: false },
  { position: 17, team: "Angers",                short: "SCO",   played: 28, won: 6,  drawn: 9, lost: 13, goalsFor: 27, goalsAgainst: 50, points: 27, form: ["D","L","D","D","L"], color: "#000000", isOL: false },
  { position: 18, team: "Saint-Étienne",         short: "ASSE",  played: 28, won: 6,  drawn: 7, lost: 15, goalsFor: 26, goalsAgainst: 54, points: 25, form: ["L","L","D","L","W"], color: "#2D6A2D", isOL: false },
  { position: 19, team: "Metz",                  short: "FC57",  played: 28, won: 4,  drawn: 8, lost: 16, goalsFor: 24, goalsAgainst: 58, points: 20, form: ["D","L","L","D","L"], color: "#8B0000", isOL: false },
  { position: 20, team: "Clermont Foot",         short: "CF63",  played: 28, won: 3,  drawn: 6, lost: 19, goalsFor: 20, goalsAgainst: 65, points: 15, form: ["L","L","L","D","L"], color: "#CC0022", isOL: false }
]

export const zones = [
  { label: "Ligue des Champions", color: "#032974", positions: [1, 2, 3, 4], className: "cl-zone" },
  { label: "Europa League", color: "#f97316", positions: [5, 6], className: "el-zone" },
  { label: "Conférence League", color: "#22c55e", positions: [7], className: "conf-zone" },
  { label: "Relégation", color: "#ef4444", positions: [18, 19, 20], className: "rel-zone" }
]

export const getZoneForPosition = (pos) => {
  if (pos <= 4) return { label: "Ligue des Champions", color: "#032974", bg: "rgba(3,41,116,0.1)" }
  if (pos <= 6) return { label: "Europa League", color: "#f97316", bg: "rgba(249,115,22,0.1)" }
  if (pos === 7) return { label: "Conférence League", color: "#22c55e", bg: "rgba(34,197,94,0.1)" }
  if (pos >= 18) return { label: "Relégation", color: "#ef4444", bg: "rgba(239,68,68,0.1)" }
  return null
}
