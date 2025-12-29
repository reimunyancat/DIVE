'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Input } from '@/components/ui/input'
import { useThemeInputStore } from '@/lib/store'

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-16">
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-7xl font-bold tracking-tight">
            <span className="text-white">DI</span>
            <span className="text-primary">VE</span>
          </h1>
          <p className="mt-8 text-2xl font-medium text-white">여행 계획을 함께 세우고 계획합시다!</p>
        </div>
      </main>
    </div>
  )
}
