'use client';

import React, { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ImageIcon } from 'lucide-react';
import EditCategoryModal from '@/components/admin/EditCategoryModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import CategorySubcategories from '@/components/admin/CategorySubcategories';
import { useCategories, useUpdateCategory, useDeleteCategory, useCreateCategory, useReorderCategories } from '@/hooks/useCategories';

const EMPTY_CATEGORIES: any[] = [];

const categoryIcons: { [key: string]: string } = {
  'Carteiras': '👜',
  'Bolsas': '👝',
  'Pastas': '💼',
  'Sacolas': '🛍️',
  'Mochila': '🎒',
};

export default function AdminCategorias() {
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [localCategories, setLocalCategories] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetId = useRef<string | null>(null);

  const { data: categories = EMPTY_CATEGORIES, isLoading } = useCategories();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createCategory = useCreateCategory();
  const reorderCategories = useReorderCategories();

  React.useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const handleDragStart = (idx: number) => {
    setDraggedItem(idx);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (idx: number) => {
    if (draggedItem === null || draggedItem === idx) return;

    const newCategories = [...localCategories];
    const draggedCategory = newCategories[draggedItem];
    newCategories.splice(draggedItem, 1);
    newCategories.splice(idx, 0, draggedCategory);

    setLocalCategories(newCategories);
    setDraggedItem(null);

    await reorderCategories.mutateAsync(newCategories);
  };

  const handleSaveCategory = async (data: any) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        data,
      });
    } else {
      await createCategory.mutateAsync(data);
    }
  };

  const handleDeleteCategory = async () => {
    if (deletingCategory) {
      await deleteCategory.mutateAsync(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = uploadTargetId.current;
    if (!file || !id) return;
    setUploadingId(id);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/categories/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error();
      const { url } = await res.json();
      await updateCategory.mutateAsync({ id, data: { imageUrl: url } });
    } catch {
      alert('Erro ao enviar imagem');
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerImageUpload = (id: string) => {
    uploadTargetId.current = id;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            {localCategories.length} categorias - arraste para reordenar a exibição no site
          </p>
        </div>
        <button
          onClick={() => setEditingCategory({})}
          className="bg-[#8B5240] hover:bg-[#2d1810] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Nova categoria
        </button>
      </div>

      {/* Categories List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Carregando categorias...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {localCategories.map((category, idx) => (
            <div
              key={category.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={`bg-white border border-gray-200 rounded-xl p-4 transition-all cursor-grab active:cursor-grabbing ${
                draggedItem === idx ? 'opacity-50' : ''
              }`}
            >
              <div className="flex flex-wrap items-center gap-4">
                <button className="text-gray-300 hover:text-gray-600">
                  <GripVertical size={20} />
                </button>

                <div className="flex-1 flex flex-wrap items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 flex-shrink-0 group">
                    <button
                      onClick={() => triggerImageUpload(category.id)}
                      disabled={uploadingId === category.id}
                      className="w-16 h-16 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 hover:border-[#8B5240] transition-colors relative"
                      title="Clique para trocar a imagem"
                    >
                      {category.imageUrl ? (
                        <>
                          <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon size={16} className="text-white" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-300 hover:text-[#8B5240]">
                          {uploadingId === category.id ? (
                            <span className="text-[10px]">...</span>
                          ) : (
                            <>
                              <ImageIcon size={16} />
                              <span className="text-[9px] font-medium">Imagem</span>
                            </>
                          )}
                        </div>
                      )}
                    </button>
                    {category.imageUrl && (
                      <button
                        onClick={() => updateCategory.mutateAsync({ id: category.id, data: { imageUrl: null } })}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[11px] items-center justify-center hidden group-hover:flex z-10"
                        title="Remover imagem"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                  </div>

                  <div className="flex-1 min-w-[140px]">
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="text-lg font-bold text-gray-900">
                      {typeof category.products === 'number' ? category.products : 0}
                    </p>
                    <p className="text-xs text-gray-500">PRODUTOS</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Edit2 size={18} className="text-gray-400 hover:text-gray-600" />
                  </button>
                  <button
                    onClick={() => setDeletingCategory(category)}
                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 size={18} className="text-gray-400 hover:text-red-600" />
                  </button>
                </div>
              </div>

              <CategorySubcategories categoryId={category.id} />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EditCategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        onClose={() => setEditingCategory(null)}
        onSave={handleSaveCategory}
      />

      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        title="Deletar Categoria"
        message="Você tem certeza que deseja deletar esta categoria?"
        itemName={deletingCategory?.name || ''}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        isLoading={deleteCategory.isPending}
      />
    </div>
  );
}

