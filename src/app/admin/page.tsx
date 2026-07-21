'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
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
        title: 'ORÇAMENTOS NO MÊS',
        value: quotes.length,
        subtext: `${novasCount} novos`,
        chartColor: 'orange' as const,
      },
      {
        title: 'AGUARDANDO RESPOSTA',
        value: novasCount,
        subtext: 'para processar',
        chartColor: 'yellow' as const,
      },
      {
        title: 'PRODUTOS ATIVOS',
        value: products.length,
        subtext: `${destaques} destaques`,
        chartColor: 'black' as const,
      },
      {
        title: 'CATEGORIAS',
        value: categories.length,
        subtext: 'todas ativas',
        chartColor: 'teal' as const,
      },
    ];
  }, [quotes, products, categories]);

  const recentQuotes = useMemo(() => {
    return quotes
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
          <p className="font-medium">#{value}</p>
          <p className="text-xs text-gray-500">{row.date}</p>
        </div>
      ),
    },
    {
      key: 'client',
      label: 'CLIENTE',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-gray-500">{row.company}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'ITENS',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-gray-500">{row.quantity}</p>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/orcamentos" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
              Ver Orçamentos
            </Link>
            <Link href="/admin/produtos" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
              Ver Produtos
            </Link>
            <Link href="/admin/categorias" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition">
              Ver Categorias
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Últimos Orçamentos</h2>
              <Link href="/admin/orcamentos" className="text-orange-600 hover:text-orange-700 font-medium">
                Ver tudo →
              </Link>
            </div>
          </div>
          <DataTable columns={quoteColumns} data={recentQuotes} />
        </div>
      </div>
    </div>
  );
}
