'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
    } else {
      router.push('/admin/dashboard')
    }
  }, [router])

  return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
}
