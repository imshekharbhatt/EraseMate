import { useCallback, useRef } from 'react'
import { removeBackground } from '../lib/api'
import { useImageStore, useProcessingStore, useToastStore } from '../store'
import { useAuthStore } from '../store'

export function useBackgroundRemoval() {
  const { setOriginal, setResult } = useImageStore()
  const { resetSteps, setStatus, setError, runStepAnimation, setProgress, setElapsed, markAllDone } = useProcessingStore()
  const { addToast } = useToastStore()
  const { user } = useAuthStore()
  const cleanupRef = useRef<(() => void) | null>(null)
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const processFile = useCallback(
    async (file: File, options: { model?: string; enhanceEdges?: boolean } = {}) => {
      // ── Validate ──────────────────────────────────────────────────────────
      const VALID_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff', 'image/gif']
      if (!VALID_TYPES.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|bmp|tiff?|gif)$/i)) {
        addToast('Unsupported file format. Please use JPG, PNG, WebP, BMP, or TIFF.', 'error')
        return
      }
      const MAX_MB = 25
      if (file.size > MAX_MB * 1024 * 1024) {
        addToast(`File too large. Maximum size is ${MAX_MB} MB.`, 'error')
        return
      }

      // ── Reset UI state ────────────────────────────────────────────────────
      if (cleanupRef.current) cleanupRef.current()
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)

      const originalUrl = URL.createObjectURL(file)
      setOriginal(file, originalUrl)
      resetSteps()
      setStatus('processing')
      setProgress(0)
      startTimeRef.current = Date.now()

      // Tick elapsed timer every second so ProcessingBox can show "Xm Ys"
      elapsedTimerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTimeRef.current)
      }, 1000)

      // ── Start background step animation ───────────────────────────────────
      // Cleanup fn so we can stop if an error fires early
      cleanupRef.current = runStepAnimation(() => {
        // This cb is intentionally empty — completion is driven by the API
      })

      // ── Call API ──────────────────────────────────────────────────────────
      try {
        const result = await removeBackground(file, {
          model: (options.model as any) || 'auto',
          enhanceEdges: options.enhanceEdges ?? true,
          store: !!user,
          onProgress: (pct) => setProgress(pct),
        })

        // API done — finish animation immediately then show result
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
        markAllDone()
        setProgress(100)

        // Small pause so the "done" state is visible before transitioning
        await new Promise((r) => setTimeout(r, 400))

        setResult(result.blob, result.url, {
          processingMs: result.processingMs,
          model: result.model,
          r2Url: result.resultUrl,
        })
        setStatus('done')
        addToast('Background removed successfully ✓', 'success')
      } catch (err: any) {
        if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current)
        if (cleanupRef.current) cleanupRef.current()

        const msg = (() => {
          switch (err.message) {
            case 'FREE_LIMIT_REACHED':
              return 'Free tier limit reached. Sign up for unlimited processing.'
            case 'FILE_TOO_LARGE':
              return 'File too large. Maximum 25 MB.'
            case 'UNSUPPORTED_FORMAT':
              return 'Unsupported image format.'
            case 'NETWORK_ERROR':
              return 'Network error. Check your connection and try again.'
            case 'TIMEOUT':
              return 'Processing timed out. Try a smaller image or try again shortly.'
            default:
              return err.message || 'Processing failed. Please try again.'
          }
        })()
        setError(msg)
        addToast(msg, 'error')
      }
    },
    [user, setOriginal, setResult, resetSteps, setStatus, setError, runStepAnimation, setProgress, setElapsed, markAllDone, addToast]
  )

  return { processFile }
}