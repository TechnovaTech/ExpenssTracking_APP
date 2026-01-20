'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Expenses() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadExpenses(token)
  }, [router])

  const loadExpenses = async (token: string) => {
    try {
      const res = await fetch('/api/expenses', { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json();
        console.log('Loaded expenses:', data.expenses);
        setExpenses(data.expenses);
      }
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
          <Link href="/admin/expenses" className="nav-item active">
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
          <h1>Expenses</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Payment</th>
                <th>Person</th>
                <th>Amount</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp: any) => (
                <tr key={exp._id || exp.id}>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description}</td>
                  <td>{exp.paymentMethod || 'N/A'}</td>
                  <td>{exp.person || 'N/A'}</td>
                  <td style={{ fontWeight: 600, color: '#667eea' }}>₹{exp.amount.toFixed(2)}</td>
                  <td>
                    {exp.imagePath ? (
                      <div>
                        <img 
                          src={`/api/images/${exp.imagePath}`} 
                          alt="Expense receipt" 
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => window.open(`/api/images/${exp.imagePath}`, '_blank')}
                          onError={(e) => {
                            console.log('Image failed to load:', exp.imagePath);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'inline';
                          }}
                        />
                        <small style={{ display: 'block', fontSize: '10px', color: '#666' }}>{exp.imagePath}</small>
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>No image</span>
                    )}
                    <span style={{ color: 'red', display: 'none' }}>Image not found</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
