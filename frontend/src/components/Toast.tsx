import { useToastStore } from '../store'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="
            flex items-center gap-2.5 bg-text text-white px-5 py-3 rounded-lg
            text-[13.5px] font-medium shadow-[0_8px_24px_rgba(15,14,23,0.25)]
            whitespace-nowrap pointer-events-auto
            animate-slideUp
          "
        >
          {toast.type === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />}
          {toast.type === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />}
          {toast.type === 'info' && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />}
          {toast.message}
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-1 text-white/50 hover:text-white transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
