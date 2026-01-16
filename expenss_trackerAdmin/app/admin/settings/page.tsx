'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Settings() {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchSettings()
  }, [router])

  const fetchSettings = async () => {
    const res = await fetch('/api/settings')
    if (res.ok) {
      const data = await res.json()
      setAdminEmail(data.adminEmail || '')
      setAdminPassword(data.adminPassword || '')
    }
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminEmail, adminPassword })
    })
    if (res.ok) {
      setSuccess('Admin credentials saved!')
    } else {
      setError('Failed to save')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>💰 Expense Tracker</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/expenses" className="nav-item">
            <span>💳</span> Expenses
          </Link>
          <Link href="/admin/users" className="nav-item">
            <span>👥</span> Users
          </Link>
          <Link href="/admin/categories" className="nav-item">
            <span>📁</span> Categories
          </Link>
          <Link href="/admin/settings" className="nav-item active">
            <span>⚙️</span> Settings
          </Link>
        </nav>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h1>Settings</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div className="card">
          <h3>Admin Login Credentials</h3>
          {success && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '6px', marginTop: '15px' }}>{success}</div>}
          {error && <div style={{ padding: '10px', background: '#fee', color: '#c00', borderRadius: '6px', marginTop: '15px' }}>{error}</div>}
          <div style={{ marginTop: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Admin Email</label>
            <input
              className="input"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <label style={{ display: 'block', marginBottom: '8px', marginTop: '15px', fontWeight: '500' }}>Admin Password</label>
            <input
              className="input"
              type="text"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter password"
            />
            <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '15px' }}>Save Credentials</button>
          </div>
        </div>
      </main>
    </div>
  )
}
