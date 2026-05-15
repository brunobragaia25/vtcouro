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
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome da Categoria
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL)
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            placeholder="ex: carteiras"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
          />
        </div>

        {/* Specification Fields */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Campos de Especificação</h3>

          {/* Add New Field Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-xs font-semibold text-orange-900 mb-3 uppercase">Adicionar Novo Campo</p>
            <input
              type="text"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              placeholder="Ex: Material"
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm mb-2"
            />
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Chave (ex: material)"
              className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm mb-3"
            />
            <button
              type="button"
              onClick={handleAddField}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Adicionar Campo
            </button>
          </div>

          {/* Existing Fields */}
          {formData.specificationFields.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-3 uppercase">Campos Adicionados</p>
              <div className="space-y-2">
                {formData.specificationFields.map((field, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{field.label}</p>
                      <p className="text-xs text-gray-500 font-mono">{field.key}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(idx)}
                      className="p-2 hover:bg-red-100 rounded text-red-600 transition-colors flex-shrink-0"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.specificationFields.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p className="text-sm">Nenhum campo adicionado</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
