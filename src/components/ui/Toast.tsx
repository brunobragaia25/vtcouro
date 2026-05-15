'use client'

import { useState, useEffect } from 'react'
import { X, Check, AlertCircle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastProps extends Toast {
  onClose: (id: string) => void
}

export function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type]

  const Icon = {
    success: Check,
    error: AlertCircle,
    info: Info,
  }[type]

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg transition-all duration-300 ${bgColor} ${
        isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => {
          setIsExiting(true)
          setTimeout(() => onClose(id), 300)
        }}
        className="hover:opacity-80 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-5 right-5 space-y-3 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
