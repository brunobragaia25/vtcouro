'use client'

import { useState, useEffect } from 'react'

export default function FontsPage() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [fontsList, setFontsList] = useState<string[]>([])

  useEffect(() => {
    fetchFonts()
  }, [])

  const fetchFonts = async () => {
    try {
      const response = await fetch('/api/fonts')
      const data = await response.json()
      setFontsList(data.fonts || [])
    } catch (error) {
      console.error('Erro ao buscar fontes:', error)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      setMessage('Selecione pelo menos um arquivo')
      return
    }

    setUploading(true)
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/fonts/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        setFiles([])
        fetchFonts()
        // Limpar mensagem após 3 segundos
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erro ao fazer upload')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    if (!confirm(`Deletar ${filename}?`)) return

    try {
      const response = await fetch(`/api/fonts/delete?filename=${filename}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ ${data.message}`)
        fetchFonts()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Erro ao deletar')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5ec] to-white pt-40">
      <div className="max-w-4xl mx-auto px-5">
        <div className="bg-white rounded-[40px] p-12 shadow-lg">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Gerenciar Fontes
            </h1>
            <p className="text-gray-600">
              Faça upload dos arquivos de fontes (.ttf, .woff, .woff2) para usar no projeto
            </p>
          </div>

          {/* Upload Form */}
          <form onSubmit={handleUpload} className="mb-12">
            <div className="border-2 border-dashed border-gray-300 rounded-[20px] p-8 text-center hover:border-[#d2741f] transition cursor-pointer mb-6">
              <input
                type="file"
                multiple
                accept=".ttf,.woff,.woff2,.otf"
                onChange={handleFileChange}
                className="hidden"
                id="font-input"
              />
              <label htmlFor="font-input" className="cursor-pointer block">
                <div className="text-4xl mb-3">📁</div>
                <p className="text-gray-700 font-medium mb-2">
                  Clique ou arraste as fontes aqui
                </p>
                <p className="text-sm text-gray-500">
                  Aceita: .ttf, .woff, .woff2, .otf
                </p>
              </label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-[16px]">
                <p className="text-sm font-semibold text-blue-900 mb-3">
                  {files.length} arquivo(s) selecionado(s):
                </p>
                <ul className="space-y-2">
                  {files.map((file, idx) => (
                    <li key={idx} className="text-sm text-blue-800 flex items-center gap-2">
                      📄 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className="mb-6 p-4 bg-gray-100 rounded-[16px] text-sm font-medium text-gray-800">
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || files.length === 0}
              className="w-full bg-[#d2741f] text-white py-4 rounded-[16px] font-semibold hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Enviando...' : '📤 Fazer Upload'}
            </button>
          </form>

          {/* Divider */}
          <div className="border-t border-gray-200 my-12"></div>

          {/* Fonts List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Fontes Instaladas ({fontsList.length})
            </h2>

            {fontsList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhuma fonte instalada ainda
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Faça upload de arquivos de fonte acima
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {fontsList.map((font, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-[16px] hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-gray-800">{font}</p>
                        <p className="text-xs text-gray-500">
                          public/fonts/{font}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(font)}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-[12px] transition font-medium text-sm"
                    >
                      Deletar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-12 p-6 bg-[#fff5ec] rounded-[20px]">
            <h3 className="font-bold text-gray-800 mb-4">📝 Como usar as fontes</h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li>
                <strong>1. Faça upload:</strong> Selecione os arquivos de fonte acima
              </li>
              <li>
                <strong>2. Configure:</strong> As fontes serão salvas em <code className="bg-white px-2 py-1 rounded">public/fonts/</code>
              </li>
              <li>
                <strong>3. Registre no CSS:</strong> Adicione em <code className="bg-white px-2 py-1 rounded">src/styles/globals.css</code>
              </li>
              <li>
                <strong>4. Use no Tailwind:</strong> Configure em <code className="bg-white px-2 py-1 rounded">tailwind.config.ts</code>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-white rounded-[12px] border border-gray-200">
              <p className="text-xs font-mono text-gray-600 mb-2">Exemplo para globals.css:</p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
{`@font-face {
  font-family: 'DM Sans';
  src: url('/fonts/dm-sans.ttf') format('truetype');
  font-weight: 400;
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
