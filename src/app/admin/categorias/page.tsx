'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import EditCategoryModal from '@/components/admin/EditCategoryModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { useCategories, useUpdateCategory, useDeleteCategory, useCreateCategory, useReorderCategories } from '@/hooks/useCategories';

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

  const { data: categories = [], isLoading } = useCategories();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            {localCategories.length} categorias - arraste para reordenar a exibição no site
          </p>
        </div>
        <button
          onClick={() => setEditingCategory({})}
          className="bg-[#3d2817] hover:bg-[#2d1810] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
              <div className="flex items-center gap-4">
                <button className="text-gray-300 hover:text-gray-600">
                  <GripVertical size={20} />
                </button>

                <div className="flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
                    {categoryIcons[category.name] || '📦'}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                    <p className="text-xs text-gray-500">{category.slug}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {typeof category.products === 'number' ? category.products : 0}
                    </p>
                    <p className="text-xs text-gray-500">PRODUTOS</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
