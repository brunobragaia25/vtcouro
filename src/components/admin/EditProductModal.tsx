'use client';

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';
import axios from 'axios';
import { parseColorEntry } from '@/lib/colors';

interface EditProductModalProps {
  isOpen: boolean;
  product?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditProductModal({
  isOpen,
  product,
  onClose,
  onSave,
}: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    minQuantity: 50,
    availableColors: ['Preto', 'Marrom'],
    specifications: {} as Record<string, string>,
    customization: '',
    care: '',
    images: [] as string[],
    imageUrl: '',
    isActive: true,
    isFeatured: false,
    isNew: false,
    orderIndex: 0,
    featuredOrder: 0,
    newOrder: 0,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const prevCategoryId = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fetch categories
      axios.get('/api/categories')
        .then(res => {
          setCategories(res.data);

          // Set form data
          if (product?.id) {
            const categoryData = res.data.find((c: any) => c.id === product.categoryId);
            setSelectedCategory(categoryData);

            setFormData({
              name: product.name || '',
              sku: product.sku || '',
              categoryId: product.categoryId || '',
              subcategoryId: product.subcategoryId || '',
              description: product.description || '',
              minQuantity: product.minQuantity || 50,
              availableColors: product.availableColors || ['Preto', 'Marrom'],
              specifications: product.specifications || {},
              customization: product.customization || '',
              care: product.care || '',
              images: product.images || [],
              imageUrl: product.imageUrl || '',
              isActive: product.isActive === true || product.isActive === undefined || product.isActive === null,
              isFeatured: product.isFeatured === true,
              isNew: product.isNew === true,
              orderIndex: product.orderIndex ?? 0,
              featuredOrder: product.featuredOrder ?? 0,
              newOrder: product.newOrder ?? 0,
            });
          } else {
            setSelectedCategory(null);
            setFormData({
              name: '',
              sku: '',
              categoryId: '',
              subcategoryId: '',
              description: '',
              minQuantity: 50,
              availableColors: ['Preto', 'Marrom'],
              specifications: {},
              customization: '',
              care: '',
              images: [],
              imageUrl: '',
              isActive: true,
              isFeatured: false,
              isNew: false,
              orderIndex: 0,
              featuredOrder: 0,
              newOrder: 0,
            });
          }
        })
        .catch(err => console.error('Failed to fetch categories', err));

      prevCategoryId.current = product?.categoryId || null;
    }
  }, [product, isOpen]);

  // Update selected category when categoryId changes
  useEffect(() => {
    const category = categories.find(c => c.id === formData.categoryId);
    setSelectedCategory(category);

    // Reset specifications for new category
    if (category && !product?.id) {
      const emptySpecs: Record<string, string> = {};
      category.specificationFields?.forEach((field: any) => {
        emptySpecs[field.key] = '';
      });
      setFormData(prev => ({ ...prev, specifications: emptySpecs }));
    }

    // Reset subcategory when the user manually switches category
    if (prevCategoryId.current !== null && prevCategoryId.current !== formData.categoryId) {
      setFormData(prev => ({ ...prev, subcategoryId: '' }));
    }
    prevCategoryId.current = formData.categoryId;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.categoryId, categories]);

  // Fetch subcategories for the selected category
  useEffect(() => {
    if (!formData.categoryId) {
      setSubcategories([]);
      return;
    }
    axios.get('/api/subcategories', { params: { categoryId: formData.categoryId } })
      .then(res => setSubcategories(res.data))
      .catch(err => console.error('Failed to fetch subcategories', err));
  }, [formData.categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'minQuantity' ? parseInt(value) : value,
    }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value,
      },
    }));
  };

  const addColor = () => {
    setFormData((prev: any) => ({
      ...prev,
      availableColors: [...prev.availableColors, 'Nova Cor|#cccccc'],
    }))
  }

  const removeColor = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      availableColors: prev.availableColors.filter((_: any, i: number) => i !== index),
    }))
  }

  const updateColorName = (index: number, name: string) => {
    setFormData((prev: any) => {
      const colors = [...prev.availableColors]
      const { hex } = parseColorEntry(colors[index])
      colors[index] = `${name}|${hex}`
      return { ...prev, availableColors: colors }
    })
  }

  const updateColorHex = (index: number, hex: string) => {
    setFormData((prev: any) => {
      const colors = [...prev.availableColors]
      const { name } = parseColorEntry(colors[index])
      colors[index] = `${name}|${hex}`
      return { ...prev, availableColors: colors }
    })
  }

  const handleImagesChange = (images: string[]) => {
    setFormData((prev: any) => ({
      ...prev,
      images,
      imageUrl: images[0] || '', // Use primeira imagem como imageUrl
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      alert('Selecione uma categoria');
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={product?.id ? 'Editar Produto' : 'Novo Produto'}
      onClose={onClose}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        {/* Informações Básicas */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Informações Básicas</h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
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
                SKU *
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoria
            </label>
            <select
              name="subcategoryId"
              value={formData.subcategoryId || ''}
              onChange={handleChange}
              disabled={!formData.categoryId || subcategories.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">
                {subcategories.length === 0 ? 'Nenhuma subcategoria cadastrada' : 'Selecione uma subcategoria'}
              </option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3">
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
        </div>

        {/* Imagens */}
        <div className="border-b pb-4">
          <ImageUploader
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={4}
          />
        </div>

        {/* Configurações de Venda */}
        <div className="border-b pb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Configurações de Venda</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade Mínima de Pedido
            </label>
            <input
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Cores Disponíveis</label>
              <button
                type="button"
                onClick={addColor}
                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
              >
                + Adicionar cor
              </button>
            </div>
            <div className="space-y-2">
              {formData.availableColors.map((raw: string, index: number) => {
                const { name, hex } = parseColorEntry(raw)
                return (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={hex}
                      onChange={(e) => updateColorHex(index, e.target.value)}
                      className="w-9 h-9 rounded cursor-pointer border border-gray-300 p-0.5"
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateColorName(index, e.target.value)}
                      placeholder="Nome da cor"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                    <button
                      type="button"
                      onClick={() => removeColor(index)}
                      className="text-gray-400 hover:text-red-500 transition text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Campos de Especificação */}
        {selectedCategory?.specificationFields && selectedCategory.specificationFields.length > 0 && (
          <div className="border-b pb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Especificações</h3>
            <div className="space-y-3">
              {selectedCategory.specificationFields.map((field: any) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={formData.specifications[field.key] || ''}
                    onChange={(e) => handleSpecificationChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo das Abas */}
        <div className="border-b pb-4">
        </div>

        {/* Status e Destaque */}
        <div className="border-t pt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-400"
            />
            <span className="text-sm font-medium text-gray-700">Produto Ativo</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-400"
            />
            <span className="text-sm font-medium text-gray-700">Destacar na Home</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={(formData as any).isNew}
              onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
              className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-400"
            />
            <span className="text-sm font-medium text-gray-700">Lançamento</span>
          </label>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordem em Destaque</label>
            <input
              type="number"
              min="0"
              value={(formData as any).featuredOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, featuredOrder: parseInt(e.target.value) || 0 }))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Ordem em Lançamentos</label>
            <input
              type="number"
              min="0"
              value={(formData as any).newOrder}
              onChange={(e) => setFormData(prev => ({ ...prev, newOrder: parseInt(e.target.value) || 0 }))}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
            <span className="text-xs text-gray-400">menor número = primeiro</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
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
