import { useState } from 'react'
import useStore from '../../store/useStore'
import { TrendingUp, Users, Euro, Plus, Save } from 'lucide-react'

const today = new Date().toISOString().split('T')[0]

function StatCard({ label, value, sub, color, bg, icon: Icon }) {
  return (
    <div className="p-5 rounded-2xl" style={{ backgroundColor: bg, border: `1px solid ${color}22` }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color }}>{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold" style={{ color: '#1C1917' }}>{value}</div>
      {sub && <div className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{sub}</div>}
    </div>
  )
}

export default function CaisseAdmin() {
  const { data, addCaisseEntry, updateCaisseEntry } = useStore()
  const [editDate, setEditDate] = useState(today)
  const [form, setForm] = useState({ covers: '', revenue: '', lunchRevenue: '', dinnerRevenue: '', topDish: '' })
  const [saved, setSaved] = useState(false)

  const entries = [...data.caisse].sort((a, b) => new Date(b.date) - new Date(a.date))
  const existing = data.caisse.find(c => c.date === editDate)

  const weekEntries = entries.filter(e => {
    const d = new Date(e.date), now = new Date()
    const diff = (now - d) / (1000 * 60 * 60 * 24)
    return diff <= 7 && e.revenue > 0
  })

  const weekRevenue = weekEntries.reduce((s, e) => s + e.revenue, 0)
  const weekCovers = weekEntries.reduce((s, e) => s + e.covers, 0)
  const avgTicket = weekCovers > 0 ? weekRevenue / weekCovers : 0
  const bestDay = entries.filter(e => e.revenue > 0).sort((a, b) => b.revenue - a.revenue)[0]

  const loadDate = (date) => {
    setEditDate(date)
    const e = data.caisse.find(c => c.date === date)
    if (e) setForm({ covers: e.covers.toString(), revenue: e.revenue.toString(), lunchRevenue: e.lunchRevenue.toString(), dinnerRevenue: e.dinnerRevenue.toString(), topDish: e.topDish || '' })
    else setForm({ covers: '', revenue: '', lunchRevenue: '', dinnerRevenue: '', topDish: '' })
  }

  const saveEntry = () => {
    const entry = { date: editDate, covers: parseInt(form.covers) || 0, revenue: parseFloat(form.revenue) || 0, lunchRevenue: parseFloat(form.lunchRevenue) || 0, dinnerRevenue: parseFloat(form.dinnerRevenue) || 0, topDish: form.topDish }
    if (existing) updateCaisseEntry(existing.id, entry)
    else addCaisseEntry(entry)
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Caisse & Chiffre d'affaires</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Suivi des recettes et des couverts</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
        <StatCard label="CA semaine" value={`${weekRevenue.toFixed(0)}€`} sub={`${weekEntries.length} jours`} color="#D97706" bg="#FFFBEB" icon={Euro} />
        <StatCard label="Couverts semaine" value={weekCovers} sub="personnes" color="#7C3AED" bg="#F5F3FF" icon={Users} />
        <StatCard label="Ticket moyen" value={`${avgTicket.toFixed(2)}€`} sub="par couvert" color="#059669" bg="#ECFDF5" icon={TrendingUp} />
        <StatCard label="Meilleure journée" value={bestDay ? `${bestDay.revenue.toFixed(0)}€` : '—'} sub={bestDay?.date || ''} color="#DC2626" bg="#FEF2F2" icon={TrendingUp} />
      </div>

      {/* Saisie */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-5 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Saisir / modifier une journée</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Date</label>
              <input type="date" value={editDate} onChange={e => loadDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
            {[['Nombre de couverts', 'covers', 'number'], ['Chiffre d\'affaires total (€)', 'revenue', 'number'], ['CA midi (€)', 'lunchRevenue', 'number'], ['CA soir (€)', 'dinnerRevenue', 'number'], ['Plat le plus vendu', 'topDish', 'text']].map(([label, field, type]) => (
              <div key={field}>
                <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>{label}</label>
                <input type={type} step="0.01" value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
              </div>
            ))}
            <button onClick={saveEntry} className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90"
              style={{ backgroundColor: saved ? '#059669' : '#D97706', color: 'white' }}>
              <Save size={15} />{saved ? 'Enregistré !' : existing ? 'Mettre à jour' : 'Ajouter la journée'}
            </button>
          </div>
        </div>

        {/* Historique */}
        <div className="p-5 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Historique récent</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {entries.filter(e => e.revenue > 0).slice(0, 14).map(entry => {
              const dateStr = new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
              return (
                <button key={entry.id} onClick={() => loadDate(entry.date)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ backgroundColor: editDate === entry.date ? '#FEF3C7' : '#FAFAFA', border: `1px solid ${editDate === entry.date ? '#FCD34D' : '#F3F4F6'}` }}>
                  <div>
                    <span className="text-sm font-medium capitalize" style={{ color: '#1C1917' }}>{dateStr}</span>
                    <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{entry.covers} couverts {entry.topDish ? `· ${entry.topDish}` : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm" style={{ color: '#D97706' }}>{entry.revenue.toFixed(0)}€</div>
                    <div className="text-xs" style={{ color: '#9CA3AF' }}>{entry.covers > 0 ? (entry.revenue / entry.covers).toFixed(0) : 0}€/couv.</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Graphique simplifié (barres CSS) */}
      {weekEntries.length > 0 && (
        <div className="mt-6 p-5 rounded-2xl" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>CA des 7 derniers jours</h3>
          <div className="flex items-end gap-2 h-32">
            {weekEntries.slice(0, 7).reverse().map(entry => {
              const maxRev = Math.max(...weekEntries.map(e => e.revenue))
              const pct = maxRev > 0 ? (entry.revenue / maxRev) * 100 : 0
              const dateStr = new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold" style={{ color: '#D97706' }}>{entry.revenue > 0 ? `${entry.revenue.toFixed(0)}€` : ''}</span>
                  <div className="w-full rounded-t-lg transition-all" style={{ height: `${Math.max(pct, 4)}%`, backgroundColor: entry.date === today ? '#D97706' : '#FDE68A', minHeight: '4px' }} />
                  <span className="text-xs capitalize" style={{ color: '#9CA3AF' }}>{dateStr}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
