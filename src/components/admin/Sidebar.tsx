'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  FileText,
  BarChart3,
  ShoppingBag,
  Image,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Produtos',
    href: '/admin/produtos',
    icon: Package,
  },
  {
    name: 'Categorias',
    href: '/admin/categorias',
    icon: Grid3X3,
  },
  {
    name: 'Orçamentos',
    href: '/admin/orcamentos',
    icon: FileText,
  },
  {
    name: 'Pedidos',
    href: '/admin/pedidos',
    icon: ShoppingBag,
  },
  {
    name: 'Banners',
    href: '/admin/banners',
    icon: Image,
  },
  {
    name: 'Relatórios',
    href: '/admin/relatorios',
    icon: BarChart3,
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    onClose()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={clsx(
          'w-64 bg-leather-900 text-leather-100 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-leather-300 rounded-lg flex items-center justify-center">
            <span className="text-leather-900 font-serif font-bold">V</span>
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm text-white">VTCouro</h1>
            <p className="text-[10px] tracking-widest text-leather-300">COURO GENUÍNO</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-widest text-leather-400 mb-3 px-2 font-semibold">
          Painel
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-leather-200/80 hover:text-white hover:bg-white/5'
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-leather-300" />
                )}
                <Icon size={18} className={isActive ? 'text-leather-300' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="border-t border-white/10 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-leather-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-leather-900 font-bold text-xs">VT</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white">Admin VTCouro</p>
            <p className="text-[11px] text-leather-400 truncate">vendas@vtcouro.com.br</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-leather-300 hover:text-white hover:bg-white/5 transition rounded-lg px-2 py-2 text-xs"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
      </div>
    </>
  );
}

