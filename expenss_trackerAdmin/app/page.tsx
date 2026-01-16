'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
}
