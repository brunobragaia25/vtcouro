import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#8B5240] text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-bold text-[#ecc29c] mb-4">VTCouro</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Especialistas em produtos de couro personalizados para empresas e marcas. Showroom em São Paulo desde 1998.
            </p>
            <div className="flex gap-3">
              <button className="bg-[#ecc29c] p-2 rounded-full hover:bg-[#d4a574] transition-colors">
                <ShoppingBag size={16} className="text-[#250b00]" />
              </button>
              <button className="border border-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <Heart size={16} />
              </button>
              <button className="border border-white p-2 rounded-full hover:bg-white/10 transition-colors">
                <Search size={16} />
              </button>
            </div>
          </div>

          {/* Bolsas e Pastas */}
          <div>
            <h4 className="text-[#d2741f] font-semibold tracking-widest text-xs mb-4 uppercase">
              Bolsas e Pastas
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/catalogo/carteiras" className="hover:text-[#ecc29c] transition-colors">Carteiras</Link></li>
              <li><Link href="/catalogo/bolsas" className="hover:text-[#ecc29c] transition-colors">Bolsas</Link></li>
              <li><Link href="/catalogo/pastas" className="hover:text-[#ecc29c] transition-colors">Pastas</Link></li>
              <li><Link href="/catalogo/sacolas" className="hover:text-[#ecc29c] transition-colors">Sacolas</Link></li>
              <li><Link href="/catalogo/mochilas" className="hover:text-[#ecc29c] transition-colors">Mochilas</Link></li>
            </ul>
          </div>

          {/* Mochilas */}
          <div>
            <h4 className="text-[#d2741f] font-semibold tracking-widest text-xs mb-4 uppercase">
              Mochilas
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/catalogo" className="hover:text-[#ecc29c] transition-colors">Carteiras</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#ecc29c] transition-colors">Bolsas</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#ecc29c] transition-colors">Pastas</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#ecc29c] transition-colors">Sacolas</Link></li>
              <li><Link href="/catalogo" className="hover:text-[#ecc29c] transition-colors">Mochilas</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="text-[#d2741f] font-semibold tracking-widest text-xs mb-4 uppercase">
              Empresa
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/#sobre" className="hover:text-[#ecc29c] transition-colors">Sobre nós</Link></li>
              <li><Link href="/admin/orcamentos" className="hover:text-[#ecc29c] transition-colors">Orçamento</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-[#d2741f] font-semibold tracking-widest text-xs mb-4 uppercase">
              Contato
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Al. Segundo Sargento Névio Baracho Dos Santos, 114<br/>Pq Novo Mundo - São Paulo / SP</li>
              <li>(11) 2636-1112</li>
              <li><Link href="mailto:vendas@vtcouro.com.br" className="hover:text-[#ecc29c] transition-colors">vendas@vtcouro.com.br</Link></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>© 2026 VTCouro. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <span>|</span>
            <Link href="#" className="hover:text-white transition-colors">
              Termos de Serviço
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


