'use client'

import { useState } from 'react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        window.location.href = '/admin'
        return
      }

      // Cada falha tem uma causa diferente: mostrar tudo como "senha incorreta"
      // esconde bloqueio por tentativas e erro de configuracao do servidor.
      if (res.status === 401) {
        setError('Senha incorreta. Tente novamente.')
      } else if (res.status === 429) {
        setError('Muitas tentativas seguidas. Aguarde alguns minutos e tente de novo.')
      } else if (res.status === 500) {
        setError('Erro de configuracao no servidor (ADMIN_PASSWORD ausente). Avise o suporte.')
      } else {
        setError(`Nao foi possivel entrar (erro ${res.status}). Tente novamente.`)
      }
    } catch {
      setError('Sem conexao com o servidor. Verifique sua internet e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1c0d00] flex items-center justify-center px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #d2741f 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-2xl">
          {/* Top bar */}
          <div className="bg-[#d2741f] px-10 py-8">
            <div className="flex items-center gap-3">
              <img src="/images/logotipo-nav-bar-vt-couro.svg" alt="VTCouro" className="h-10 brightness-0 invert" />
            </div>
            <p className="text-white/80 text-sm mt-2">Painel administrativo</p>
          </div>

          {/* Form */}
          <div className="px-10 py-8 flex flex-col gap-6">
            <div>
              <h2 className="text-[#1f1f1f] font-semibold text-xl">Bem-vindo de volta</h2>
              <p className="text-gray-400 text-sm mt-1">Digite sua senha para acessar o painel.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#1f1f1f]">Senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="border border-gray-200 rounded-[12px] px-4 py-3 text-sm outline-none focus:border-[#d2741f] focus:ring-2 focus:ring-[#d2741f]/20 transition"
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="bg-[#d2741f] text-white rounded-[12px] py-3.5 font-medium hover:bg-[#b8611a] transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {loading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          © 2026 VTCouro · Área restrita
        </p>
      </div>
    </div>
  )
}
