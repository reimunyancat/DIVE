'use client'

import Link from 'next/link'

export function Logo({ size = 'default' }: { size?: 'default' | 'large' }) {
  const textSize = size === 'large' ? 'text-6xl' : 'text-4xl'

  return (
    <Link href="/" className={`font-bold ${textSize}`}>
      <span className="text-white">DI</span>
      <span className="text-primary">VE</span>
    </Link>
  )
}
