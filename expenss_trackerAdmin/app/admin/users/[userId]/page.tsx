'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: { userId: string }
}

export default function UserDetail({ params }: PageProps) {
  const { userId } = params
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [userImages, setUserImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [editingIncome, setEditingIncome] = useState<any>(null)
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: '', description: '', date: '', paymentMethod: '', person: '' })
  const [incomeForm, setIncomeForm] = useState({ amount: '', source: '', description: '', date: '' })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    loadUserData(token)
  }, [router])

  const loadUserData = async (token: string) => {
    try {
      const [userRes, dataRes] = await Promise.all([
        fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/admin/user-data/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      ])

      if (userRes.ok) {
        const users = (await userRes.json()).users
        const foundUser = users.find((u: any) => u._id === userId)
        setUser(foundUser)
        
        // Load images after we have user email
        if (foundUser?.email) {
          try {
            const imgRes = await fetch(`/api/images?userEmail=${foundUser.email}`)
            if (imgRes.ok) {
              const imgData = await imgRes.json()
              console.log('Images loaded:', imgData)
              setUserImages(imgData.images || [])
            } else {
              console.error('Failed to load images:', imgRes.status)
            }
          } catch (imgError) {
            console.error('Image loading error:', imgError)
          }
        }
      }
      if (dataRes.ok) setUserData(await dataRes.json())
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

  const editExpense = (exp: any) => {
    setEditingExpense(exp)
    setExpenseForm({ amount: exp.amount, category: exp.category, description: exp.description, date: exp.date.split('T')[0], paymentMethod: exp.paymentMethod, person: exp.person })
    setShowExpenseModal(true)
  }

  const saveExpense = async () => {
    const token = localStorage.getItem('token')
    const url = editingExpense ? `/api/admin/manage-expenses/${userId}` : `/api/admin/manage-expenses/${userId}`
    const method = editingExpense ? 'PUT' : 'POST'
    const body = editingExpense ? { ...expenseForm, id: editingExpense._id } : expenseForm

    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    setShowExpenseModal(false)
    setEditingExpense(null)
    loadUserData(token!)
  }

  const deleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    const token = localStorage.getItem('token')
    await fetch(`/api/admin/manage-expenses/${userId}?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    loadUserData(token!)
  }

  const editIncome = (inc: any) => {
    setEditingIncome(inc)
    setIncomeForm({ amount: inc.amount, source: inc.source, description: inc.description, date: inc.date.split('T')[0] })
    setShowIncomeModal(true)
  }

  const saveIncome = async () => {
    const token = localStorage.getItem('token')
    const url = `/api/admin/manage-income/${userId}`
    const method = editingIncome ? 'PUT' : 'POST'
    const body = editingIncome ? { ...incomeForm, id: editingIncome._id } : incomeForm

    await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) })
    setShowIncomeModal(false)
    setEditingIncome(null)
    loadUserData(token!)
  }

  const deleteIncome = async (id: string) => {
    if (!confirm('Delete this income?')) return
    const token = localStorage.getItem('token')
    await fetch(`/api/admin/manage-income/${userId}?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    loadUserData(token!)
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
          <div>
            <Link href="/admin/users" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>← Back to Users</Link>
            <h1 style={{ marginTop: '5px' }}>{user?.name}'s Data</h1>
          </div>
          <div className="user-info">
            <span>Admin</span>
          </div>
        </header>

        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="user-avatar" style={{ width: '70px', height: '70px', fontSize: '28px' }}>
              {user?.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ marginBottom: '5px' }}>{user?.name}</h2>
              <p style={{ color: '#666', marginBottom: '5px' }}>{user?.email}</p>
              <p style={{ fontSize: '13px', color: '#999' }}>Joined: {new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div className="stat-card purple">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{userData?.expenses?.length || 0}</h3>
              <p>Expenses</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>{userData?.income?.length || 0}</h3>
              <p>Income</p>
            </div>
          </div>
          <div className="stat-card pink">
            <div className="stat-icon">📁</div>
            <div className="stat-info">
              <h3>{userData?.categories?.length || 0}</h3>
              <p>Categories</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">💳</div>
            <div className="stat-info">
              <h3>{userData?.paymentMethods?.length || 0}</h3>
              <p>Payment Methods</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div className="card">
            <h3>Categories</h3>
            <div className="category-list">
              {userData?.categories?.length > 0 ? userData.categories.map((cat: any) => (
                <div key={cat._id} className="category-item">
                  <div className="category-name">{cat.icon} {cat.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No categories</p>}
            </div>
          </div>

          <div className="card">
            <h3>Payment Methods</h3>
            <div className="category-list">
              {userData?.paymentMethods?.length > 0 ? userData.paymentMethods.map((pm: any) => (
                <div key={pm._id} className="category-item">
                  <div className="category-name">💳 {pm.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No payment methods</p>}
            </div>
          </div>

          <div className="card">
            <h3>Persons</h3>
            <div className="category-list">
              {userData?.persons?.length > 0 ? userData.persons.map((person: any) => (
                <div key={person._id} className="category-item">
                  <div className="category-name">👤 {person.name}</div>
                </div>
              )) : <p style={{ color: '#666', fontSize: '14px' }}>No persons</p>}
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Expenses</h3>
            <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>+ Add Expense</button>
          </div>
          {userData?.expenses?.length > 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.expenses.map((exp: any) => (
                  <tr key={exp.id || exp._id}>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>{exp.category}</td>
                    <td>{exp.description}</td>
                    <td>{exp.paymentMethod || 'N/A'}</td>
                    <td>{exp.person || 'N/A'}</td>
                    <td style={{ fontWeight: 600, color: '#dc3545' }}>₹{Number(exp.amount).toFixed(2)}</td>
                    <td>
                      {exp.imagePath ? (
                        <img 
                          src={`/api/images/${exp.imagePath}`} 
                          alt="Expense receipt" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => window.open(`/api/images/${exp.imagePath}`, '_blank')}
                        />
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>No image</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }} onClick={() => editExpense(exp)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteExpense(exp._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: '#666', fontSize: '14px', marginTop: '15px' }}>No expenses</p>}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Uploaded Images ({userImages.length})</h3>
          </div>
          {userImages.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
              {userImages.map((img: any) => (
                <div key={img.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <img 
                    src={`/api/images/${img.fileName}`} 
                    alt={img.originalName}
                    style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}
                    onClick={() => window.open(`/api/images/${img.fileName}`, '_blank')}
                  />
                  <p style={{ fontSize: '12px', margin: '0 0 5px 0', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img.originalName}</p>
                  <p style={{ fontSize: '10px', margin: '0', color: '#666' }}>{img.transactionType}</p>
                  <p style={{ fontSize: '10px', margin: '0', color: '#999' }}>{new Date(img.uploadedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : <p style={{ color: '#666', fontSize: '14px', marginTop: '15px' }}>No images uploaded</p>}
        </div>

        <div className="card" style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>Income</h3>
            <button className="btn btn-primary" onClick={() => setShowIncomeModal(true)}>+ Add Income</button>
          </div>
          {userData?.income?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userData.income.map((inc: any) => (
                  <tr key={inc.id || inc._id}>
                    <td>{new Date(inc.date).toLocaleDateString()}</td>
                    <td>{inc.source}</td>
                    <td>{inc.description}</td>
                    <td style={{ fontWeight: 600, color: '#198754' }}>₹{Number(inc.amount).toFixed(2)}</td>
                    <td>
                      {inc.imagePath ? (
                        <img 
                          src={`/api/images/${inc.imagePath}`} 
                          alt="Income receipt" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => window.open(`/api/images/${inc.imagePath}`, '_blank')}
                        />
                      ) : (
                        <span style={{ color: '#999', fontSize: '12px' }}>No image</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }} onClick={() => editIncome(inc)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => deleteIncome(inc._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ color: '#666', fontSize: '14px', marginTop: '15px' }}>No income</p>}
        </div>

        {showExpenseModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
              <h3>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h3>
              <input className="input" type="number" placeholder="Amount" value={expenseForm.amount} onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})} />
              <input className="input" type="text" placeholder="Category" value={expenseForm.category} onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})} />
              <input className="input" type="text" placeholder="Description" value={expenseForm.description} onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})} />
              <input className="input" type="date" value={expenseForm.date} onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})} />
              <input className="input" type="text" placeholder="Payment Method" value={expenseForm.paymentMethod} onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})} />
              <input className="input" type="text" placeholder="Person" value={expenseForm.person} onChange={(e) => setExpenseForm({...expenseForm, person: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={saveExpense}>Save</button>
                <button className="btn" style={{ background: '#6c757d', color: 'white' }} onClick={() => { setShowExpenseModal(false); setEditingExpense(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showIncomeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
              <h3>{editingIncome ? 'Edit Income' : 'Add Income'}</h3>
              <input className="input" type="number" placeholder="Amount" value={incomeForm.amount} onChange={(e) => setIncomeForm({...incomeForm, amount: e.target.value})} />
              <input className="input" type="text" placeholder="Source" value={incomeForm.source} onChange={(e) => setIncomeForm({...incomeForm, source: e.target.value})} />
              <input className="input" type="text" placeholder="Description" value={incomeForm.description} onChange={(e) => setIncomeForm({...incomeForm, description: e.target.value})} />
              <input className="input" type="date" value={incomeForm.date} onChange={(e) => setIncomeForm({...incomeForm, date: e.target.value})} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={saveIncome}>Save</button>
                <button className="btn" style={{ background: '#6c757d', color: 'white' }} onClick={() => { setShowIncomeModal(false); setEditingIncome(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
