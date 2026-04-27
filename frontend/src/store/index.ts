import { create } from 'zustand'
import { supabase, type User } from '../lib/supabase'

// ─── Auth Store ─────────────────────────────────────────────────────────────
type AuthState = {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))

// ─── Toast Store ─────────────────────────────────────────────────────────────
type Toast = {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

type ToastState = {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// ─── Processing Store ─────────────────────────────────────────────────────────
export type ProcessingStep = {
  id: string
  label: string
  status: 'pending' | 'active' | 'done' | 'error'
}

const INITIAL_STEPS: ProcessingStep[] = [
  { id: 'load',    label: 'Loading image data',           status: 'pending' },
  { id: 'detect',  label: 'Detecting subject boundaries', status: 'pending' },
  { id: 'remove',  label: 'Removing background pixels',   status: 'pending' },
  { id: 'refine',  label: 'Refining edges and hair',       status: 'pending' },
  { id: 'output',  label: 'Generating transparent output', status: 'pending' },
]

type ProcessingState = {
  steps: ProcessingStep[]
  progress: number
  elapsedMs: number
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  errorMessage: string | null
  resetSteps: () => void
  setStepStatus: (id: string, status: ProcessingStep['status']) => void
  setProgress: (pct: number) => void
  setStatus: (status: ProcessingState['status']) => void
  setError: (msg: string | null) => void
  setElapsed: (ms: number) => void
  runStepAnimation: (onComplete: () => void) => () => void
  markAllDone: () => void
}

export const useProcessingStore = create<ProcessingState>((set, get) => ({
  steps: INITIAL_STEPS.map((s) => ({ ...s })),
  progress: 0,
  elapsedMs: 0,
  status: 'idle',
  errorMessage: null,

  resetSteps: () =>
    set({ steps: INITIAL_STEPS.map((s) => ({ ...s })), progress: 0, elapsedMs: 0, errorMessage: null }),

  setStepStatus: (id, status) =>
    set((s) => ({
      steps: s.steps.map((step) => (step.id === id ? { ...step, status } : step)),
    })),

  setProgress: (pct) => set({ progress: pct }),
  setStatus: (status) => set({ status }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  setElapsed: (ms) => set({ elapsedMs: ms }),

  markAllDone: () =>
    set((s) => ({ steps: s.steps.map((step) => ({ ...step, status: 'done' as const })) })),

  // Runs a slow background animation (does NOT auto-complete the last step).
  // Returns a cleanup fn. Call markAllDone() + onComplete() from the API handler.
  runStepAnimation: (onComplete) => {
    const { steps, setStepStatus } = get()
    setStepStatus(steps[0].id, 'active')
    let i = 0
    let stopped = false
    // Pace each intermediate step ~4s apart so animation stays believable
    // even when the API takes 30+ seconds (HF cold start).
    const STEP_MS = 4000

    const tick = () => {
      if (stopped) return
      setStepStatus(steps[i].id, 'done')
      i++
      // Only advance up to the second-to-last step; the final "output" step
      // should only complete when the API actually responds.
      if (i < steps.length - 1) {
        setStepStatus(steps[i].id, 'active')
        setTimeout(tick, STEP_MS)
      } else if (i === steps.length - 1) {
        setStepStatus(steps[i].id, 'active')
        // Don't call onComplete — the hook calls it after API finishes
      }
    }

    setTimeout(tick, STEP_MS)
    // onComplete stored for external use (not used by timer)
    void onComplete
    return () => { stopped = true }
  },
}))

// ─── Image Store ─────────────────────────────────────────────────────────────
type ImageState = {
  originalFile: File | null
  originalUrl: string | null
  resultBlob: Blob | null
  resultUrl: string | null
  processingMs: number
  modelUsed: string
  r2Url: string | null
  currentBg: string
  setOriginal: (file: File, url: string) => void
  setResult: (blob: Blob, url: string, meta: { processingMs: number; model: string; r2Url?: string }) => void
  setCurrentBg: (bg: string) => void
  reset: () => void
}

export const useImageStore = create<ImageState>((set) => ({
  originalFile: null,
  originalUrl: null,
  resultBlob: null,
  resultUrl: null,
  processingMs: 0,
  modelUsed: '',
  r2Url: null,
  currentBg: 'transparent',

  setOriginal: (file, url) => set({ originalFile: file, originalUrl: url }),

  setResult: (blob, url, meta) =>
    set({
      resultBlob: blob,
      resultUrl: url,
      processingMs: meta.processingMs,
      modelUsed: meta.model,
      r2Url: meta.r2Url || null,
    }),

  setCurrentBg: (bg) => set({ currentBg: bg }),

  reset: () =>
    set({
      originalFile: null,
      originalUrl: null,
      resultBlob: null,
      resultUrl: null,
      processingMs: 0,
      modelUsed: '',
      r2Url: null,
      currentBg: 'transparent',
    }),
}))