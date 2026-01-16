'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    const body = isRegister ? { email, password, name } : { email, password }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem('token', data.token)
      router.push('/admin/dashboard')
    } else {
      setError(data.error || 'Failed')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
        <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>{isRegister ? 'Register' : 'Admin Login'}</h1>
        
        {error && <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '6px', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input
              className="input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
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
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); setError('') }} style={{ color: '#007bff' }}>
            {isRegister ? 'Login' : 'Register'}
          </a>
        </p>
      </div>
    </div>
  )
}
