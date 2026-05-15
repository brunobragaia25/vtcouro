'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Bell, Printer } from 'lucide-react';

interface OrderDetailPanelProps {
  isOpen: boolean;
  order?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function OrderDetailPanel({
  isOpen,
  order,
  onClose,
  onSave,
}: OrderDetailPanelProps) {
  const [formData, setFormData] = useState({
    status: 'pendente',
    totalValue: '',
    notes: '',
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || 'pendente',
        totalValue: order.totalValue ? order.totalValue.toString() : '',
        notes: order.notes || '',
      });
    }
  }, [order]);

  const handleStatusChange = (newStatus: string) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleSave = () => {
    onSave({
      status: formData.status,
      totalValue: formData.totalValue ? parseFloat(formData.totalValue) : null,
      notes: formData.notes,
    });
  };

  const handleSendStatus = async () => {
    setIsSending(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/send-status`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('E-mail de notificação enviado com sucesso!');
      } else {
        alert('Erro ao enviar notificação');
      }
    } catch (error) {
      console.error('Error sending status:', error);
      alert('Erro ao enviar notificação');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen || !order) return null;

  const statusOptions = [
    { id: 'pendente', label: 'Pendente' },
    { id: 'em_producao', label: 'Em Produção' },
    { id: 'enviado', label: 'Enviado' },
    { id: 'entregue', label: 'Entregue' },
    { id: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#4b1c09] text-white p-6 flex items-start justify-between flex-shrink-0">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-gray-300">
            Número do Pedido
          </p>
          <p className="text-2xl font-semibold mb-1">#{order.orderNumber}</p>
          <p className="text-sm text-gray-300">
            Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 overflow-y-auto flex-1">
        {/* Status */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-3">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleStatusChange(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  formData.status === option.id
                    ? 'bg-[#4b1c09] text-white'
                    : 'bg-gray-100 text-[#1f1f1f] hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-[#fff5ec] rounded-2xl p-6">
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-3">
            Cliente
          </label>
          <p className="font-semibold text-lg text-[#1f1f1f] mb-1">{order.quote.name}</p>
          <p className="text-sm text-gray-600 mb-3">{order.quote.company || 'Sem empresa'}</p>
          <div className="space-y-2 text-sm">
            <p className="text-[#1f1f1f]">
              📧 <a href={`mailto:${order.quote.email}`} className="text-blue-600 hover:underline">
                {order.quote.email}
              </a>
            </p>
            {order.quote.phone && (
              <p className="text-[#1f1f1f]">
                📞 <a href={`tel:${order.quote.phone}`} className="text-blue-600 hover:underline">
                  {order.quote.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Valor Total */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-2">
            Valor Total (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.totalValue}
            onChange={(e) => setFormData(prev => ({ ...prev, totalValue: e.target.value }))}
            placeholder="0,00"
            className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#4b1c09] focus:ring-1 focus:ring-[#4b1c09]"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-2">
            Notas Internas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Adicione notas sobre o pedido..."
            className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#4b1c09] focus:ring-1 focus:ring-[#4b1c09] resize-none"
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSendStatus}
            disabled={isSending}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition font-medium disabled:opacity-50"
          >
            <Bell size={18} />
            {isSending ? 'Enviando...' : 'Notificar'}
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#4b1c09] text-white rounded-lg hover:bg-[#3d1707] transition font-medium"
          >
            <Printer size={18} />
            Imprimir
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-3 bg-[#4b1c09] text-white rounded-lg hover:bg-[#3d1707] transition font-medium"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}
