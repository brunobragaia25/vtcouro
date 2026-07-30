'use client';

import React, { useState } from 'react';
import Modal from './Modal';

interface EditQuoteModalProps {
  isOpen: boolean;
  quote?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditQuoteModal({
  isOpen,
  quote,
  onClose,
  onSave,
}: EditQuoteModalProps) {
  const [formData, setFormData] = useState(
    quote || {
      name: '',
      email: '',
      phone: '',
      company: '',
      notes: '',
      status: 'novo',
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Editar Orçamento"
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="admin-label">
            Nome do Cliente
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="admin-input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="admin-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>

          <div>
            <label className="admin-label">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="admin-input"
              required
            />
          </div>
        </div>

        <div>
          <label className="admin-label">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="admin-input"
            required
          />
        </div>

        <div>
          <label className="admin-label">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="admin-input"
            required
          >
            <option value="novo">Novo</option>
            <option value="em_progresso">Em progresso</option>
            <option value="respondido">Respondido</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>

        <div>
          <label className="admin-label">
            Notas
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
            className="admin-input resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 admin-btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 admin-btn-primary"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
