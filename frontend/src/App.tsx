import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import HomePage from './pages/HomePage'

// Lazy placeholder pages
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-14 h-14 bg-purple-light rounded-2xl flex items-center justify-center mx-auto mb-5">
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 stroke-purple" strokeWidth={1.75} strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01"/>
        </svg>
      </div>
      <h1 className="text-[28px] font-extrabold text-text mb-2 tracking-tight">{title}</h1>
      <p className="text-muted text-[15px]">This page is coming soon.</p>
    </div>
  )
}

export default function App() {
  // Bootstrap auth listener
  useAuth()

  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ComingSoon title="Dashboard" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" />} />
          <Route path="/pricing" element={<ComingSoon title="Pricing" />} />
          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </BrowserRouter>
  )
}
