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
          'w-64 bg-[#8B5240] text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
      {/* Logo */}
      <div className="p-6 border-b border-[#a06050]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-[#3d2817] font-bold text-sm">V</span>
          </div>
          <div>
            <h1 className="font-bold text-sm">VTCouro</h1>
            <p className="text-xs text-gray-300">COURO GENUÍNO</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-6">
        <p className="text-xs uppercase text-gray-400 mb-4 font-semibold">
          PAINEL
        </p>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[#a06050] text-white'
                    : 'text-gray-300 hover:text-white hover:bg-[#9a5545]'
                )}
              >
                <Icon size={20} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info */}
      <div className="border-t border-[#a06050] p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c4a677] rounded-full flex items-center justify-center">
            <span className="text-[#3d2817] font-bold text-sm">VT</span>
          </div>
          <div>
            <p className="text-xs font-medium">Admin VTCouro</p>
            <p className="text-xs text-gray-400">vendas@vtcouro.com.br</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition text-xs px-1"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
      </div>
    </>
  );
}

