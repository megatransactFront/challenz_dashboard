'use client'
import { useEffect } from 'react'
import { redirect } from 'next/navigation'


export default function Home() {
  useEffect(() => {
    redirect('/dashboard')
  }, [])

  // Return a loading state while redirect happens
  return <div>Loading...</div>
}