'use client';

import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onImagesChange,
  maxImages = 4,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEl = e.currentTarget;
    const files = inputEl.files;
    if (!files) return;

    const remainingSlots = maxImages - images.length;
    if (files.length > remainingSlots) {
      setError(`Você pode adicionar apenas ${remainingSlots} imagem(ns) mais`);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload');
      }

      const data = await response.json();
      onImagesChange([...images, ...data.urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload');
    } finally {
      setIsUploading(false);
      inputEl.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Imagens do Produto (máx. {maxImages})
        </label>
        <div className="flex gap-2 flex-wrap mb-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden group"
            >
              <Image
                src={url}
                alt={`Produto ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          ))}
        </div>

        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-leather-400 hover:bg-leather-50 transition-colors">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              Clique para selecionar imagens
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, GIF ou WebP. Máx 5MB por arquivo.
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          Enviando imagens...
        </div>
      )}
    </div>
  );
}
