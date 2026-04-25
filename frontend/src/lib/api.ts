/**
 * EraseMate API Client
 * Handles all communication with the FastAPI backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export type RemoveBackgroundOptions = {
  model?: 'auto' | 'u2net' | 'u2net_human_seg' | 'isnet-general-use'
  enhanceEdges?: boolean
  bgColor?: string | null
  store?: boolean
  onProgress?: (pct: number) => void
}

export type RemoveBackgroundResult = {
  blob: Blob
  url: string
  processingMs: number
  model: string
  originalSize: string
  resultUrl?: string
}

export type UsageInfo = {
  user_id: string
  email: string
  plan: string
  today_count: number
  limit: number
  remaining: number
}

async function getAuthHeader(): Promise<Record<string, string>> {
  try {
    const { supabase } = await import('./supabase')
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` }
    }
  } catch {
    // no session
  }
  return {}
}

export async function removeBackground(
  file: File,
  options: RemoveBackgroundOptions = {}
): Promise<RemoveBackgroundResult> {
  const {
    model = 'auto',
    enhanceEdges = true,
    bgColor = null,
    store = true,
    onProgress,
  } = options

  const authHeader = await getAuthHeader()

  const formData = new FormData()
  formData.append('file', file)

  const params = new URLSearchParams({
    model,
    enhance_edges: String(enhanceEdges),
    store: String(store),
  })
  if (bgColor) params.set('bg_color', bgColor)

  // Use XMLHttpRequest for upload progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.open('POST', `${API_URL}/api/remove-background?${params}`)
    Object.entries(authHeader).forEach(([k, v]) => xhr.setRequestHeader(k, v))

    xhr.responseType = 'blob'

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 40)) // 0-40% = upload
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100)
        const blob = xhr.response as Blob
        const objectUrl = URL.createObjectURL(blob)

        resolve({
          blob,
          url: objectUrl,
          processingMs: parseInt(xhr.getResponseHeader('X-Processing-Time-Ms') || '0'),
          model: xhr.getResponseHeader('X-Model-Used') || model,
          originalSize: xhr.getResponseHeader('X-Original-Size') || '',
          resultUrl: xhr.getResponseHeader('X-Result-URL') || undefined,
        })
      } else if (xhr.status === 429) {
        reject(new Error('FREE_LIMIT_REACHED'))
      } else if (xhr.status === 413) {
        reject(new Error('FILE_TOO_LARGE'))
      } else if (xhr.status === 415) {
        reject(new Error('UNSUPPORTED_FORMAT'))
      } else {
        // Try to read error from blob
        const reader = new FileReader()
        reader.onload = () => {
          try {
            const data = JSON.parse(reader.result as string)
            reject(new Error(data.detail || `Server error ${xhr.status}`))
          } catch {
            reject(new Error(`Server error ${xhr.status}`))
          }
        }
        reader.readAsText(xhr.response)
      }
    })

    xhr.addEventListener('error', () => reject(new Error('NETWORK_ERROR')))
    xhr.addEventListener('timeout', () => reject(new Error('TIMEOUT')))
    xhr.timeout = 120_000 // 2 min timeout

    xhr.send(formData)
  })
}

export async function removeBackgroundBatch(
  files: File[],
  options: Omit<RemoveBackgroundOptions, 'onProgress'> = {}
): Promise<{ results: BatchResult[] }> {
  const { model = 'auto', enhanceEdges = true } = options
  const authHeader = await getAuthHeader()

  const formData = new FormData()
  files.forEach((f) => formData.append('files', f))

  const params = new URLSearchParams({ model, enhance_edges: String(enhanceEdges) })

  const res = await fetch(`${API_URL}/api/remove-background/batch?${params}`, {
    method: 'POST',
    headers: authHeader,
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `Error ${res.status}` }))
    throw new Error(err.detail)
  }
  return res.json()
}

export type BatchResult = {
  filename: string
  job_id?: string
  url?: string
  status: 'success' | 'error'
  error?: string
  metadata?: {
    processing_time_ms: number
    model: string
  }
}

export async function getUsage(): Promise<UsageInfo> {
  const authHeader = await getAuthHeader()
  const res = await fetch(`${API_URL}/api/user/usage`, { headers: authHeader })
  if (!res.ok) throw new Error('Failed to fetch usage')
  return res.json()
}

export async function getModels() {
  const res = await fetch(`${API_URL}/api/models`)
  if (!res.ok) throw new Error('Failed to fetch models')
  return res.json()
}
