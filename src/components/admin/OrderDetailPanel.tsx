'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Mail, Phone, Bell, Printer } from 'lucide-react';
import Modal from './Modal';

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
  const queryClient = useQueryClient();
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
      const saveResponse = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: formData.status,
          totalValue: formData.totalValue ? parseFloat(formData.totalValue) : null,
          notes: formData.notes,
        }),
      });
      if (!saveResponse.ok) {
        alert('Erro ao salvar status antes de notificar');
        return;
      }

      const response = await fetch(`/api/orders/${order.id}/send-status`, {
        method: 'POST',
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        alert('Status salvo e e-mail de notificação enviado com sucesso!');
      } else {
        alert('Status salvo, mas houve erro ao enviar a notificação por e-mail');
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <span className="block">
          <span className="block text-[10px] font-sans font-semibold tracking-widest uppercase text-leather-500">
            Número do Pedido
          </span>
          <span className="block">#{order.orderNumber}</span>
          <span className="block font-sans text-xs font-normal text-leather-500 mt-0.5">
            Criado em {new Date(order.createdAt).toLocaleDateString('pt-BR')} às {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </span>
      }
      footer={
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleSendStatus}
              disabled={isSending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Bell size={16} />
              {isSending ? 'Enviando...' : 'Notificar'}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 admin-btn-secondary"
            >
              <Printer size={16} />
              Imprimir
            </button>
          </div>
          <button onClick={handleSave} className="w-full admin-btn-primary">
            Salvar Alterações
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status */}
        <div>
          <label className="admin-section-title mb-3">
            Status
          </label>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleStatusChange(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  formData.status === option.id
                    ? 'bg-leather-900 text-white'
                    : 'bg-leather-100 text-leather-700 hover:bg-leather-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cliente */}
        <div className="bg-leather-100/60 rounded-2xl p-6">
          <label className="admin-section-title mb-3">
            Cliente
          </label>
          <p className="font-semibold text-lg text-leather-900 mb-1">{order.quote.name}</p>
          <p className="text-sm text-leather-500 mb-3">{order.quote.company || 'Sem empresa'}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-leather-400 flex-shrink-0" />
              <a href={`mailto:${order.quote.email}`} className="text-leather-700 hover:text-leather-900 hover:underline">
                {order.quote.email}
              </a>
            </div>
            {order.quote.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-leather-400 flex-shrink-0" />
                <a href={`tel:${order.quote.phone}`} className="text-leather-700 hover:text-leather-900 hover:underline">
                  {order.quote.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Valor Total */}
        <div>
          <label className="admin-section-title mb-2">
            Valor Total (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.totalValue}
            onChange={(e) => setFormData(prev => ({ ...prev, totalValue: e.target.value }))}
            placeholder="0,00"
            className="admin-input"
          />
        </div>

        {/* Notas */}
        <div>
          <label className="admin-section-title mb-2">
            Notas Internas
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Adicione notas sobre o pedido..."
            className="admin-input resize-none"
            rows={4}
          />
        </div>

      </div>
    </Modal>
  );
}

