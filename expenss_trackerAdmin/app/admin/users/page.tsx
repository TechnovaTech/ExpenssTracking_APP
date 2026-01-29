'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Users() {
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

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      if (response.ok) {
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isActive: !currentStatus } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user status:', error)
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
          <h2>👥 User Management</h2>
        </div>
        <nav className="sidebar-nav">
          <Link href="/admin/dashboard" className="nav-item">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/admin/users" className="nav-item active">
            <span>👥</span> All Users
          </Link>
        </nav>
        <button className="logout-btn" onClick={logout}>🚪 Logout</button>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h1>All Users</h1>
          <div className="user-info">
            <span>Total: {users.length} users</span>
          </div>
        </header>

        <div className="content">
          <div className="card">
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
                    <td>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button 
                        className={`action-btn ${user.isActive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <Link href={`/admin/users/${user._id}`} className="action-btn btn-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}