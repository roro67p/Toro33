import { useState } from 'react'
import useStore from '../../store/useStore'
import { Plus, X, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const STATUS_CONFIG = {
  libre:     { label: 'Libre',     color: '#10B981', bg: '#064E3B', border: '#10B981' },
  occupée:   { label: 'Occupée',   color: '#E11D48', bg: '#4C0519', border: '#E11D48' },
  réservée:  { label: 'Réservée',  color: '#F59E0B', bg: '#451A03', border: '#F59E0B' },
  nettoyage: { label: 'Nettoyage', color: '#6B7280', bg: '#1F2937', border: '#6B7280' },
}

const ZONES = ['salle', 'terrasse']

export default function TablesAdmin() {
  const { data, updateTable, deleteTable, addTable, setTableStatus } = useStore()
  const tables = data.tables || []
  const orders = data.customerOrders || []

  const [selectedTable, setSelectedTable] = useState(null)
  const [activeZone, setActiveZone] = useState('salle')
  const [showAdd, setShowAdd] = useState(false)
  const [newTable, setNewTable] = useState({ number: '', seats: 4, zone: 'salle' })
  const [editMode, setEditMode] = useState(false)

  const zoneTables = tables.filter(t => t.zone === activeZone)
  const selected = selectedTable ? tables.find(t => t.id === selectedTable) : null
  const linkedOrder = selected?.orderId ? orders.find(o => o.id === selected.orderId) : null

  const stats = {
    total: tables.length,
    libre: tables.filter(t => t.status === 'libre').length,
    occupée: tables.filter(t => t.status === 'occupée').length,
    réservée: tables.filter(t => t.status === 'réservée').length,
  }

  const handleStatusChange = (tableId, status) => {
    setTableStatus(tableId, status)
    if (selectedTable) {
      const updated = tables.find(t => t.id === tableId)
      if (updated) setSelectedTable(tableId)
    }
  }

  const handleAddTable = () => {
    if (!newTable.number) return
    addTable({ ...newTable, number: parseInt(newTable.number), seats: parseInt(newTable.seats), status: 'libre', orderId: null, x: 1, y: 1 })
    setNewTable({ number: '', seats: 4, zone: 'salle' })
    setShowAdd(false)
  }

  const card = (style = {}) => ({ backgroundColor: '#1F2937', borderRadius: '12px', border: '1px solid #374151', padding: '20px', ...style })

  return (
    <div style={{ padding: '24px', color: 'white', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Plan de salle</h2>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>Gérez l'occupation de vos tables en temps réel</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', backgroundColor: '#E11D48', color: 'white', fontWeight: 600, fontSize: '13px' }}>
          <Plus size={15} /> Ajouter une table
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Tables total', value: stats.total, color: '#9CA3AF' },
          { label: 'Libres', value: stats.libre, color: '#10B981' },
          { label: 'Occupées', value: stats.occupée, color: '#E11D48' },
          { label: 'Réservées', value: stats.réservée, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={card({ padding: '14px', textAlign: 'center' })}>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* Plan de salle */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {/* Zone tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {ZONES.map(z => (
              <button key={z} onClick={() => setActiveZone(z)} style={{
                padding: '7px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', textTransform: 'capitalize',
                backgroundColor: activeZone === z ? '#E11D48' : '#1F2937',
                color: activeZone === z ? 'white' : '#9CA3AF',
              }}>{z}</button>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: cfg.color }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{cfg.label}</span>
              </div>
            ))}
          </div>

          {/* Tables grid */}
          <div style={card({ padding: '16px' })}>
            {zoneTables.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Aucune table dans cette zone</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px' }}>
                {zoneTables.sort((a, b) => a.number - b.number).map(table => {
                  const cfg = STATUS_CONFIG[table.status] || STATUS_CONFIG.libre
                  const isSelected = selectedTable === table.id
                  return (
                    <button key={table.id} onClick={() => setSelectedTable(isSelected ? null : table.id)} style={{
                      padding: '14px 10px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center',
                      backgroundColor: cfg.bg,
                      border: `2px solid ${isSelected ? 'white' : cfg.border}`,
                      transition: 'all 0.15s',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: cfg.color }}>T{table.number}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
                        <Users size={11} color={cfg.color} />
                        <span style={{ fontSize: '11px', color: cfg.color }}>{table.seats}</span>
                      </div>
                      <div style={{ fontSize: '10px', color: cfg.color, marginTop: '4px', fontWeight: 600 }}>{cfg.label}</div>
                      {table.orderId && <div style={{ fontSize: '9px', color: '#F59E0B', marginTop: '2px' }}>#{table.orderId.slice(-4)}</div>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Détails de la table sélectionnée */}
        <div style={{ width: '280px', minWidth: '240px' }}>
          {selected ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', margin: 0 }}>Table {selected.number}</h3>
                <button onClick={() => setSelectedTable(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={16} /></button>
              </div>

              {/* Infos */}
              <div style={card({ marginBottom: '12px' })}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Couverts</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{selected.seats} pers.</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Zone</span>
                  <span style={{ fontWeight: 600, fontSize: '13px', textTransform: 'capitalize' }}>{selected.zone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '13px' }}>Statut</span>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: STATUS_CONFIG[selected.status]?.color }}>{STATUS_CONFIG[selected.status]?.label}</span>
                </div>
              </div>

              {/* Changer statut */}
              <div style={card({ marginBottom: '12px' })}>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Changer le statut</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <button key={key} onClick={() => handleStatusChange(selected.id, key)} style={{
                      padding: '7px', borderRadius: '8px', border: `1px solid ${cfg.border}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                      backgroundColor: selected.status === key ? cfg.bg : 'transparent',
                      color: cfg.color,
                    }}>{cfg.label}</button>
                  ))}
                </div>
              </div>

              {/* Commande liée */}
              {linkedOrder ? (
                <div style={card({ marginBottom: '12px' })}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Commande en cours</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#E11D48', marginBottom: '4px' }}>#{linkedOrder.id.slice(-6).toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>{linkedOrder.customerName}</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '8px' }}>{(linkedOrder.items || []).length} articles · {linkedOrder.total?.toFixed(2)}€</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', display: 'inline-block', backgroundColor: '#1F2937', color: '#F59E0B' }}>{linkedOrder.status}</div>
                </div>
              ) : (
                <div style={card({ marginBottom: '12px', textAlign: 'center', padding: '16px' })}>
                  <CheckCircle size={24} color="#10B981" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>Aucune commande liée</div>
                </div>
              )}

              {/* Modifier nb couverts */}
              <div style={card({ marginBottom: '12px' })}>
                <div style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modifier</div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#6B7280' }}>Couverts</label>
                    <input type="number" min="1" max="20" defaultValue={selected.seats}
                      onBlur={e => updateTable(selected.id, { seats: parseInt(e.target.value) || selected.seats })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px', marginTop: '4px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '11px', color: '#6B7280' }}>Zone</label>
                    <select value={selected.zone} onChange={e => updateTable(selected.id, { zone: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '13px', marginTop: '4px' }}>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => { if (window.confirm('Supprimer cette table ?')) { deleteTable(selected.id); setSelectedTable(null) } }}
                  style={{ width: '100%', padding: '7px', borderRadius: '8px', border: '1px solid #EF4444', cursor: 'pointer', fontSize: '12px', fontWeight: 600, backgroundColor: 'transparent', color: '#EF4444' }}>
                  Supprimer la table
                </button>
              </div>
            </div>
          ) : (
            <div style={card({ textAlign: 'center', padding: '40px 20px' })}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🪑</div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>Cliquez sur une table pour voir ses détails</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal ajouter table */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1F2937', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px', border: '1px solid #374151' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', margin: 0 }}>Nouvelle table</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Numéro de table</label>
                <input type="number" value={newTable.number} onChange={e => setNewTable(p => ({ ...p, number: e.target.value }))} placeholder="Ex: 13"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Nombre de couverts</label>
                <input type="number" value={newTable.seats} onChange={e => setNewTable(p => ({ ...p, seats: e.target.value }))} min="1" max="20"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#9CA3AF', display: 'block', marginBottom: '6px' }}>Zone</label>
                <select value={newTable.zone} onChange={e => setNewTable(p => ({ ...p, zone: e.target.value }))}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #374151', backgroundColor: '#111827', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
                  {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: '1px solid #374151', cursor: 'pointer', fontSize: '13px', backgroundColor: 'transparent', color: '#9CA3AF' }}>Annuler</button>
                <button onClick={handleAddTable} style={{ flex: 1, padding: '9px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, backgroundColor: '#E11D48', color: 'white' }}>Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
