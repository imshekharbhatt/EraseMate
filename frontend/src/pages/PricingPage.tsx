import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import AuthModal from '../components/AuthModal'

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying out EraseMate.',
    color: 'border-line',
    badge: null,
    features: [
      '5 images per day',
      'PNG & JPEG export',
      'Standard processing speed',
      'Supabase cloud storage',
      'API access',
    ],
    cta: 'Get started free',
    ctaStyle: 'border border-line text-text hover:bg-bg2',
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For designers, creators, and freelancers.',
    color: 'border-purple',
    badge: 'Most popular',
    features: [
      'Unlimited images per day',
      'All export formats',
      'Priority processing',
      'Batch processing (10 images)',
      'Full API access',
      'Result history',
      'Email support',
    ],
    cta: 'Start Pro',
    ctaStyle: 'bg-purple text-white hover:bg-purple-hover hover:shadow-[0_6px_20px_rgba(91,63,248,0.3)]',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'For teams and high-volume pipelines.',
    color: 'border-line',
    badge: null,
    features: [
      'Unlimited everything',
      'Dedicated API endpoint',
      'Custom model training',
      'SLA guarantee',
      'Priority support',
      'Invoicing & SSO',
    ],
    cta: 'Contact sales',
    ctaStyle: 'border border-line text-text hover:bg-bg2',
  },
]

function Check() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0">
      <circle cx="8" cy="8" r="7" fill="#ede9fe"/>
      <path d="M5 8l2 2 4-4" stroke="#5b3ff8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PricingPage() {
  const { isAuthenticated } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-20">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[11.5px] font-bold tracking-[0.1em] text-purple uppercase">Pricing</span>
          <h1 className="text-[clamp(28px,5vw,48px)] font-extrabold tracking-[-1.5px] text-text mt-3 mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-[16px] text-muted max-w-[480px] mx-auto leading-relaxed">
            Start free. Upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl border-2 p-6 sm:p-7 flex flex-col relative ${plan.color} ${plan.name === 'Pro' ? 'shadow-[0_8px_32px_rgba(91,63,248,0.15)]' : ''}`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-[15px] font-bold text-text2 mb-1">{plan.name}</h2>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-[36px] font-extrabold text-text tracking-tight">{plan.price}</span>
                  <span className="text-[13px] text-muted">/{plan.period}</span>
                </div>
                <p className="text-[13px] text-muted">{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13.5px] text-text2">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isAuthenticated && setShowAuth(true)}
                className={`w-full py-3 rounded-xl text-[14px] font-bold transition-all ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-[22px] font-extrabold text-text text-center mb-8">Common questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-[800px] mx-auto">
            {[
              { q: 'Does the free plan require a credit card?', a: 'No. Sign up with email or Google and start processing immediately.' },
              { q: 'What counts as one image?', a: 'Each background removal request counts as one image, regardless of file size.' },
              { q: 'When do daily limits reset?', a: 'Free tier limits reset at midnight UTC every day.' },
              { q: 'Can I use the API on the free plan?', a: 'Yes, API access is available on all plans including free.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-line rounded-xl p-5">
                <p className="text-[14px] font-bold text-text mb-2">{q}</p>
                <p className="text-[13px] text-muted leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} defaultTab="signup" />
    </div>
  )
}
