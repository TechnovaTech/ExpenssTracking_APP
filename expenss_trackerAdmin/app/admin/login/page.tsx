'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/settings')
    const settings = await res.json()

    if (email === settings.adminEmail && password === settings.adminPassword) {
      localStorage.setItem('token', 'admin-token')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Admin Login</h1>
        
        {error && <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '6px', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary" style={{ width: '100%' }} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
