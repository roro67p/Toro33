import { useState, useRef } from 'react'
import { Upload, Link, X, Image } from 'lucide-react'

/**
 * ImagePicker — allows choosing an image via:
 *   1. File upload (converted to base64, stored directly)
 *   2. URL paste
 *
 * Props:
 *   value: string | null  — current image URL or base64
 *   onChange: (val: string | null) => void
 */
export default function ImagePicker({ value, onChange }) {
  const [mode, setMode] = useState(null) // null | 'url'
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Image trop grande (max 2 Mo). Compressez-la avant.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      onChange(ev.target.result)
      setMode(null)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const applyUrl = () => {
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setUrlInput('')
    setMode(null)
  }

  const clear = () => {
    onChange(null)
    setMode(null)
    setError('')
  }

  return (
    <div>
      {/* Preview */}
      {value ? (
        <div className="relative rounded-xl overflow-hidden mb-2" style={{ height: '140px', backgroundColor: '#F5F5F4' }}>
          <img
            src={value}
            alt="preview"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => { setError('URL invalide ou image inaccessible.'); onChange(null) }}
          />
          <button
            onClick={clear}
            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: 'white' }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="rounded-xl flex items-center justify-center mb-2"
          style={{ height: '100px', backgroundColor: '#F5F5F4', border: '1.5px dashed #D6D3D1' }}>
          <div className="text-center">
            <Image size={28} style={{ color: '#D6D3D1', margin: '0 auto 4px' }} />
            <p className="text-xs" style={{ color: '#A8A29E' }}>Aucune image</p>
          </div>
        </div>
      )}

      {/* Buttons */}
      {!value && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}
          >
            <Upload size={14} />
            Importer
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === 'url' ? null : 'url')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{ backgroundColor: '#EFF6FF', color: '#1E40AF' }}
          >
            <Link size={14} />
            URL
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      )}

      {value && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
          style={{ backgroundColor: '#F5F5F4', color: '#78716C' }}
        >
          Changer l'image
        </button>
      )}
      {value && <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />}

      {/* URL input */}
      {mode === 'url' && (
        <div className="flex gap-2 mt-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://..."
            autoFocus
            className="flex-1 px-3 py-2 rounded-xl text-xs outline-none"
            style={{ border: '1.5px solid #D97706', color: '#1C1917' }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyUrl() } }}
          />
          <button type="button" onClick={applyUrl}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ backgroundColor: '#D97706' }}>
            OK
          </button>
          <button type="button" onClick={() => setMode(null)}
            className="px-2 py-2 rounded-xl text-xs"
            style={{ backgroundColor: '#F5F5F4', color: '#78716C' }}>
            <X size={13} />
          </button>
        </div>
      )}

      {error && <p className="text-xs mt-1" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  )
}
