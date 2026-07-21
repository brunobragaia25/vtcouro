'use client';

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { X, Mail, MessageCircle, Download } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-[#8B5240] text-white p-6 flex items-start justify-between flex-shrink-0">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-gray-300">
            Protocolo
          </p>
          <p className="text-2xl font-semibold mb-1">#{quote.protocolNumber}</p>
          <p className="text-sm text-gray-300">
            Recebido em {new Date(quote.createdAt).toLocaleDateString('pt-BR')} {new Date(quote.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
          <div className="flex gap-2">
            {statusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleStatusChange(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  formData.status === option.id
                    ? 'bg-[#8B5240] text-white'
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
          <p className="font-semibold text-lg text-[#1f1f1f] mb-1">{quote.name}</p>
          <p className="text-sm text-gray-600 mb-3">{quote.company}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#1f1f1f]">
              <Mail size={16} className="text-gray-400" />
              <a href={`mailto:${quote.email}`} className="text-blue-600 hover:underline">
                {quote.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-[#1f1f1f]">
              <MessageCircle size={16} className="text-gray-400" />
              <a href={`tel:${quote.phone}`} className="text-blue-600 hover:underline">
                {quote.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f]">
              Items
            </label>
            <span className="text-xs text-gray-600">
              {totalQuantity} unidades · {itemsWithArt}/{quote.items?.length} artes
            </span>
          </div>
          <div className="space-y-3">
            {quote.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-[#d9d9d9] rounded flex items-center justify-center flex-shrink-0">
                    {item.product?.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#1f1f1f]">{item.product?.name}</p>
                    <p className="text-xs text-gray-500">{item.product?.sku}</p>
                    {item.color && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: parseColorEntry(item.color).hex }}
                        />
                        <span className="text-xs text-gray-500">{parseColorEntry(item.color).name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-medium text-[#1f1f1f]">{item.quantity} un.</p>
                  <div className="flex items-center gap-2">
                    {item.artFileUrl ? (
                      <>
                        <span className="text-xs font-semibold text-[#10b981]">✓ Arte</span>
                        <a
                          href={`/api/download?url=${encodeURIComponent(item.artFileUrl)}&name=${item.product?.name}-arte`}
                          className="text-[#4b1c09] hover:text-[#3d1707] transition"
                          title="Download arquivo de arte"
                        >
                          <Download size={16} />
                        </a>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-[#d2741f]">SEM ARTE</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-2">
            Observações
          </label>
          <div className="bg-[#fff5ec] rounded-lg p-4 text-sm text-[#1f1f1f] min-h-20">
            {quote.notes && <p className="italic">&quot;{quote.notes}&quot;</p>}
            {!quote.notes && <p className="text-gray-500">Sem observações</p>}
          </div>
        </div>

        {/* Responder */}
        <div>
          <label className="block text-xs font-bold tracking-wider uppercase text-[#1f1f1f] mb-2">
            Responder
          </label>
          <textarea
            value={formData.response}
            onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
            placeholder="Digite sua resposta..."
            className="w-full px-4 py-3 border border-[#c8c8c8] rounded-lg focus:outline-none focus:border-[#4b1c09] focus:ring-1 focus:ring-[#4b1c09] resize-none"
            rows={4}
          />
          {formData.response.trim() && (
            <button
              onClick={handleSendResponse}
              className="mt-3 w-full px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition font-medium text-sm"
            >
              Enviar resposta por e-mail
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSendEmail}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#c8c8c8] text-[#1f1f1f] rounded-lg hover:bg-gray-50 transition font-medium"
          >
            <Mail size={18} />
            Enviar e-mail
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#8B5240] text-white rounded-lg hover:bg-[#3d1707] transition font-medium"
          >
            <MessageCircle size={18} />
            WhatsApp
          </button>
        </div>

        {/* Convert to Order Button */}
        {formData.status === 'respondido' && (
          <button
            onClick={handleConvertToOrder}
            className="w-full px-4 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition font-medium"
          >
            Converter em Pedido
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-3 bg-[#8B5240] text-white rounded-lg hover:bg-[#3d1707] transition font-medium"
        >
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

