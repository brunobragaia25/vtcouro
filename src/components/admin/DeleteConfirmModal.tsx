'use client';

import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              {message}
            </p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {itemName}
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-700">
            ⚠️ Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 admin-btn-secondary disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Deletando...' : 'Deletar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
