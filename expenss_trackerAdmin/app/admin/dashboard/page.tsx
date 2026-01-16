'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadData(token)
  }, [router])

  const loadData = async (token: string) => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (statsRes.ok) setStats(await statsRes.json())
      if (usersRes.ok) setUsers((await usersRes.json()).users)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    router.push('/admin/login')
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>💰 Expense Tracker</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-item active">
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
          <Link href="/admin/settings" className="nav-item">
            <span>⚙️</span> Settings
          </Link>
        </nav>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card purple">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{stats?.totalExpenses || 0}</h3>
              <p>Total Expenses</p>
            </div>
          </div>
          <div className="stat-card pink">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>₹{stats?.totalAmount?.toFixed(2) || '0.00'}</h3>
              <p>Total Amount</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats?.byCategory?.length || 0}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="card">
            <h3>Expenses by Category</h3>
            <div className="category-list">
              {stats?.byCategory?.map((cat: any) => (
                <div key={cat._id} className="category-item">
                  <div className="category-name">{cat._id}</div>
                  <div className="category-stats">
                    <span className="amount">₹{cat.total.toFixed(2)}</span>
                    <span className="count">{cat.count} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Recent Users</h3>
            <div className="user-list">
              {users.slice(0, 5).map((user: any) => (
                <div key={user._id} className="user-item">
                  <div className="user-avatar">{user.name.charAt(0)}</div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
