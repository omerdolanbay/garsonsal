'use client'

import { type ButtonHTMLAttributes, forwardRef, useRef } from 'react'
import { cn } from '@/lib/utils'

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const RippleButton = forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, variant = 'default', size = 'md', children, onClick, ...props }, ref) => {
    const btnRef = useRef<HTMLButtonElement>(null)

    const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        background: 'linear-gradient(135deg, rgba(0,119,182,0.15), rgba(0,180,216,0.1))',
        border: '1px solid var(--color-border)',
        color: 'var(--color-accent-2)',
      },
      danger: {
        background: 'rgba(248,113,113,0.08)',
        border: '1px solid rgba(248,113,113,0.2)',
        color: '#f87171',
      },
      success: {
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.2)',
        color: '#22c55e',
      },
      ghost: {
        background: 'transparent',
        border: '1px solid var(--color-border)',
        color: 'var(--color-muted)',
      },
    }

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
      const btn = (ref as React.RefObject<HTMLButtonElement>)?.current ?? btnRef.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const ripple = document.createElement('span')
        const size = Math.max(rect.width, rect.height)
        ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size / 2}px;
          top:${e.clientY - rect.top - size / 2}px;
          background:rgba(0,180,216,0.25);
          transform:scale(0); animation:ripple-anim 0.5s linear;
        `
        btn.appendChild(ripple)
        setTimeout(() => ripple.remove(), 500)
      }
      onClick?.(e)
    }

    return (
      <button
        ref={ref ?? btnRef}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-xl overflow-hidden transition-all duration-150 cursor-pointer',
          sizes[size],
          className
        )}
        style={variantStyles[variant]}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    )
  }
)
RippleButton.displayName = 'RippleButton'
