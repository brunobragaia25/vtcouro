'use client';

import { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import { useOrders, useUpdateOrder } from '@/hooks/useOrders';
import OrderDetailPanel from '@/components/admin/OrderDetailPanel';

export default function PedidosPage() {
  const { data: orders = [], isLoading } = useOrders();
  const updateOrder = useUpdateOrder();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filtro por status
    if (statusFilter !== 'todos') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          order.orderNumber.toLowerCase().includes(search) ||
          order.quote.name.toLowerCase().includes(search) ||
          order.quote.email.toLowerCase().includes(search)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'date') {
        compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'number') {
        compareValue = a.orderNumber.localeCompare(b.orderNumber);
      } else if (sortBy === 'value') {
        compareValue = (a.totalValue || 0) - (b.totalValue || 0);
      }

      return sortOrder === 'desc' ? -compareValue : compareValue;
    });

    return result;
  }, [orders, statusFilter, searchTerm, sortBy, sortOrder]);

  const handleSave = async (data: any) => {
    if (!selectedOrder) return;

    try {
      await updateOrder.mutateAsync({
        id: selectedOrder.id,
        ...data,
      });
      setSelectedOrder(null);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Pedido', 'Cliente', 'Email', 'Status', 'Valor', 'Data', 'Itens'];
    const rows = filteredOrders.map(order => [
      order.orderNumber,
      order.quote.name,
      order.quote.email,
      order.status,
      order.totalValue ? `R$ ${order.totalValue.toFixed(2)}` : '-',
      new Date(order.createdAt).toLocaleDateString('pt-BR'),
      order.quote.items?.length || 0,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `pedidos-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const statusOptions = [
    { id: 'todos', label: 'Todos', color: 'bg-gray-100' },
    { id: 'pendente', label: 'Pendente', color: 'bg-yellow-100' },
    { id: 'em_producao', label: 'Em Produção', color: 'bg-blue-100' },
    { id: 'enviado', label: 'Enviado', color: 'bg-purple-100' },
    { id: 'entregue', label: 'Entregue', color: 'bg-green-100' },
    { id: 'cancelado', label: 'Cancelado', color: 'bg-red-100' },
  ];

  return (
    <div className="flex h-full gap-5">
      {/* Left Column */}
      <div className={`flex-1 min-w-0 transition-all duration-300 ${selectedOrder ? 'hidden md:block' : 'block'}`}>
        <div className="bg-white rounded-2xl p-6 border border-[#c8c8c8] h-full flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#1f1f1f] mb-4">Pedidos</h1>

            {/* Busca */}
            <div className="mb-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#4b1c09] focus:ring-1 focus:ring-[#4b1c09]"
                />
              </div>
            </div>

            {/* Filtros e Ações */}
            <div className="flex gap-2 flex-wrap mb-4">
              {statusOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => setStatusFilter(option.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                    statusFilter === option.id
                      ? 'bg-[#8B5240] text-white'
                      : 'bg-gray-100 text-[#1f1f1f] hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Ordenação e Ações */}
            <div className="flex gap-2 flex-wrap">
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {['date', 'number', 'value'].map(option => (
                  <button
                    key={option}
                    onClick={() => {
                      if (sortBy === option) {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy(option as any);
                        setSortOrder('desc');
                      }
                    }}
                    className={`px-3 py-1 rounded text-xs font-medium transition flex items-center gap-1 ${
                      sortBy === option
                        ? 'bg-[#8B5240] text-white'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option === 'date' && 'Data'}
                    {option === 'number' && 'Número'}
                    {option === 'value' && 'Valor'}
                    {sortBy === option && (
                      <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-xs font-medium"
              >
                <Download size={16} />
                CSV
              </button>
            </div>
          </div>

          {/* Lista */}
          {isLoading ? (
            <div className="text-center py-8 text-[#1f1f1f]">Carregando pedidos...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-[#1f1f1f]">Nenhum pedido encontrado</div>
          ) : (
            <div className="space-y-3 overflow-y-auto flex-1">
              {filteredOrders.map(order => {
                const statusColor = {
                  pendente: 'border-l-yellow-500',
                  em_producao: 'border-l-blue-500',
                  enviado: 'border-l-purple-500',
                  entregue: 'border-l-green-500',
                  cancelado: 'border-l-red-500',
                };

                const statusLabels: { [key: string]: string } = {
                  pendente: 'Pendente',
                  em_producao: 'Em Produção',
                  enviado: 'Enviado',
                  entregue: 'Entregue',
                  cancelado: 'Cancelado',
                };

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 bg-gray-50 rounded-lg border-l-4 cursor-pointer transition hover:bg-gray-100 ${
                      statusColor[order.status as keyof typeof statusColor]
                    } ${selectedOrder?.id === order.id ? 'ring-2 ring-[#4b1c09]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-[#1f1f1f]">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">{order.quote.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-[#4b1c09] mb-1">
                          {statusLabels[order.status]}
                        </p>
                        {order.totalValue && (
                          <p className="text-sm font-semibold text-[#1f1f1f]">
                            R$ {order.totalValue.toFixed(2).replace('.', ',')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{order.quote.items?.length || 0} itens</span>
                      <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Detail Panel */}
      {selectedOrder && (
        <div className="w-full md:w-[420px] md:flex-shrink-0 bg-white rounded-2xl border border-[#c8c8c8] overflow-hidden shadow-lg">
          <OrderDetailPanel
            isOpen={true}
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
}

