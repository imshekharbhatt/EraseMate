import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const [showAuth, setShowAuth] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const openLogin = () => { setAuthTab('login'); setShowAuth(true); setMobileMenuOpen(false) }
  const openSignup = () => { setAuthTab('signup'); setShowAuth(true); setMobileMenuOpen(false) }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  const NAV_LINKS = [
    { label: 'Features', href: '/#features' },
    { label: 'API', href: '/#api' },
    { label: 'Pricing', href: '/pricing' },
  ]

  return (
    <>
      <nav className="sticky top-0 z-[200] bg-white/92 backdrop-blur-[16px] border-b border-line h-16 flex items-center">
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-[19px] font-extrabold text-text no-underline tracking-tight shrink-0">
            <div className="w-7 h-7 bg-purple rounded-[7px] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 14 14" fill="none" className="w-[14px] h-[14px]">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
                <path d="M5 7l1.5 1.5L9.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Erase<span className="text-purple">Mate</span></span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              href.startsWith('/#')
                ? <a key={label} href={href} className="text-[13.5px] font-medium text-text2 no-underline px-3.5 py-1.5 rounded-lg hover:bg-bg2 hover:text-text transition-colors">{label}</a>
                : <Link key={label} to={href} className="text-[13.5px] font-medium text-text2 no-underline px-3.5 py-1.5 rounded-lg hover:bg-bg2 hover:text-text transition-colors">{label}</Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-bg2 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-purple flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                    {user?.user_metadata?.avatar_url
                      ? <img src={user.user_metadata.avatar_url} alt="" className="w-full h-full object-cover" />
                      : initials}
                  </div>
                  <span className="text-[13px] font-medium text-text2 hidden sm:block max-w-[100px] truncate">
                    {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                  </span>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-muted hidden sm:block">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-line rounded-xl shadow-lg z-20 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-line">
                        <p className="text-[13px] font-semibold text-text truncate">{user?.email}</p>
                        <p className="text-[11px] text-muted capitalize mt-0.5">
                          {user?.user_metadata?.plan || 'Free'} plan
                        </p>
                      </div>
                      <button onClick={() => { navigate('/dashboard'); setUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-text2 hover:bg-bg transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4 text-muted"><rect x="3" y="3" width="6" height="6" rx="1.5" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" strokeWidth="1.5"/></svg>
                        Dashboard
                      </button>
                      <button onClick={() => { navigate('/settings'); setUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-text2 hover:bg-bg transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4 text-muted"><circle cx="10" cy="10" r="2" strokeWidth="1.5"/><path d="M10 3v1m0 12v1M3 10h1m12 0h1m-2.343-5.657-.707.707M5.05 14.95l-.707.707m0-11.314.707.707M14.95 14.95l.707.707" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        Settings
                      </button>
                      <button onClick={() => { navigate('/pricing'); setUserMenuOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-[13px] text-text2 hover:bg-bg transition-colors flex items-center gap-2">
                        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4 text-muted"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Pricing
                      </button>
                      <div className="border-t border-line mt-1 pt-1">
                        <button onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2">
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="w-4 h-4"><path d="M13 7l3 3m0 0l-3 3m3-3H7m6-6H5a2 2 0 00-2 2v8a2 2 0 002 2h8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button onClick={openLogin}
                  className="hidden sm:block text-[13.5px] font-medium text-text2 bg-transparent border-none px-4 py-[7px] rounded-lg cursor-pointer hover:bg-bg2 hover:text-text transition-colors">
                  Log in
                </button>
                <button onClick={openSignup}
                  className="text-[13.5px] font-semibold text-white bg-purple border-none px-4 sm:px-5 py-2 rounded-lg cursor-pointer hover:bg-purple-hover transition-colors tracking-tight">
                  Get Started
                </button>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-bg2 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" className="w-5 h-5 stroke-text2">
                {mobileMenuOpen
                  ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                  : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-line shadow-lg z-[190] md:hidden">
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                href.startsWith('/#')
                  ? <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}
                      className="text-[14px] font-medium text-text2 no-underline px-3 py-2.5 rounded-lg hover:bg-bg2 hover:text-text transition-colors">
                      {label}
                    </a>
                  : <Link key={label} to={href} onClick={() => setMobileMenuOpen(false)}
                      className="text-[14px] font-medium text-text2 no-underline px-3 py-2.5 rounded-lg hover:bg-bg2 hover:text-text transition-colors">
                      {label}
                    </Link>
              ))}
              {!isAuthenticated && (
                <button onClick={openLogin}
                  className="text-left text-[14px] font-medium text-text2 px-3 py-2.5 rounded-lg hover:bg-bg2 transition-colors">
                  Log in
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab={authTab} />
    </>
  )
}
