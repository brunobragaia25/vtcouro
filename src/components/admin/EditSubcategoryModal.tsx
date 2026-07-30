'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface EditSubcategoryModalProps {
  isOpen: boolean;
  subcategory?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditSubcategoryModal({
  isOpen,
  subcategory,
  onClose,
  onSave,
}: EditSubcategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  useEffect(() => {
    if (subcategory?.id) {
      setFormData({
        name: subcategory.name || '',
        slug: subcategory.slug || '',
        description: subcategory.description || '',
      });
    } else {
      setFormData({ name: '', slug: '', description: '' });
    }
  }, [subcategory, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={subcategory?.id ? 'Editar Subcategoria' : 'Nova Subcategoria'}
      onClose={onClose}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="admin-label">
            Nome da Subcategoria
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

        <div>
          <label className="admin-label">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="admin-input"
            placeholder="ex: bolsa-de-viagem"
          />
        </div>

        <div>
          <label className="admin-label">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="admin-input"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t">
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
