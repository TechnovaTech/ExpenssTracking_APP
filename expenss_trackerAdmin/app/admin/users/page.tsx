'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        setFilteredUsers(data.users || [])
        console.log('Users loaded:', data.users)
      } else {
        console.error('Failed to load users:', res.status)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === '') {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter((user: any) => 
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredUsers(filtered)
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
          <Link href="/admin/users" className="nav-item active">
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
          <h1>Users Management</h1>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Database</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <tr key={user._id}>
                  <td>
                    <span style={{ fontWeight: 600 }}>{user.name}</span>
                  </td>
                  <td>{user.email}</td>
                  <td><code style={{fontSize: '12px', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px'}}>{user.databaseName}</code></td>
                  <td><span style={{color: user.isActive ? '#22c55e' : '#ef4444'}}>{user.isActive ? '✅ Active' : '❌ Inactive'}</span></td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/admin/users/${user._id}`}>
                      <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>View Details</button>
                    </Link>
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
