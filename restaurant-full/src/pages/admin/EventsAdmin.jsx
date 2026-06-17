import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, Trash2, Edit2, Check, X, Calendar, Users, Euro } from 'lucide-react'

const EMPTY_EVENT = { title: '', date: '', time: '19h30', description: '', emoji: '🎉', seats: 40, seatsLeft: 40, price: 0 }

function EventCard({ event, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...event, seats: event.seats.toString(), seatsLeft: event.seatsLeft.toString(), price: event.price.toString() })

  const isPast = new Date(event.date) < new Date()

  const save = () => {
    onUpdate(event.id, {
      ...form,
      seats: parseInt(form.seats) || 0,
      seatsLeft: parseInt(form.seatsLeft) || 0,
      price: parseFloat(form.price) || 0
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#FEF3C7', border: '2px solid #FCD34D' }}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Titre *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Heure</label>
            <input value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} placeholder="19h30" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Emoji</label>
            <input value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none text-center text-xl" style={{ borderColor: '#E5E7EB' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Prix par personne (€)</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Capacité totale</label>
            <input type="number" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Places restantes</label>
            <input type="number" value={form.seatsLeft} onChange={e => setForm(p => ({ ...p, seatsLeft: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-medium block mb-1" style={{ color: '#44403C' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
          <button onClick={save} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
            <Check size={14} className="inline mr-1" />Enregistrer
          </button>
        </div>
      </div>
    )
  }

  const dateStr = event.date ? new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const fill = event.seats > 0 ? Math.round(((event.seats - event.seatsLeft) / event.seats) * 100) : 0

  return (
    <div className="p-5 rounded-2xl group transition-all hover:shadow-md" style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', opacity: isPast ? 0.6 : 1 }}>
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ backgroundColor: '#FEF3C7' }}>
          {event.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>{event.title}</h3>
            {isPast && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}>Passé</span>}
            {event.seatsLeft <= 5 && !isPast && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Complet bientôt !</span>}
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            <span className="text-sm flex items-center gap-1" style={{ color: '#78716C' }}><Calendar size={13} />{dateStr} · {event.time}</span>
            <span className="text-sm flex items-center gap-1" style={{ color: '#78716C' }}><Users size={13} />{event.seatsLeft}/{event.seats} places</span>
            <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#D97706' }}><Euro size={13} />{event.price}€/pers.</span>
          </div>
          {/* Fill bar */}
          <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F3F4F6' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${fill}%`, backgroundColor: fill > 80 ? '#DC2626' : '#D97706' }} />
          </div>
          <p className="text-xs mt-2 line-clamp-2" style={{ color: '#9CA3AF' }}>{event.description}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={() => setEditing(true)} className="p-2 rounded-lg transition-colors hover:bg-amber-50" style={{ color: '#9CA3AF' }} title="Modifier">
            <Edit2 size={15} />
          </button>
          <button onClick={() => onDelete(event.id)} className="p-2 rounded-lg transition-colors hover:text-red-500" style={{ color: '#9CA3AF' }} title="Supprimer">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function EventsAdmin() {
  const { data, addEvent, updateEvent, deleteEvent } = useStore()
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_EVENT })

  const sorted = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date))

  const create = () => {
    if (!form.title.trim() || !form.date) return
    addEvent({
      id: 'ev' + Date.now(),
      ...form,
      seats: parseInt(form.seats) || 0,
      seatsLeft: parseInt(form.seatsLeft) || 0,
      price: parseFloat(form.price) || 0
    })
    setForm({ ...EMPTY_EVENT })
    setAdding(false)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#1C1917', fontFamily: 'Georgia, serif' }}>Soirées & Événements</h2>
          <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>Gérez vos soirées à thème et événements spéciaux</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#D97706', color: 'white' }}>
          <Plus size={16} />Nouvel événement
        </button>
      </div>

      {adding && (
        <div className="mb-6 p-5 rounded-2xl space-y-4" style={{ backgroundColor: '#FEF3C7', border: '2px dashed #FCD34D' }}>
          <h3 className="font-semibold" style={{ color: '#92400E' }}>Nouvel événement</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input placeholder="Titre de l'événement *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} autoFocus />
            </div>
            <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input placeholder="Heure (ex: 19h30)" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input placeholder="Emoji 🎉" value={form.emoji} onChange={e => setForm(p => ({ ...p, emoji: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm text-center text-xl outline-none" style={{ borderColor: '#E5E7EB' }} />
            <input type="number" placeholder="Prix €/pers." value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input type="number" placeholder="Capacité totale" value={form.seats} onChange={e => setForm(p => ({ ...p, seats: e.target.value, seatsLeft: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <input type="number" placeholder="Places restantes" value={form.seatsLeft} onChange={e => setForm(p => ({ ...p, seatsLeft: e.target.value }))}
              className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            <div className="col-span-2">
              <textarea placeholder="Description de l'événement..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={{ borderColor: '#E5E7EB', color: '#1C1917' }} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setAdding(false); setForm({ ...EMPTY_EVENT }) }} className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>Annuler</button>
            <button onClick={create} className="px-4 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#D97706', color: 'white' }}>
              <Plus size={14} className="inline mr-1" />Créer l'événement
            </button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ backgroundColor: '#FAFAFA', border: '2px dashed #E5E7EB' }}>
          <div className="text-4xl mb-3">🎭</div>
          <p className="text-sm font-medium" style={{ color: '#9CA3AF' }}>Aucun événement pour le moment</p>
          <p className="text-xs mt-1" style={{ color: '#D1D5DB' }}>Cliquez sur "Nouvel événement" pour commencer</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(ev => <EventCard key={ev.id} event={ev} onUpdate={updateEvent} onDelete={deleteEvent} />)}
        </div>
      )}
    </div>
  )
}
