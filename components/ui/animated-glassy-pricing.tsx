'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PricingPlan {
  planName: string
  description: string
  price: string
  features: string[]
  buttonText: string
  buttonVariant?: 'primary' | 'secondary'
  isPopular?: boolean
}

export function PricingCard({ plan, yearly }: { plan: PricingPlan; yearly: boolean }) {
  const yearlyPrice = Math.round(parseInt(plan.price) * 12 * 0.83)
  return (
    <div
      className="relative flex flex-col p-8 rounded-3xl transition-all duration-300"
      style={{
        background: plan.isPopular
          ? 'linear-gradient(135deg, rgba(0,119,182,0.2), rgba(0,180,216,0.1))'
          : 'var(--color-card-bg)',
        border: plan.isPopular
          ? '1px solid rgba(0,180,216,0.4)'
          : '1px solid var(--color-border)',
        boxShadow: plan.isPopular
          ? '0 0 60px rgba(0,180,216,0.12), 0 8px 40px rgba(0,0,0,0.3)'
          : 'var(--shadow-card)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="text-xs px-4 py-1.5 rounded-full font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #0077b6, #00b4d8)' }}>
            ✨ En Popüler
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-white)' }}>{plan.planName}</h3>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold"
            style={{ background: 'linear-gradient(135deg, #0077b6, #00b4d8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ${yearly ? yearlyPrice : plan.price}
          </span>
          <span className="text-sm pb-1.5" style={{ color: 'var(--color-muted)' }}>/{yearly ? 'yıl' : 'ay'}</span>
        </div>
        {yearly && (
          <p className="text-xs mt-1" style={{ color: '#22c55e' }}>
            Yıllık ödeyerek ${Math.round(parseInt(plan.price) * 12 * 0.17)} tasarruf edin
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-muted)' }}>
            <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: '#00b4d8' }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/kayit"
        className="block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200"
        style={plan.buttonVariant === 'primary'
          ? {
            background: 'linear-gradient(135deg, #0077b6, #00b4d8)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(0,180,216,0.25)',
          }
          : {
            background: 'rgba(0,119,182,0.08)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-accent-3)',
          }
        }
      >
        {plan.buttonText}
      </Link>
    </div>
  )
}

export function ModernPricingPage({ plans }: { plans: PricingPlan[] }) {
  const [yearly, setYearly] = useState(false)

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className="text-sm" style={{ color: yearly ? 'var(--color-muted)' : 'var(--color-white)' }}>Aylık</span>
        <button
          onClick={() => setYearly(!yearly)}
          className="relative w-12 h-6 rounded-full transition-colors"
          style={{ background: yearly ? 'linear-gradient(135deg, #0077b6, #00b4d8)' : 'rgba(255,255,255,0.12)' }}
        >
          <div
            className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
            style={{ left: yearly ? '26px' : '4px' }}
          />
        </button>
        <span className="text-sm flex items-center gap-2" style={{ color: yearly ? 'var(--color-white)' : 'var(--color-muted)' }}>
          Yıllık
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(0,180,216,0.15)', color: '#00b4d8', border: '1px solid rgba(0,180,216,0.3)' }}>
            %17 indirim
          </span>
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <PricingCard key={i} plan={plan} yearly={yearly} />
        ))}
      </div>
    </div>
  )
}
