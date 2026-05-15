'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateQuote } from '@/hooks/useQuotes';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  selectedColor: string;
  quantity: number;
}

export default function CreateQuoteModal({
  isOpen,
  onClose,
  product,
  selectedColor,
  quantity,
}: CreateQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
  });
  const createQuote = useCreateQuote();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const notes = `Cor: ${selectedColor}\nQuantidade: ${quantity}\n${formData.notes}`;
      await createQuote.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        notes,
        items: [
          {
            productId: product.id,
            quantity,
          },
        ],
        status: 'novo',
      });
      setFormData({ name: '', email: '', phone: '', company: '', notes: '' });
      onClose();
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitar Orçamento
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Summary */}
          <div className="bg-[#fff5ec] rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-600">Produto</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{product.name}</p>
            <p className="text-sm text-gray-600 mt-2">
              Cor: {selectedColor} · Quantidade: {quantity} un.
            </p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
              Nome completo *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d2741f]"
              placeholder="Seu nome"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d2741f]"
              placeholder="seu@email.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
              Telefone/WhatsApp *
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d2741f]"
              placeholder="(11) 98765-4321"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
              Empresa
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d2741f]"
              placeholder="Sua empresa"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-900 mb-2">
              Observações
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d2741f] resize-none"
              placeholder="Informações adicionais..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createQuote.isPending}
              className="flex-1 px-4 py-2 bg-[#4b1c09] text-white rounded-lg hover:bg-[#3d1707] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {createQuote.isPending ? 'Enviando...' : 'Solicitar Orçamento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
