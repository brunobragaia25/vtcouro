import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-[#4b1c09]">VTCouro</div>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-900">
          <Link href="/" className="hover:text-[#d2741f] transition-colors">
            Início
          </Link>
          <Link href="/catalogo/carteiras" className="hover:text-[#d2741f] transition-colors">
            Bolsas e Pastas
          </Link>
          <Link href="/catalogo/mochilas" className="hover:text-[#d2741f] transition-colors">
            Mochilas
          </Link>
          <Link href="/catalogo" className="hover:text-[#d2741f] transition-colors">
            Uso pessoal
          </Link>
          <Link href="/catalogo" className="hover:text-[#d2741f] transition-colors">
            Acessórios
          </Link>
          <Link href="/#sobre" className="hover:text-[#d2741f] transition-colors">
            Sobre nós
          </Link>
          <Link href="/#contato" className="hover:text-[#d2741f] transition-colors">
            Contato
          </Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag size={20} className="text-[#ecc29c]" fill="currentColor" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Heart size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search size={20} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}

