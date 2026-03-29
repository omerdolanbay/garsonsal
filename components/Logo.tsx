import Image from 'next/image'

type LogoVariant = 'navbar' | 'footer' | 'default'

const variantStyles: Record<LogoVariant, { height: number }> = {
  navbar:  { height: 44 }, // h-11
  footer:  { height: 24 }, // h-6
  default: { height: 40 },
}

export default function Logo({
  size,
  variant,
  className,
}: {
  size?: number
  variant?: LogoVariant
  className?: string
}) {
  const h = variant ? variantStyles[variant].height : (size ?? 40)
  return (
    <Image
      src="/logo.svg"
      alt="Garsonsal"
      width={h * 4}
      height={h}
      style={{ height: h, width: 'auto' }}
      className={`logo-adaptive${className ? ` ${className}` : ''}`}
      priority
    />
  )
}
