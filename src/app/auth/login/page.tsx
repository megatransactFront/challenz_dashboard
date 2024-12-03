// app/auth/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Add actual auth logic here later
      console.log('Sign in attempted with:', email)
      router.push('/dashboard')
    } catch (error) {
      console.error('Authentication error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Background split design */}
      <div className="absolute inset-0">
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3/5 h-full bg-teal-700" />
          <div className="absolute top-0 right-0 w-2/5 h-full bg-rose-400" />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold mb-6">Challenz</h1>
            <h2 className="text-xl text-gray-700">Sign In</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@megatransact.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/auth/forgot-password')}
                className="text-sm text-gray-600 hover:text-teal-600"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-400 text-white py-3 rounded-md hover:bg-rose-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}