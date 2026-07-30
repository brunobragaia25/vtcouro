'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

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
        setError('Erro de configuração no servidor (ADMIN_PASSWORD ausente). Avise o suporte.')
      } else {
        setError(`Não foi possível entrar (erro ${res.status}). Tente novamente.`)
      }
    } catch {
      setError('Sem conexão com o servidor. Verifique sua internet e tente de novo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-leather-50 flex items-center justify-center px-4">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #D4A574 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-[28px] overflow-hidden shadow-2xl">
          {/* Top bar */}
          <div className="bg-leather-900 px-10 py-8">
            <div className="flex items-center gap-3">
              <img src="/images/logotipo-nav-bar-vt-couro.svg" alt="VTCouro" className="h-10 brightness-0 invert" />
            </div>
            <p className="text-leather-300 text-sm mt-2">Painel administrativo</p>
          </div>

          {/* Form */}
          <div className="px-10 py-8 flex flex-col gap-6">
            <div>
              <h2 className="text-leather-900 font-serif font-bold text-xl">Bem-vindo de volta</h2>
              <p className="text-leather-500 text-sm mt-1">Digite sua senha para acessar o painel.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="admin-label">Senha</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-leather-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input pl-10 py-3"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password}
                className="admin-btn-primary py-3.5 mt-1"
              >
                {loading ? 'Entrando...' : 'Entrar no painel'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-leather-500 text-xs mt-6">
          © 2026 VTCouro · Área restrita
        </p>
      </div>
    </div>
  )
}
