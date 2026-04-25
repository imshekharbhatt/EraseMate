import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToastStore } from '../store'

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: Props) {
  const [tab, setTab] = useState(defaultTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth()
  const { addToast } = useToastStore()

  if (!isOpen) return null

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (tab === 'login') {
        await signInWithEmail(email, password)
        addToast('Welcome back!', 'success')
        onClose()
      } else {
        await signUpWithEmail(email, password, name)
        addToast('Account created! Check your email to confirm.', 'success')
        onClose()
      }
    } catch (err: any) {
      addToast(err.message || 'Authentication failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg2 text-muted transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-purple rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M5 7l1.5 1.5L9.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[17px] font-extrabold text-text">EraseMate</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-bg border border-line rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
                tab === 'login' ? 'bg-white text-text shadow-sm' : 'text-muted'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 text-[13px] font-semibold rounded-md transition-all ${
                tab === 'signup' ? 'bg-white text-text shadow-sm' : 'text-muted'
              }`}
            >
              Sign up
            </button>
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-2.5 mb-5">
            <button
              onClick={signInWithGoogle}
              className="flex items-center justify-center gap-3 w-full py-2.5 border border-line rounded-lg text-[13.5px] font-semibold text-text2 hover:bg-bg transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button
              onClick={signInWithGitHub}
              className="flex items-center justify-center gap-3 w-full py-2.5 border border-line rounded-lg text-[13.5px] font-semibold text-text2 hover:bg-bg transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-line" />
            <span className="text-[11px] font-semibold text-muted2 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            {tab === 'signup' && (
              <div>
                <label className="block text-[12px] font-semibold text-text2 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] text-text outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
                />
              </div>
            )}
            <div>
              <label className="block text-[12px] font-semibold text-text2 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] text-text outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-text2 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                className="w-full border border-line rounded-lg px-3.5 py-2.5 text-[13.5px] text-text outline-none focus:border-purple focus:ring-2 focus:ring-purple/10 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple text-white font-semibold text-[13.5px] py-2.5 rounded-lg hover:bg-purple-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {tab === 'login' ? 'Signing in…' : 'Creating account…'}
                </>
              ) : tab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          {tab === 'signup' && (
            <p className="text-[11.5px] text-muted2 text-center mt-4 leading-relaxed">
              By signing up you agree to our{' '}
              <a href="/terms" className="text-purple hover:underline">Terms</a> and{' '}
              <a href="/privacy" className="text-purple hover:underline">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
