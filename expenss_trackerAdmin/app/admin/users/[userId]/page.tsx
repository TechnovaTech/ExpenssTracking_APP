'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserDetail({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [userImages, setUserImages] = useState<any[]>([])
  const [showGallery, setShowGallery] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadUserData(token)
  }, [params.userId, router])

  const loadUserData = async (token: string) => {
    try {
      const [userRes, dataRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/user-data/${params.userId}`, { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (userRes.ok) {
        const users = (await userRes.json()).users
        const foundUser = users.find((u: any) => u._id === params.userId)
        setUser(foundUser)
        
        // Load user images
        if (foundUser?.email) {
          const imgRes = await fetch(`/api/images?userEmail=${foundUser.email}`)
          if (imgRes.ok) {
            const imgData = await imgRes.json()
            setUserImages(imgData.images || [])
          }
        }
      }
      
      if (dataRes.ok) {
        setUserData(await dataRes.json())
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
  if (!user) return <div className="loading">User not found</div>

  const totalExpenses = userData?.expenses?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0
  const totalIncome = userData?.income?.reduce((sum: number, inc: any) => sum + Number(inc.amount), 0) || 0
  const balance = totalIncome - totalExpenses

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
          <h1>User Profile</h1>
          <div className="user-info">
            <Link href="/admin/users" className="action-btn">← Back to Users</Link>
          </div>
        </header>

        <div className="content" style={{ padding: '20px', overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
          
          {/* User Header Card */}
          <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="user-avatar" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', margin: '0 0 5px 0', color: '#495057' }}>{user.name}</h2>
                <p style={{ fontSize: '14px', color: '#6c757d', margin: '0 0 10px 0' }}>{user.email}</p>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <span className={`status-badge ${user.isActive ? 'status-active' : 'status-inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6c757d' }}>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6c757d', fontFamily: 'monospace' }}>
                    ID: {user._id}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => setShowGallery(true)}
                  style={{
                    padding: '12px 16px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  🖼️ Gallery ({userImages.length})
                </button>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 15px 0', color: '#495057', borderBottom: '2px solid #e9ecef', paddingBottom: '10px' }}>
              Financial Overview
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '20px', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fed7d7' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc3545', marginBottom: '5px' }}>
                  ₹{totalExpenses.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
                  Total Expenses
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {userData?.expenses?.length || 0} transactions
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: '#f0fff4', borderRadius: '8px', border: '1px solid #c6f6d5' }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: '#28a745', marginBottom: '5px' }}>
                  ₹{totalIncome.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
                  Total Income
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {userData?.income?.length || 0} transactions
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px', background: balance >= 0 ? '#f0fff4' : '#fff5f5', borderRadius: '8px', border: `1px solid ${balance >= 0 ? '#c6f6d5' : '#fed7d7'}` }}>
                <div style={{ fontSize: '28px', fontWeight: '700', color: balance >= 0 ? '#28a745' : '#dc3545', marginBottom: '5px' }}>
                  ₹{balance.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
                  Current Balance
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '5px' }}>
                  {balance >= 0 ? 'Positive' : 'Negative'}
                </div>
              </div>
            </div>
          </div>

          {/* Data Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
                Categories ({userData?.categories?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflow: 'auto' }}>
                {userData?.categories?.length ? 
                  userData.categories.map((cat: any, i: number) => (
                    <span key={i} style={{ 
                      padding: '6px 12px', 
                      background: '#e3f2fd', 
                      color: '#1976d2', 
                      borderRadius: '15px', 
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #bbdefb'
                    }}>
                      {cat.name}
                    </span>
                  )) : 
                  <span style={{ fontSize: '13px', color: '#6c757d', fontStyle: 'italic' }}>No categories used</span>
                }
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
                Persons ({userData?.persons?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflow: 'auto' }}>
                {userData?.persons?.length ? 
                  userData.persons.map((person: any, i: number) => (
                    <span key={i} style={{ 
                      padding: '6px 12px', 
                      background: '#fff3e0', 
                      color: '#f57c00', 
                      borderRadius: '15px', 
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #ffcc02'
                    }}>
                      👤 {person.name}
                    </span>
                  )) : 
                  <span style={{ fontSize: '13px', color: '#6c757d', fontStyle: 'italic' }}>No persons added</span>
                }
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
                Payment Methods ({userData?.paymentMethods?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflow: 'auto' }}>
                {userData?.paymentMethods?.length ? 
                  userData.paymentMethods.map((pm: any, i: number) => (
                    <span key={i} style={{ 
                      padding: '6px 12px', 
                      background: '#e8f5e8', 
                      color: '#2e7d32', 
                      borderRadius: '15px', 
                      fontSize: '12px',
                      fontWeight: '500',
                      border: '1px solid #a5d6a7'
                    }}>
                      💳 {pm.name}
                    </span>
                  )) : 
                  <span style={{ fontSize: '13px', color: '#6c757d', fontStyle: 'italic' }}>No payment methods</span>
                }
              </div>
            </div>
          </div>

          {/* Transaction Tables */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', minHeight: '400px' }}>
            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
                Recent Expenses
              </h4>
              <div style={{ maxHeight: '350px', overflow: 'auto', border: '1px solid #e9ecef', borderRadius: '6px' }}>
                {userData?.expenses?.length ? (
                  <table className="users-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px 4px' }}>Date</th>
                        <th style={{ padding: '8px 4px' }}>Category</th>
                        <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.expenses.map((exp: any, i: number) => (
                        <tr key={i}>
                          <td style={{ padding: '6px 4px' }}>{new Date(exp.date).toLocaleDateString()}</td>
                          <td style={{ padding: '6px 4px' }}>{exp.category}</td>
                          <td style={{ padding: '6px 4px', textAlign: 'right', color: '#dc3545', fontWeight: '600' }}>
                            ₹{Number(exp.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6c757d', fontSize: '13px', padding: '40px' }}>
                    No expense transactions
                  </div>
                )}
              </div>
            </div>

            <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
              <h4 style={{ fontSize: '16px', margin: '0 0 15px 0', color: '#495057', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
                Recent Income
              </h4>
              <div style={{ maxHeight: '350px', overflow: 'auto', border: '1px solid #e9ecef', borderRadius: '6px' }}>
                {userData?.income?.length ? (
                  <table className="users-table" style={{ fontSize: '12px' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '8px 4px' }}>Date</th>
                        <th style={{ padding: '8px 4px' }}>Category</th>
                        <th style={{ padding: '8px 4px', textAlign: 'right' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData.income.map((inc: any, i: number) => (
                        <tr key={i}>
                          <td style={{ padding: '6px 4px' }}>{new Date(inc.date).toLocaleDateString()}</td>
                          <td style={{ padding: '6px 4px' }}>{inc.category}</td>
                          <td style={{ padding: '6px 4px', textAlign: 'right', color: '#28a745', fontWeight: '600' }}>
                            ₹{Number(inc.amount).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6c757d', fontSize: '13px', padding: '40px' }}>
                    No income transactions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Modal */}
        {showGallery && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#495057' }}>Image Gallery ({userImages.length})</h3>
                <button 
                  onClick={() => setShowGallery(false)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  ✕ Close
                </button>
              </div>
              
              {userImages.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px',
                  maxHeight: '70vh',
                  overflow: 'auto'
                }}>
                  {userImages.map((img: any) => (
                    <div key={img.id} style={{
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      padding: '10px',
                      background: '#f8f9fa'
                    }}>
                      <img 
                        src={`/api/images/${img.fileName}`}
                        alt={img.originalName}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(`/api/images/${img.fileName}`, '_blank')}
                      />
                      <div style={{ fontSize: '12px', color: '#495057', fontWeight: '600', marginBottom: '4px' }}>
                        {img.originalName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', marginBottom: '4px' }}>
                        Type: {img.transactionType}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d' }}>
                        {new Date(img.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                  No images uploaded by this user
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}