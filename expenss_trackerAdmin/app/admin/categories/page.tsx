'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [persons, setPersons] = useState<any[]>([])
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
      const [catRes, pmRes, perRes] = await Promise.all([
        fetch('/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/payment-methods', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/persons', { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (catRes.ok) setCategories((await catRes.json()).categories)
      if (pmRes.ok) setPaymentMethods((await pmRes.json()).paymentMethods)
      if (perRes.ok) setPersons((await perRes.json()).persons)
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
          <Link href="/admin/dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/expenses" className="nav-item">
            <span>💳</span> Expenses
          </Link>
          <Link href="/admin/users" className="nav-item">
            <span>👥</span> Users
          </Link>
          <Link href="/admin/categories" className="nav-item active">
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
          <h1>My Settings</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div className="content-grid">
          <div className="card">
            <h3>My Categories</h3>
            <div className="category-list">
              {categories.length > 0 ? categories.map((cat: any) => (
                <div key={cat._id} className="category-item">
                  <div className="category-name">{cat.icon} {cat.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No categories yet</p>}
            </div>
          </div>

          <div className="card">
            <h3>My Payment Methods</h3>
            <div className="category-list">
              {paymentMethods.length > 0 ? paymentMethods.map((pm: any) => (
                <div key={pm._id} className="category-item">
                  <div className="category-name">💳 {pm.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No payment methods yet</p>}
            </div>
          </div>

          <div className="card">
            <h3>My Persons</h3>
            <div className="category-list">
              {persons.length > 0 ? persons.map((person: any) => (
                <div key={person._id} className="category-item">
                  <div className="category-name">👤 {person.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No persons yet</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
