// app/page.tsx
'use client'
import { redirect } from 'next/navigation'
import supabase from "@/config/supabaseClient"

export default function Home() {

  console.log(supabase)
  redirect('/dashboard')
}