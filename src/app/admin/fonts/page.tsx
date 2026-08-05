'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, FileType, Trash2, Copy, Check, X } from 'lucide-react'

// As fontes ficam no Supabase Storage (bucket Arquivo-Artes, prefixo
// fonts/), nao em public/fonts - o filesystem da Vercel e somente leitura
// em runtime, entao um upload salvo localmente nunca persistia.
function fontUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Arquivo-Artes/fonts/${filename}`
}

export default function AdminFontsPage() {
  const [fontsList, setFontsList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copiedFont, setCopiedFont] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchFonts = async () => {
    try {
      const res = await fetch('/api/fonts')
      const data = await res.json()
      setFontsList(Array.isArray(data.fonts) ? data.fonts : [])
    } catch {
      setError('Erro ao buscar fontes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFonts() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      for (let i = 0; i < files.length; i++) formData.append('files', files[i])

      const res = await fetch('/api/fonts/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro ao fazer upload')
      await fetchFonts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm(`Remover ${filename}?`)) return
    try {
      const res = await fetch(`/api/fonts/delete?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Erro ao remover')
      await fetchFonts()
    } catch {
      setError('Erro ao remover fonte')
    }
  }

  const copyUrl = async (font: string) => {
    await navigator.clipboard.writeText(fontUrl(font))
    setCopiedFont(font)
    setTimeout(() => setCopiedFont(null), 2000)
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-leather-900">Fontes</h1>
          <p className="text-sm text-leather-500 mt-1">
            Arquivos de fonte (.ttf, .woff, .woff2, .otf) para uso no site
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".ttf,.woff,.woff2,.otf"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 admin-btn-primary"
        >
          <Upload size={16} />
          {uploading ? 'Enviando...' : 'Adicionar fonte'}
        </button>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
          {error}
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X size={16} />
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-leather-400 text-sm">Carregando...</div>
      ) : fontsList.length === 0 ? (
        <div className="border-2 border-dashed border-leather-200 rounded-xl h-48 flex flex-col items-center justify-center text-leather-400 gap-2">
          <FileType size={28} className="text-leather-300" />
          <p className="text-sm">Nenhuma fonte cadastrada</p>
          <p className="text-xs">Clique em &quot;Adicionar fonte&quot; para começar</p>
        </div>
      ) : (
        <div className="space-y-3">
          {fontsList.map((font) => (
            <div
              key={font}
              className="bg-white border border-leather-200/60 rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-leather-100 flex items-center justify-center flex-shrink-0">
                  <FileType size={18} className="text-leather-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-leather-900 truncate">{font}</p>
                  <p className="text-xs text-leather-400 truncate">{fontUrl(font)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => copyUrl(font)}
                  title="Copiar URL"
                  className="p-2 text-leather-500 hover:bg-leather-100 rounded-lg transition-colors"
                >
                  {copiedFont === font ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(font)}
                  title="Remover"
                  className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="admin-section mt-8">
        <h3 className="admin-section-title">Como usar</h3>
        <ol className="space-y-2 text-sm text-leather-700 list-decimal list-inside">
          <li>Faça upload do arquivo de fonte acima</li>
          <li>Copie a URL pelo botão ao lado do nome</li>
          <li>
            Registre em{' '}
            <code className="bg-white px-1.5 py-0.5 rounded text-leather-600 text-xs">
              src/styles/globals.css
            </code>
          </li>
        </ol>
        <div className="mt-4 p-3 bg-white rounded-lg border border-leather-200/60">
          <p className="text-xs text-leather-500 mb-2">Exemplo:</p>
          <pre className="bg-leather-50 p-3 rounded text-xs overflow-x-auto text-leather-700">
{`@font-face {
  font-family: 'Nome da Fonte';
  src: url('${fontUrl('arquivo.ttf')}') format('truetype');
  font-weight: 400;
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}
