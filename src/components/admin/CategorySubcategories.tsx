'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GripVertical, ChevronDown } from 'lucide-react';
import EditSubcategoryModal from './EditSubcategoryModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  useSubcategories,
  useCreateSubcategory,
  useUpdateSubcategory,
  useDeleteSubcategory,
  useReorderSubcategories,
} from '@/hooks/useSubcategories';

const EMPTY_SUBCATEGORIES: any[] = [];

export default function CategorySubcategories({ categoryId }: { categoryId: string }) {
  const [expanded, setExpanded] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null);
  const [deletingSubcategory, setDeletingSubcategory] = useState<any>(null);
  const [localSubcategories, setLocalSubcategories] = useState<any[]>([]);

  const { data: subcategories = EMPTY_SUBCATEGORIES, isLoading } = useSubcategories(categoryId);
  const createSubcategory = useCreateSubcategory();
  const updateSubcategory = useUpdateSubcategory();
  const deleteSubcategory = useDeleteSubcategory();
  const reorderSubcategories = useReorderSubcategories();

  useEffect(() => {
    setLocalSubcategories(subcategories);
  }, [subcategories]);

  const handleDragStart = (idx: number) => setDraggedItem(idx);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (idx: number) => {
    if (draggedItem === null || draggedItem === idx) return;

    const newSubcategories = [...localSubcategories];
    const dragged = newSubcategories[draggedItem];
    newSubcategories.splice(draggedItem, 1);
    newSubcategories.splice(idx, 0, dragged);

    setLocalSubcategories(newSubcategories);
    setDraggedItem(null);

    await reorderSubcategories.mutateAsync(newSubcategories);
  };

  const handleSaveSubcategory = async (data: any) => {
    if (editingSubcategory?.id) {
      await updateSubcategory.mutateAsync({ id: editingSubcategory.id, data });
    } else {
      await createSubcategory.mutateAsync({ ...data, categoryId });
    }
  };

  const handleDeleteSubcategory = async () => {
    if (deletingSubcategory) {
      await deleteSubcategory.mutateAsync(deletingSubcategory.id);
      setDeletingSubcategory(null);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-gray-900"
      >
        <span className="font-medium">
          Subcategorias {!isLoading && `(${localSubcategories.length})`}
        </span>
        <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          {localSubcategories.map((sub, idx) => (
            <div
              key={sub.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 cursor-grab active:cursor-grabbing ${
                draggedItem === idx ? 'opacity-50' : ''
              }`}
            >
              <GripVertical size={16} className="text-gray-300" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{sub.name}</p>
                <p className="text-xs text-gray-500">{sub.slug}</p>
              </div>
              <span className="text-xs text-gray-400">
                {typeof sub.products === 'number' ? sub.products : 0} produtos
              </span>
              <button
                onClick={() => setEditingSubcategory(sub)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Edit2 size={14} className="text-gray-400 hover:text-gray-600" />
              </button>
              <button
                onClick={() => setDeletingSubcategory(sub)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <Trash2 size={14} className="text-gray-400 hover:text-red-600" />
              </button>
            </div>
          ))}

          <button
            onClick={() => setEditingSubcategory({})}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-colors"
          >
            <Plus size={16} />
            Nova subcategoria
          </button>
        </div>
      )}

      <EditSubcategoryModal
        isOpen={!!editingSubcategory}
        subcategory={editingSubcategory}
        onClose={() => setEditingSubcategory(null)}
        onSave={handleSaveSubcategory}
      />

      <DeleteConfirmModal
        isOpen={!!deletingSubcategory}
        title="Deletar Subcategoria"
        message="Você tem certeza que deseja deletar esta subcategoria?"
        itemName={deletingSubcategory?.name || ''}
        onClose={() => setDeletingSubcategory(null)}
        onConfirm={handleDeleteSubcategory}
        isLoading={deleteSubcategory.isPending}
      />
    </div>
  );
}
