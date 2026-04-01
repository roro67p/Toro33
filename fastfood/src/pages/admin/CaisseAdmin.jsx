import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Edit2, Check, X, TrendingUp, Euro, Users } from 'lucide-react'

const INPUT = { backgroundColor: '#111827', border: '1.5px solid #374151', color: 'white', borderRadius: '10px', padding: '8px 12px', width: '100%', fontSize: '14px', outline: 'none' }

export default function CaisseAdmin() {
  const { data, addCaisseEntry, updateCaisseEntry } = useStore()
  const entries = [...(data.caisse || [])].reverse()
  const today = new Date().toISOString().split('T')[0]
  const todayEntry = data.caisse.find(c => c.date === today)

  const weekRevenue = data.caisse.slice(-7).reduce((s, c) => s + (c.revenue || 0), 0)
  const monthRevenue = data.caisse.reduce((s, c) => s + (c.revenue || 0), 0)
  const avgRevenue = data.caisse.length > 0 ? monthRevenue / data.caisse.length : 0

  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ date: today, revenue: '', covers: '', note: '' })

  const handleSave = () => {
    if (!form.revenue) return
    if (adding) {
      addCaisseEntry({ ...form, revenue: parseFloat(form.revenue), covers: parseInt(form.covers) || 0 })
      setAdding(false)
    } else {
      updateCaisseEntry(editing, { ...form, revenue: parseFloat(form.revenue), covers: parseInt(form.covers) || 0 })
      setEditing(null)
    }
    setForm({ date: today, revenue: '', covers: '', note: '' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Caisse & CA</h1>
        {!adding && !todayEntry && (
          <button onClick={() => { setAdding(true); setForm({ date: today, revenue: '', covers: '', note: '' }) }}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ backgroundColor: '#E11D48' }}>
            <Plus size={16} /> Saisir aujourd'hui
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'CA semaine', value: `${weekRevenue.toFixed(0)}€`, icon: TrendingUp, color: '#10B981' },
          { label: 'CA total', value: `${monthRevenue.toFixed(0)}€`, icon: Euro, color: '#E11D48' },
          { label: 'Moyenne / jour', value: `${avgRevenue.toFixed(0)}€`, icon: Users, color: '#F59E0B' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-5" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
              <Icon size={20} className="mb-2" style={{ color: s.color }} />
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {(adding || editing) && (
        <div className="mb-4 p-4 rounded-xl space-y-3" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Date</label><input type="date" style={INPUT} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} /></div>
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>CA (€) *</label><input type="number" step="0.01" style={INPUT} value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: e.target.value }))} /></div>
            <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Couverts</label><input type="number" style={INPUT} value={form.covers} onChange={e => setForm(p => ({ ...p, covers: e.target.value }))} /></div>
          </div>
          <div><label className="text-xs mb-1 block" style={{ color: '#9CA3AF' }}>Note</label><input style={INPUT} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} placeholder="Soirée foot, promo..." /></div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-semibold text-white flex items-center gap-1" style={{ backgroundColor: '#E11D48' }}><Check size={13} /> Enregistrer</button>
            <button onClick={() => { setAdding(false); setEditing(null) }} className="px-4 py-2 rounded-lg text-xs font-semibold" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={13} /></button>
          </div>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #374151' }}>
          <span className="text-sm font-semibold text-white">Historique</span>
        </div>
        {entries.length === 0 ? (
          <div className="text-center py-10" style={{ color: '#6B7280' }}><p className="text-sm">Aucune entrée</p></div>
        ) : (
          entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid #374151' }}>
              {editing === entry.id ? (
                <div className="flex-1 grid grid-cols-4 gap-2 items-center">
                  <input type="date" style={INPUT} value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                  <input type="number" style={INPUT} value={form.revenue} onChange={e => setForm(p => ({ ...p, revenue: e.target.value }))} placeholder="CA €" />
                  <input type="number" style={INPUT} value={form.covers} onChange={e => setForm(p => ({ ...p, covers: e.target.value }))} placeholder="Couverts" />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="p-1.5 rounded-lg" style={{ backgroundColor: '#E11D48', color: 'white' }}><Check size={14} /></button>
                    <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><X size={14} /></button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="font-semibold text-sm text-white">{new Date(entry.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                    {entry.note && <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{entry.note}</div>}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="font-bold" style={{ color: '#E11D48' }}>{entry.revenue?.toFixed(2)}€</div>
                      <div className="text-xs" style={{ color: '#6B7280' }}>{entry.covers} couverts</div>
                    </div>
                    <button onClick={() => { setEditing(entry.id); setForm({ date: entry.date, revenue: entry.revenue, covers: entry.covers || '', note: entry.note || '' }) }}
                      className="p-1.5 rounded-lg" style={{ backgroundColor: '#374151', color: '#9CA3AF' }}><Edit2 size={14} /></button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
