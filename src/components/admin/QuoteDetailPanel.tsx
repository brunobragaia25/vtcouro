'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Mail, MessageCircle, Download } from 'lucide-react';
import Modal from './Modal';
import { parseColorEntry } from '@/lib/colors';

interface QuoteDetailPanelProps {
  isOpen: boolean;
  quote?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function QuoteDetailPanel({
  isOpen,
  quote,
  onClose,
  onSave,
}: QuoteDetailPanelProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    status: 'novo',
    notes: '',
    response: '',
  });

  useEffect(() => {
    if (quote) {
      setFormData({
        status: quote.status || 'novo',
        notes: quote.notes || '',
        response: '',
      });
    }
  }, [quote]);

  const handleStatusChange = (newStatus: string) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const handleSave = () => {
    onSave({
      status: formData.status,
      notes: formData.notes,
    });
  };

  const handleSendEmail = async () => {
    try {
      const response = await fetch(`/api/quotes/${quote.id}/send-email`, {
        method: 'POST',
      });

      if (!response.ok) {
        alert('Erro ao enviar e-mail');
        return;
      }

      alert('E-mail enviado com sucesso!');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Erro ao enviar e-mail');
    }
  };

  const handleSendWhatsApp = () => {
    const text = `Olá ${quote.name}! Seu orçamento #${quote.protocolNumber} foi recebido. Status: ${
      formData.status === 'novo'
        ? 'Novo'
        : formData.status === 'em_progresso'
          ? 'Em progresso'
          : formData.status === 'respondido'
            ? 'Respondido'
            : 'Fechado'
    }`;

    const phoneNumber = quote.phone?.replace(/\D/g, '') || '';
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendResponse = async () => {
    if (!formData.response.trim()) {
      alert('Digite uma resposta');
      return;
    }

    try {
      const response = await fetch(`/api/quotes/${quote.id}/send-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: formData.response }),
      });

      if (!response.ok) {
        alert('Erro ao enviar resposta');
        return;
      }

      alert('Resposta enviada com sucesso!');
      setFormData(prev => ({ ...prev, response: '', status: 'respondido' }));
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Erro ao enviar resposta');
    }
  };

  const handleConvertToOrder = async () => {
    if (!quote.id) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quoteId: quote.id }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Erro ao converter em pedido');
        return;
      }

      alert('Pedido criado com sucesso!');
      window.dispatchEvent(new Event('orderCreated'));
    } catch (error) {
      console.error('Error converting to order:', error);
      alert('Erro ao converter em pedido');
    }
  };

  if (!isOpen || !quote) return null;

  const statusOptions = [
    { id: 'novo', label: 'Novo' },
    { id: 'em_progresso', label: 'Em progresso' },
    { id: 'respondido', label: 'Respondido' },
    { id: 'fechado', label: 'Fechado' },
  ];

  const totalQuantity = quote.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
  const itemsWithArt = quote.items?.filter((item: any) => item.artFileUrl).length || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <span className="block">
          <span className="block text-[10px] font-sans font-semibold tracking-widest uppercase text-leather-500">
            Protocolo
          </span>
          <span className="block">#{quote.protocolNumber}</span>
          <span className="block font-sans text-xs font-normal text-leather-500 mt-0.5">
            Recebido em {new Date(quote.createdAt).toLocaleDateString('pt-BR')} às {new Date(quote.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </span>
      }
      footer={
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={handleSendEmail}
              className="flex-1 flex items-center justify-center gap-2 admin-btn-secondary"
            >
              <Mail size={16} />
              E-mail
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 admin-btn-secondary"
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
            {formData.status === 'respondido' && (
              <button
                onClick={handleConvertToOrder}
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              >
                Converter em Pedido
              </button>
            )}
          </div>
          <button onClick={handleSave} className="w-full admin-btn-primary">
            Salvar alterações
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
          <div className="flex gap-2">
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
          <p className="font-semibold text-lg text-leather-900 mb-1">{quote.name}</p>
          <p className="text-sm text-leather-500 mb-3">{quote.company}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-leather-900">
              <Mail size={16} className="text-leather-400" />
              <a href={`mailto:${quote.email}`} className="text-leather-700 hover:text-leather-900 hover:underline">
                {quote.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-leather-900">
              <MessageCircle size={16} className="text-leather-400" />
              <a href={`tel:${quote.phone}`} className="text-leather-700 hover:text-leather-900 hover:underline">
                {quote.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="admin-section-title">
              Items
            </label>
            <span className="text-xs text-leather-500">
              {totalQuantity} unidades · {itemsWithArt}/{quote.items?.length} artes
            </span>
          </div>
          <div className="space-y-3">
            {quote.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-leather-50 border border-leather-200/60 rounded-xl"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-leather-200 rounded flex items-center justify-center flex-shrink-0">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <svg className="w-5 h-5 text-leather-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-leather-900">{item.product?.name}</p>
                    <p className="text-xs text-leather-500">{item.product?.sku}</p>
                    {item.color && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-leather-300 flex-shrink-0"
                          style={{ backgroundColor: parseColorEntry(item.color).hex }}
                        />
                        <span className="text-xs text-leather-500">{parseColorEntry(item.color).name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-medium text-leather-900">{item.quantity} un.</p>
                  <div className="flex items-center gap-2">
                    {item.artFileUrl ? (
                      <>
                        <span className="text-xs font-semibold text-emerald-600">✓ Arte</span>
                        <a
                          href={`/api/download?url=${encodeURIComponent(item.artFileUrl)}&name=${item.product?.name}-arte`}
                          className="text-leather-600 hover:text-leather-900 transition"
                          title="Download arquivo de arte"
                        >
                          <Download size={16} />
                        </a>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">SEM ARTE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="admin-section-title mb-2">
            Observações
          </label>
          <div className="bg-leather-100/60 rounded-lg p-4 text-sm text-leather-900 min-h-20">
            {quote.notes && <p className="italic">&quot;{quote.notes}&quot;</p>}
            {!quote.notes && <p className="text-leather-500">Sem observações</p>}
          </div>
        </div>

        {/* Responder */}
        <div>
          <label className="admin-section-title mb-2">
            Responder
          </label>
          <textarea
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            placeholder="Digite sua resposta..."
            className="w-full px-4 py-3 border border-leather-200 rounded-lg focus:outline-none focus:border-leather-400 focus:ring-2 focus:ring-leather-300/40 resize-none"
            rows={4}
          />
          {formData.response.trim() && (
            <button
              onClick={handleSendResponse}
              className="mt-3 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
            >
              Enviar resposta por e-mail
            </button>
          )}
        </div>

      </div>
    </Modal>
  );
}

