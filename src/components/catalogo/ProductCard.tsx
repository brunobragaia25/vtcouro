'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageUrl?: string;
    category?: { name: string; slug: string };
  };
  featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative h-80 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-gray-400 uppercase text-sm tracking-wider">
              {product.category?.name}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute inset-x-5 top-5 flex items-start justify-between pointer-events-none">
          {featured && (
            <div className="bg-[#d2741f] text-white text-xs font-extrabold px-3 py-1.5 rounded-full tracking-widest uppercase">
              Destaque
            </div>
          )}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors pointer-events-auto ${
              isLiked
                ? 'bg-[#ff82aa] text-white'
                : 'bg-white text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Category & Title */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-[#d2741f] tracking-widest uppercase">
            {product.category?.name}
          </p>
          <h3 className="text-xl font-semibold text-gray-900">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <p className="text-sm text-gray-500">Mín 50un.</p>
          <Link
            href={`/catalogo/${product.category?.slug || 'produtos'}/${product.slug}`}
            className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-[#d2741f] transition-colors"
          >
            Ver detalhes
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
