'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

export const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'relative inline-flex items-center justify-center font-semibold rounded-xl overflow-hidden transition-all duration-200 select-none cursor-pointer'
    const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }
    const variants = {
      primary: 'text-white',
      secondary: 'text-white',
    }
    return (
      <button
        ref={ref}
        className={cn(base, sizes[size], variants[variant], className)}
        style={{
          background: variant === 'primary'
            ? 'linear-gradient(135deg, #0077b6, #00b4d8)'
            : 'rgba(0,119,182,0.12)',
          border: variant === 'primary'
            ? '1px solid rgba(0,180,216,0.3)'
            : '1px solid var(--color-border)',
          boxShadow: variant === 'primary'
            ? '0 4px 20px rgba(0,180,216,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 1px 4px rgba(0,0,0,0.1)',
          color: variant === 'primary' ? '#fff' : 'var(--color-accent-3)',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.transform = 'translateY(-2px)'
          el.style.boxShadow = variant === 'primary'
            ? '0 8px 32px rgba(0,180,216,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
            : '0 4px 16px rgba(0,119,182,0.2)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = variant === 'primary'
            ? '0 4px 20px rgba(0,180,216,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
            : '0 1px 4px rgba(0,0,0,0.1)'
        }}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    )
  }
)
LiquidButton.displayName = 'LiquidButton'

export const MetalButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-semibold rounded-xl overflow-hidden transition-all duration-200 cursor-pointer',
          sizes[size],
          className
        )}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: 'var(--color-white)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
MetalButton.displayName = 'MetalButton'
