'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Eye, Trash2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/admin/SearchBar';
import DataTable from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import EditProductModal from '@/components/admin/EditProductModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import { useProducts, useUpdateProduct, useDeleteProduct, useCreateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function AdminProdutos() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deletingProduct, setDeletingProduct] = useState<any>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: apiCategories = [] } = useCategories();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createProduct = useCreateProduct();

  const categories = ['Todas', ...apiCategories.map((c: any) => c.name)];

  const handleDuplicateProduct = async (product: any) => {
    try {
      const copyName = `Cópia de ${product.name}`;
      const copySlug = `${product.slug}-copia-${Date.now()}`;
      await createProduct.mutateAsync({
        name: copyName,
        slug: copySlug,
        sku: product.sku ? `${product.sku}-COPIA` : undefined,
        categoryId: product.categoryId,
        description: product.description,
        minQuantity: product.minQuantity,
        availableColors: product.availableColors,
        specifications: product.specifications,
        customization: product.customization,
        care: product.care,
        imageUrl: product.imageUrl,
        images: product.images,
        isActive: product.isActive,
        isFeatured: false,
        isNew: false,
      });
    } catch (error) {
      console.error('Error duplicating product:', error);
    }
  };

  const handleSaveProduct = async (data: any) => {
    try {
      if (editingProduct?.id) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          data,
        });
      } else {
        await createProduct.mutateAsync(data);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (deletingProduct) {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const matchesCategory =
        selectedCategory === 'Todas' || product.category?.name === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const columns = [
    {
      key: 'name',
      label: 'PRODUTO',
      render: (value: string, row: any) => (
        <div className="flex items-center gap-3">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={value} className="w-8 h-8 rounded object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 bg-amber-100 rounded flex-shrink-0"></div>
          )}
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-xs text-gray-500">{row.description?.substring(0, 50)}...</p>
          </div>
        </div>
      ),
    },
    { key: 'sku', label: 'SKU', render: (value: string) => value || '-' },
    {
      key: 'minQuantity',
      label: 'MOQ',
      render: (value: number) => `${value || 50} un.`
    },
    {
      key: 'category',
      label: 'CATEGORIA',
      render: (value: any) => value?.name || '-'
    },
    {
      key: 'isActive',
      label: 'STATUS',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      )
    },
    {
      key: 'id',
      label: 'AÇÕES',
      render: (value: any, row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingProduct(row)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Edit2 size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Eye size={18} className="text-gray-400 hover:text-gray-600" />
          </button>
          <button
            onClick={() => handleDuplicateProduct(row)}
            title="Duplicar produto"
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Copy size={18} className="text-gray-400 hover:text-blue-600" />
          </button>
          <button
            onClick={() => setDeletingProduct(row)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Trash2 size={18} className="text-gray-400 hover:text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-leather-900">Produtos</h1>
          <p className="text-sm text-leather-500 mt-1">{products.length} produtos no catálogo</p>
        </div>
        <button
          onClick={() => setEditingProduct({})}
          className="bg-leather-900 hover:bg-leather-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Novo produto
        </button>
      </div>

      {/* Filters */}
      <div className="flex-1">
        <SearchBar
          placeholder="Buscar por nome ou SKU..."
          onSearch={setSearchTerm}
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 items-center overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-leather-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-600">
          {filteredProducts.length} de {products.length}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm text-leather-500 mt-1">Carregando produtos...</p>
        </div>
      ) : (
        <DataTable columns={columns} data={filteredProducts} />
      )}

      {/* Modals */}
      <EditProductModal
        isOpen={!!editingProduct}
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />

      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        title="Deletar Produto"
        message="Você tem certeza que deseja deletar este produto?"
        itemName={deletingProduct?.name || ''}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}

