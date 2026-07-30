'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

// Contador global de travas: só destrava o body quando o último modal fecha,
// evitando que um `overflow: hidden` fique preso na página.
let scrollLocks = 0;

function lockBodyScroll() {
  scrollLocks += 1;
  if (scrollLocks === 1) document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1);
  if (scrollLocks === 0) document.body.style.removeProperty('overflow');
}

interface ModalProps {
  isOpen: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Ações fixas no rodapé, fora da área de rolagem. */
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  title,
  children,
  onClose,
  size = 'md',
  footer,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ref para o onClose: as páginas passam arrow functions inline, então usá-lo
  // como dependência re-executaria o efeito a cada render do pai.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => setMounted(true), []);

  // Trava o scroll do fundo e fecha no Esc enquanto o modal está aberto.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    lockBodyScroll();
    document.addEventListener('keydown', onKeyDown);
    return () => {
      unlockBodyScroll();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  // Portal no body: evita que um ancestral com `transform` vire o containing
  // block do `position: fixed` e desloque o modal para fora do centro.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-leather-900/50 backdrop-blur-sm" />

      {/* Painel */}
      <div
        className={clsx(
          'relative bg-white rounded-2xl shadow-2xl ring-1 ring-leather-900/5 w-full max-h-[88vh] my-auto overflow-hidden flex flex-col',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6 border-b border-leather-200/70 bg-leather-50/60 flex-shrink-0">
            <h2 className="font-serif text-lg font-bold text-leather-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="p-1.5 -mr-1.5 rounded-lg text-leather-500 hover:bg-leather-200/60 hover:text-leather-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5 sm:px-6 overflow-y-auto flex-1 min-h-0">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="px-5 py-4 sm:px-6 border-t border-leather-200/70 bg-leather-50/60 flex-shrink-0">
              {footer}
            </div>
          )}
      </div>
    </div>,
    document.body
  );
}
