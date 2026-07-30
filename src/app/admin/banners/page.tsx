'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, GripVertical, ExternalLink, Monitor } from 'lucide-react'

interface Banner {
  id: string
  imageUrl: string
  mobileImageUrl: string | null
  link: string | null
  isActive: boolean
  orderIndex: number
}

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [linkValue, setLinkValue] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const res = await fetch('/api/banners?admin=1')
    const data = await res.json()
    setBanners(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const uploadFile = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/banners/upload', { method: 'POST', body: form })
    if (!res.ok) throw new Error('Falha no upload')
    const { url } = await res.json()
    return url
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadFile(file)
      await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: url, orderIndex: banners.length }),
      })
      await load()
    } catch {
      alert('Erro ao enviar imagem')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este banner?')) return
    await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    setBanners((b) => b.filter((x) => x.id !== id))
  }

  const handleToggle = async (banner: Banner) => {
    const res = await fetch(`/api/banners/${banner.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !banner.isActive }),
    })
    const updated = await res.json()
    setBanners((b) => b.map((x) => (x.id === banner.id ? updated : x)))
  }

  const saveLink = async (id: string) => {
    const res = await fetch(`/api/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: linkValue || null }),
    })
    const updated = await res.json()
    setBanners((b) => b.map((x) => (x.id === id ? updated : x)))
    setEditingLink(null)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banners</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie os banners do topo da home</p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          onClick={() => triggerUpload()}
          disabled={uploading}
          className="flex items-center gap-2 bg-leather-900 text-white px-4 py-2 rounded-lg hover:bg-leather-800 transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          {uploading ? 'Enviando...' : 'Adicionar banner'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Monitor size={13} /> Desktop: <strong className="text-gray-700">1920 × 720px</strong>
        </span>
        <span className="text-gray-400">A imagem é redimensionada automaticamente no mobile.</span>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Carregando...</div>
      ) : banners.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 gap-2">
          <p className="text-sm">Nenhum banner cadastrado</p>
          <p className="text-xs">Clique em &quot;Adicionar banner&quot; para começar</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white border rounded-xl p-4 ${banner.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}
            >
              {/* Top row */}
              <div className="flex flex-wrap items-start gap-4">
                <GripVertical size={16} className="text-gray-300 shrink-0 mt-1" />

                {/* Images */}
                <div className="flex gap-3 shrink-0 flex-wrap">
                  {/* Desktop image */}
                  <div className="flex flex-col items-center gap-1">
                    <img src={banner.imageUrl} alt="Desktop" className="w-28 h-14 object-cover rounded-lg" />
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Monitor size={10} /> Desktop
                    </span>
                  </div>
                </div>

                {/* Link */}
                <div className="flex-1 min-w-0 basis-full sm:basis-auto">
                  {editingLink === banner.id ? (
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-leather-300"
                        autoFocus
                      />
                      <button onClick={() => saveLink(banner.id)} className="bg-leather-900 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-leather-800">
                        Salvar
                      </button>
                      <button onClick={() => setEditingLink(null)} className="border border-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50">
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setEditingLink(banner.id); setLinkValue(banner.link ?? '') }}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors w-full min-w-0"
                    >
                      <ExternalLink size={13} className="flex-shrink-0" />
                      {banner.link
                        ? <span className="truncate min-w-0">{banner.link}</span>
                        : <span className="text-gray-400">Sem link — clique para adicionar</span>
                      }
                    </button>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <div onClick={() => handleToggle(banner)} className="cursor-pointer flex items-center gap-2">
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${banner.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${banner.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-xs text-gray-500">{banner.isActive ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  <button onClick={() => handleDelete(banner.id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

