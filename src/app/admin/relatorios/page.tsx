'use client';

import { useEffect, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

interface QuoteStats {
  total: number;
  novo: number;
  em_progresso: number;
  respondido: number;
  fechado: number;
  percentualRespondido: number;
}

export default function RelatoriosPage() {
  const [stats, setStats] = useState<QuoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [quotesByDay, setQuotesByDay] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/quotes');
        const quotes = await response.json();

        const statusCount = {
          novo: 0,
          em_progresso: 0,
          respondido: 0,
          fechado: 0,
        };

        const dayCount: Record<string, number> = {};

        quotes.forEach((quote: any) => {
          statusCount[quote.status as keyof typeof statusCount]++;

          const date = new Date(quote.createdAt).toLocaleDateString('pt-BR');
          dayCount[date] = (dayCount[date] || 0) + 1;
        });

        const total = quotes.length;
        const percentualRespondido = total > 0 ? (statusCount.respondido / total) * 100 : 0;

        setStats({
          total,
          novo: statusCount.novo,
          em_progresso: statusCount.em_progresso,
          respondido: statusCount.respondido,
          fechado: statusCount.fechado,
          percentualRespondido,
        });

        setQuotesByDay(dayCount);
      } catch (error) {
        console.error('Erro ao carregar stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-center text-[#1f1f1f]">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] p-8">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-center text-[#1f1f1f]">Erro ao carregar relatórios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/orcamentos" className="text-[#4b1c09] hover:underline text-sm mb-4 inline-block">
            ← Voltar aos Orçamentos
          </Link>
          <h1 className="text-4xl font-bold text-[#1f1f1f] mb-2">Relatórios</h1>
          <p className="text-[#666]">Análise de desempenho dos orçamentos</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Total de Orçamentos</p>
            <p className="text-4xl font-bold text-[#4b1c09] mb-2">{stats.total}</p>
            <div className="h-1 bg-leather-900 rounded-full"></div>
          </div>

          {/* Novo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Novos</p>
            <p className="text-4xl font-bold text-[#d2741f] mb-2">{stats.novo}</p>
            <p className="text-sm text-[#666]">{((stats.novo / stats.total) * 100).toFixed(1)}% do total</p>
          </div>

          {/* Em Progresso */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Em Progresso</p>
            <p className="text-4xl font-bold text-[#f59e0b] mb-2">{stats.em_progresso}</p>
            <p className="text-sm text-[#666]">{((stats.em_progresso / stats.total) * 100).toFixed(1)}% do total</p>
          </div>

          {/* Respondido */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Respondidos</p>
            <p className="text-4xl font-bold text-[#10b981] mb-2">{stats.respondido}</p>
            <p className="text-sm text-[#666]">{((stats.respondido / stats.total) * 100).toFixed(1)}% do total</p>
          </div>

          {/* Fechado */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Fechados</p>
            <p className="text-4xl font-bold text-[#6366f1] mb-2">{stats.fechado}</p>
            <p className="text-sm text-[#666]">{((stats.fechado / stats.total) * 100).toFixed(1)}% do total</p>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-[#999] text-sm font-semibold uppercase mb-2">Taxa de Resposta</p>
            <p className="text-4xl font-bold text-[#8b5cf6] mb-2">{stats.percentualRespondido.toFixed(1)}%</p>
            <div className="w-full bg-[#e5e7eb] rounded-full h-2">
              <div
                className="bg-[#8b5cf6] h-2 rounded-full transition-all"
                style={{ width: `${stats.percentualRespondido}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-[#1f1f1f] mb-6">Distribuição por Status</h2>
          <div className="space-y-4">
            {[
              { label: 'Novo', value: stats.novo, color: 'bg-[#d2741f]', textColor: 'text-[#d2741f]' },
              { label: 'Em Progresso', value: stats.em_progresso, color: 'bg-[#f59e0b]', textColor: 'text-[#f59e0b]' },
              { label: 'Respondido', value: stats.respondido, color: 'bg-[#10b981]', textColor: 'text-[#10b981]' },
              { label: 'Fechado', value: stats.fechado, color: 'bg-[#6366f1]', textColor: 'text-[#6366f1]' },
            ].map(status => (
              <div key={status.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${status.textColor}`}>{status.label}</span>
                  <span className="text-sm text-[#666]">
                    {status.value} ({((status.value / stats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-[#e5e7eb] rounded-full h-3">
                  <div
                    className={`${status.color} h-3 rounded-full transition-all`}
                    style={{ width: `${(status.value / stats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#1f1f1f] mb-6">Orçamentos por Dia</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {Object.entries(quotesByDay)
              .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
              .map(([date, count]) => (
                <div key={date} className="flex justify-between items-center p-3 bg-[#f9f9f9] rounded-lg">
                  <span className="text-[#1f1f1f] font-medium">{date}</span>
                  <span className="bg-leather-900 text-white px-3 py-1 rounded-full text-sm font-bold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

