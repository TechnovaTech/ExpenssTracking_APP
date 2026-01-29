'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadUsers(token)
  }, [router])

  const loadUsers = async (token: string) => {
    try {
      const response = await fetch('/api/admin/users', { 
        headers: { Authorization: `Bearer ${token}` } 
      })
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
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

  const activeUsers = users.filter(user => user.isActive).length
  const inactiveUsers = users.filter(user => !user.isActive).length

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>👥 User Management</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-item active">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/users" className="nav-item">
            <span>👥</span> All Users
          </Link>
        </nav>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h1>Dashboard</h1>
          <div className="user-info">Admin Panel</div>
        </header>

        <div className="content">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{users.length}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-card">
              <h3>{activeUsers}</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-card">
              <h3>{inactiveUsers}</h3>
              <p>Inactive Users</p>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>All Users</h3>
            <div className="table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id}>
                      <td>
                        <div className="user-details">
                          <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div className="user-name">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-email">{user.email}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link href={`/admin/users/${user._id}`} className="action-btn">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}