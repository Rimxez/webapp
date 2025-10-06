"use client";

import { useEffect, useState } from "react";

interface User {
  username: string;
  role: string;
  email: string;
  access_type: string;
  access_until?: string;
  permissions: string[];
  fingerprint_status: string;
  enrollment_date?: string;
}

interface Activity {
  timestamp: string;
  action: string;
  details: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setUser(data.user);
        setActivities(data.activities || []);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <section className="section active" id="profile">
      <div className="section-header">
        <h2>
          <i className="fas fa-user" /> My Profile
        </h2>
      </div>

      {/* Current User */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-id-card" /> Current User
          </h3>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: 60,
                height: 60,
                backgroundColor: "#3498db",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#2c3e50" }}>{user.username}</h3>
              <p style={{ margin: 0, color: "#777" }}>{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-edit" /> Edit Profile
          </h3>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Username</label>
              <input type="text" defaultValue={user.username} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue={user.email} required />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user.role} readOnly />
            </div>
            <div className="form-group">
              <label>Access Type</label>
              <input type="text" value={user.access_type} readOnly />
            </div>
            {user.access_until && (
              <div className="form-group">
                <label>Access Until</label>
                <input type="date" value={user.access_until} readOnly />
              </div>
            )}
            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-save" /> Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Permissions */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-key" /> Your Permissions
          </h3>
        </div>
        <div className="card-body">
          {user.permissions.map((perm, i) => (
            <div key={i} className="permissions-list">
              {perm}
            </div>
          ))}
        </div>
      </div>

      {/* Fingerprint */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-fingerprint" /> Fingerprint Authentication
          </h3>
        </div>
        <div className="card-body">
          <p>Status: {user.fingerprint_status}</p>
          {user.enrollment_date && <p>Enrolled: {user.enrollment_date}</p>}
          <div>
            <button className="btn btn-primary">
              <i className="fas fa-fingerprint" /> Enroll Fingerprint
            </button>
            <button className="btn btn-danger">
              <i className="fas fa-trash" /> Remove Fingerprint
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3>
            <i className="fas fa-history" /> My Recent Activity
          </h3>
        </div>
        <div className="card-body">
          {activities.length > 0 ? (
            activities.map((a, i) => (
              <p key={i}>
                {a.timestamp}: {a.action} - {a.details}
              </p>
            ))
          ) : (
            <p>No activity yet</p>
          )}
        </div>
      </div>
    </section>
  );
}
