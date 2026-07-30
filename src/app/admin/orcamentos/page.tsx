'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ShoppingBag, RotateCcw, Trash2 } from 'lucide-react';
import SearchBar from '@/components/admin/SearchBar';
import FilterTabs from '@/components/admin/FilterTabs';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import QuoteDetailPanel from '@/components/admin/QuoteDetailPanel';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { useQuotes, useUpdateQuote, useDeleteQuote } from '@/hooks/useQuotes';

const filterTabs = [
  { id: 'todos', label: 'Todos', count: 0 },
  { id: 'novo', label: 'Novos', count: 0 },
  { id: 'em_progresso', label: 'Em progresso', count: 0 },
  { id: 'respondido', label: 'Respondidos', count: 0 },
  { id: 'fechado', label: 'Fechados', count: 0 },
];

export default function AdminOrcamentos() {
  const [activeTab, setActiveTab] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [deletingQuote, setDeletingQuote] = useState<any>(null);

  const { data: quotes = [], isLoading } = useQuotes();
  const updateQuote = useUpdateQuote();
  const deleteQuote = useDeleteQuote();

  const handleSaveQuote = async (data: any) => {
    if (editingQuote) {
      await updateQuote.mutateAsync({
        id: editingQuote.id,
        data,
      });
      setEditingQuote(null);
    }
  };

  const handleDeleteQuote = async () => {
    if (deletingQuote) {
      await deleteQuote.mutateAsync(deletingQuote.id);
      setDeletingQuote(null);
    }
  };

  const handleConvertToOrder = async (quoteId: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao converter em pedido');
        return;
      }

      alert('Pedido criado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Error converting to order:', error);
      alert('Erro ao converter em pedido');
    }
  };

  const handleUndoOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja desfazer este pedido?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Erro ao desfazer pedido');
        return;
      }

      alert('Pedido desfeito com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Error undoing order:', error);
      alert('Erro ao desfazer pedido');
    }
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote: any) => {
      const matchesTab = activeTab === 'todos' || quote.status === activeTab;
      const matchesSearch =
        quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [quotes, activeTab, searchTerm]);

  // Count by status
  const tabsWithCounts = filterTabs.map(tab => ({
    ...tab,
    count: tab.id === 'todos' ? quotes.length : quotes.filter((q: any) => q.status === tab.id).length,
  }));

  const columns = [
    {
      key: 'id',
      label: 'PROTOCOLO',
      render: (value: string, row: any) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleDateString('pt-BR')}</p>
        </div>
      ),
    },
    {
      key: 'name',
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
      render: (value: any, row: any) => (
        <div>
          <p className="font-medium">{value?.length || 0} produtos</p>
          <p className="text-xs text-gray-500">{row.itemsQty || 0} un.</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'STATUS',
      render: (value: string) => {
        const statusMap: { [key: string]: string } = {
          novo: 'Novo',
          em_progresso: 'Em progresso',
          respondido: 'Respondido',
          fechado: 'Fechado',
        };
        return (
          <StatusBadge status={value as any}>
            {statusMap[value]}
          </StatusBadge>
        );
      },
    },
    {
      key: 'actions',
      label: '',
      render: (value: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          {row.status === 'respondido' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!row.order) {
                    handleConvertToOrder(row.id);
                  }
                }}
                disabled={!!row.order}
                className={`px-3 py-1 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                  row.order
                    ? 'bg-[#10b981] opacity-50 cursor-not-allowed'
                    : 'bg-[#10b981] hover:bg-[#059669]'
                }`}
                title={row.order ? 'Pedido já criado' : 'Converter em Pedido'}
              >
                <ShoppingBag size={14} />
                {row.order ? 'Pedido ✓' : 'Pedido'}
              </button>
              {row.order && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUndoOrder(row.order.id);
                  }}
                  className="text-[#d2741f] hover:text-[#b85e18] transition"
                  title="Desfazer pedido"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!row.order) setDeletingQuote(row);
            }}
            disabled={!!row.order}
            title={row.order ? 'Desfaça o pedido antes de excluir' : 'Excluir orçamento'}
            className={`transition ${row.order ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
          >
            <Trash2 size={18} />
          </button>
          <button
            onClick={() => setEditingQuote(row)}
            className="text-leather-600 hover:text-leather-900"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-leather-900">Orçamentos</h1>
        <p className="text-sm text-leather-500 mt-1">
          {quotes.filter((q: any) => q.status === 'novo').length} aguardando primeira resposta
        </p>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Buscar por nome, empresa ou protocolo..."
        onSearch={setSearchTerm}
      />

      {/* Status Tabs */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <FilterTabs tabs={tabsWithCounts} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="text-sm text-leather-500 flex-shrink-0">
          {filteredQuotes.length} de {quotes.length}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm text-leather-500">Carregando orçamentos...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredQuotes} />
      )}

      {/* Quote Detail Modal */}
      {editingQuote && (
        <QuoteDetailPanel
          isOpen={true}
          quote={editingQuote}
          onClose={() => setEditingQuote(null)}
          onSave={handleSaveQuote}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deletingQuote}
        title="Deletar Orçamento"
        message="Você tem certeza que deseja deletar este orçamento?"
        itemName={deletingQuote?.id || ''}
        onClose={() => setDeletingQuote(null)}
        onConfirm={handleDeleteQuote}
        isLoading={deleteQuote.isPending}
      />
    </div>
  );
}

