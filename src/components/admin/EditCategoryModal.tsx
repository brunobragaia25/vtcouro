'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Modal from './Modal';

interface EditCategoryModalProps {
  isOpen: boolean;
  category?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface SpecificationField {
  label: string;
  key: string;
}

export default function EditCategoryModal({
  isOpen,
  category,
  onClose,
  onSave,
}: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    specificationFields: [] as SpecificationField[],
  });

  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldKey, setNewFieldKey] = useState('');

  useEffect(() => {
    if (category?.id) {
      let fields: SpecificationField[] = [];

      if (category.specificationFields) {
        if (Array.isArray(category.specificationFields)) {
          fields = category.specificationFields;
        } else if (typeof category.specificationFields === 'object') {
          fields = Object.values(category.specificationFields);
        }
      }

      console.log('Loading category:', category.name, 'Raw fields:', category.specificationFields, 'Processed:', fields);

      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        specificationFields: fields,
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        specificationFields: [],
      });
    }
    setNewFieldLabel('');
    setNewFieldKey('');
  }, [category, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddField = () => {
    if (newFieldLabel.trim() && newFieldKey.trim()) {
      setFormData((prev) => ({
        ...prev,
        specificationFields: [
          ...prev.specificationFields,
          { label: newFieldLabel.trim(), key: newFieldKey.trim() },
        ],
      }));
      setNewFieldLabel('');
      setNewFieldKey('');
    }
  };

  const handleRemoveField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specificationFields: prev.specificationFields.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      ...formData,
      specificationFields: formData.specificationFields.length > 0 ? formData.specificationFields : null,
    };
    console.log('Saving category:', dataToSave);
    onSave(dataToSave);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={category?.id ? 'Editar Categoria' : 'Nova Categoria'}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 admin-btn-secondary">
            Cancelar
          </button>
          <button type="submit" form="category-form" className="flex-1 admin-btn-primary">
            Salvar
          </button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="admin-label">
              Nome da Categoria
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
              placeholder="gerado do nome"
            />
          </div>
        </div>

        <div>
          <label className="admin-label">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="admin-input"
          />
        </div>

        {/* Specification Fields */}
        <div className="admin-section">
          <h3 className="admin-section-title">Campos de Especificação</h3>

          {/* Add New Field Section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Rótulo (ex: Material)"
              className="admin-input sm:flex-1"
            />
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Chave (ex: material)"
              className="admin-input sm:flex-1"
            />
            <button
              type="button"
              onClick={handleAddField}
              className="flex items-center justify-center gap-1.5 admin-btn-primary sm:w-auto whitespace-nowrap"
            >
              <Plus size={16} />
              Adicionar
            </button>
          </div>

          {/* Existing Fields */}
          {formData.specificationFields.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.specificationFields.map((field, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-white border border-leather-200 rounded-full"
                >
                  <span className="text-sm text-leather-800">{field.label}</span>
                  <code className="text-[11px] text-leather-400">{field.key}</code>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(idx)}
                    aria-label={`Remover ${field.label}`}
                    className="p-0.5 rounded-full text-leather-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-leather-400">
              Nenhum campo adicionado. Eles aparecem no formulário de produtos desta categoria.
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
