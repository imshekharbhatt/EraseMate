import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import SettingsPage from './pages/SettingsPage'
import PricingPage from './pages/PricingPage'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 bg-purple-light rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 stroke-purple" strokeWidth={1.75} strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>
        </svg>
      </div>
      <h1 className="text-[28px] font-extrabold text-text mb-2 tracking-tight">Page not found</h1>
      <p className="text-muted text-[15px] mb-6">The page you're looking for doesn't exist.</p>
      <a href="/" className="bg-purple text-white px-6 py-2.5 rounded-lg text-[14px] font-semibold no-underline hover:bg-purple-hover transition-colors">
        Go home
      </a>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  useAuth()
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </BrowserRouter>
  )
}
