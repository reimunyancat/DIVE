'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Sidebar } from '@/components/layout/sidebar'
import { Input } from '@/components/ui/input'
import { useThemeInputStore } from '@/lib/store'

export default function HomePage() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  const { setTheme } = useThemeInputStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setTheme(inputValue.trim())
      router.push('/search')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 pl-16">
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
          {/* Background Illustration */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[600px] w-[800px] opacity-20">
              {/* Airplane */}
              <svg
                className="absolute right-20 top-10 h-48 w-48 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              {/* Passport */}
              <svg
                className="absolute bottom-32 left-20 h-32 w-32 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6zm6 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm-4 10h8v1H8v-1zm0 2h8v1H8v-1z" />
              </svg>
              {/* Globe */}
              <svg
                className="absolute bottom-20 right-32 h-40 w-40 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              {/* Camera */}
              <svg
                className="absolute left-40 top-20 h-24 w-24 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="3.2" />
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
              {/* Suitcase */}
              <svg
                className="absolute bottom-40 left-1/2 h-28 w-28 -translate-x-1/2 text-gray-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.5 18H8V9h1.5v9zm3.25 0h-1.5V9h1.5v9zm.75-12h-3V3.5h3V6zM16 18h-1.5V9H16v9z" />
              </svg>
              {/* Location Pin */}
              <svg
                className="absolute right-60 top-40 h-20 w-20 text-red-500/50"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10 flex flex-col items-center gap-8"
          >
            {/* Logo */}
            <h1 className="text-7xl font-bold tracking-tight">
              <span className="text-white">DI</span>
              <span className="text-primary">VE</span>
            </h1>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="테마를 입력해주세요"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-12 w-full rounded-full bg-white pl-14 pr-6 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
