"use client"

import { useEffect, useState } from "react"

interface User {
  username: string
  email: string
  role: string
  status: string
  access: string
}

interface PendingUser {
  username: string
  email: string
  role: string
}

export default function PeoplePage() {
  const [users, setUsers] = useState<User[]>([])
  const [pending, setPending] = useState<PendingUser[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users")
        const data = await res.json()
        setUsers(data.users || [])
        setPending(data.pending || [])
      } catch (err) {
        console.error("Failed to load users", err)
      }
    }
    fetchUsers()
  }, [])

  return (
    <section className="section">
      <div className="section-header">
        <h2><i className="fas fa-users" /> People Management</h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>User List</h3>
          <button className="btn btn-sm" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus" /> Add User
          </button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th><th>Email</th><th>Role</th>
                  <th>Status</th><th>Access</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? users.map((u, i) => (
                  <tr key={i}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>{u.access}</td>
                    <td>
                      <button className="btn btn-sm">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3>Pending Approvals</h3></div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pending.length > 0 ? pending.map((p, i) => (
                  <tr key={i}>
                    <td>{p.username}</td>
                    <td>{p.email}</td>
                    <td>{p.role}</td>
                    <td>
                      <button className="btn btn-sm">Approve</button>
                      <button className="btn btn-sm btn-danger">Reject</button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}>No pending approvals</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add User</h3>
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            </div>
            <div className="modal-body">
              {/* TODO: implement controlled form */}
              <form>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" placeholder="Enter username" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select>
                    <option value="guest">Guest</option>
                    <option value="family">Family Member</option>
                    <option value="administrator">Administrator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Access Type</label>
                  <select>
                    <option value="full">Full Access</option>
                    <option value="limited">Limited (Date-based)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Save User</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
