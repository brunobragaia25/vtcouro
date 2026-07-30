'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { FileText, Clock, Package, Grid3X3, ArrowRight, Inbox } from 'lucide-react';
import MetricCard from '@/components/admin/MetricCard';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import { useQuotes } from '@/hooks/useQuotes';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function AdminDashboard() {
  const { data: quotes = [] } = useQuotes();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const metrics = useMemo(() => {
    const novasCount = quotes.filter((q: any) => q.status === 'novo').length;
    const destaques = products.filter((p: any) => p.isFeatured).length;

    return [
      {
        title: 'Orçamentos no mês',
        value: quotes.length,
        subtext: `${novasCount} novos`,
        icon: <FileText size={18} />,
        tone: 'leather' as const,
      },
      {
        title: 'Aguardando resposta',
        value: novasCount,
        subtext: 'para processar',
        icon: <Clock size={18} />,
        tone: 'gold' as const,
      },
      {
        title: 'Produtos ativos',
        value: products.length,
        subtext: `${destaques} destaques`,
        icon: <Package size={18} />,
        tone: 'neutral' as const,
      },
      {
        title: 'Categorias',
        value: categories.length,
        subtext: 'todas ativas',
        icon: <Grid3X3 size={18} />,
        tone: 'success' as const,
      },
    ];
  }, [quotes, products, categories]);

  const recentQuotes = useMemo(() => {
    return [...quotes]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((quote: any) => ({
        id: quote.id.substring(0, 8).toUpperCase(),
        client: quote.name,
        company: quote.company || '—',
        date: new Date(quote.createdAt).toLocaleDateString('pt-BR'),
        items: `${quote.items?.length || 0} produto(s)`,
        quantity: `${quote.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0} un.`,
        status: quote.status,
      }));
  }, [quotes]);

  const quoteColumns = [
    {
      key: 'id',
      label: 'PROTOCOLO',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-leather-900">#{value}</p>
          <p className="text-xs text-leather-500 mt-0.5">{row.date}</p>
        </div>
      ),
    },
    {
      key: 'client',
      label: 'CLIENTE',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-leather-900">{value}</p>
          <p className="text-xs text-leather-500 mt-0.5">{row.company}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'ITENS',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium text-leather-900">{value}</p>
          <p className="text-xs text-leather-500 mt-0.5">{row.quantity}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (value: string) => (
        <StatusBadge status={value as any}>
          {value === 'novo' && 'Novo'}
          {value === 'em_progresso' && 'Em progresso'}
          {value === 'respondido' && 'Respondido'}
          {value === 'fechado' && 'Fechado'}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-leather-900">
            Dashboard
          </h1>
          <p className="text-sm text-leather-500 mt-1">Visão geral do seu negócio</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/orcamentos"
            className="px-4 py-2 text-sm font-medium bg-leather-900 text-white rounded-lg hover:bg-leather-800 transition"
          >
            Ver Orçamentos
          </Link>
          <Link
            href="/admin/produtos"
            className="px-4 py-2 text-sm font-medium bg-white text-leather-800 border border-leather-200 rounded-lg hover:bg-leather-100 transition"
          >
            Ver Produtos
          </Link>
          <Link
            href="/admin/categorias"
            className="px-4 py-2 text-sm font-medium bg-white text-leather-800 border border-leather-200 rounded-lg hover:bg-leather-100 transition"
          >
            Ver Categorias
          </Link>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Recent Quotes */}
      <div className="bg-white rounded-xl border border-leather-200/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-leather-200/60 flex items-center justify-between gap-3">
          <h2 className="font-serif text-lg font-bold text-leather-900">
            Últimos Orçamentos
          </h2>
          <Link
            href="/admin/orcamentos"
            className="inline-flex items-center gap-1 text-sm text-leather-600 hover:text-leather-900 font-medium transition"
          >
            Ver tudo <ArrowRight size={14} />
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-leather-100 flex items-center justify-center mb-3">
              <Inbox size={22} className="text-leather-400" />
            </div>
            <p className="text-sm font-medium text-leather-800">
              Nenhum orçamento ainda
            </p>
            <p className="text-xs text-leather-500 mt-1">
              Os pedidos recebidos pelo site aparecem aqui.
            </p>
          </div>
        ) : (
          <div className="p-4 md:p-0">
            <DataTable columns={quoteColumns} data={recentQuotes} bare />
          </div>
        )}
      </div>
    </div>
  );
}
