import { useCallback } from 'react'
import { removeBackground } from '../lib/api'
import { useImageStore, useProcessingStore, useToastStore } from '../store'
import { useAuthStore } from '../store'

export function useBackgroundRemoval() {
  const { setOriginal, setResult } = useImageStore()
  const { resetSteps, setStatus, setError, runStepAnimation, setProgress } = useProcessingStore()
  const { addToast } = useToastStore()
  const { user } = useAuthStore()

  const processFile = useCallback(
    async (file: File, options: { model?: string; enhanceEdges?: boolean } = {}) => {
      // Validate
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

      // Set original preview
      const originalUrl = URL.createObjectURL(file)
      setOriginal(file, originalUrl)

      // Reset state
      resetSteps()
      setStatus('processing')
      setProgress(0)

      // Start step animation + API call concurrently
      let apiDone = false
      let animDone = false
      let resultData: { blob: Blob; url: string; processingMs: number; model: string; r2Url?: string } | null = null

      const tryFinish = () => {
        if (apiDone && animDone && resultData) {
          setResult(resultData.blob, resultData.url, {
            processingMs: resultData.processingMs,
            model: resultData.model,
            r2Url: resultData.r2Url,
          })
          setStatus('done')
          addToast('Background removed successfully ✓', 'success')
        }
      }

      // Animate steps (visual progress, ~3s)
      runStepAnimation(() => {
        animDone = true
        tryFinish()
      })

      // Call API
      try {
        const result = await removeBackground(file, {
          model: (options.model as any) || 'auto',
          enhanceEdges: options.enhanceEdges ?? true,
          store: !!user,
          onProgress: (pct) => setProgress(pct),
        })

        resultData = {
          blob: result.blob,
          url: result.url,
          processingMs: result.processingMs,
          model: result.model,
          r2Url: result.resultUrl,
        }
        apiDone = true
        tryFinish()
      } catch (err: any) {
        const msg = (() => {
          switch (err.message) {
            case 'FREE_LIMIT_REACHED':
              return 'Free tier limit reached. Sign up for unlimited processing.'
            case 'FILE_TOO_LARGE':
              return 'File too large. Maximum 25 MB.'
            case 'UNSUPPORTED_FORMAT':
              return 'Unsupported image format.'
            case 'NETWORK_ERROR':
              return 'Network error. Check your connection.'
            case 'TIMEOUT':
              return 'Processing timed out. Try a smaller image.'
            default:
              return err.message || 'Processing failed. Please try again.'
          }
        })()
        setError(msg)
        addToast(msg, 'error')
      }
    },
    [user, setOriginal, setResult, resetSteps, setStatus, setError, runStepAnimation, setProgress, addToast]
  )

  return { processFile }
}
