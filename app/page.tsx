"use client"

import metrics from "../static/js/metrics"

export default function Page() {
  return (
    <div className="container">
      <header className="main-header">
        <h1>Admin Dashboard</h1>
        <nav className="main-nav">
          <ul>
            <li>
              <a href="#" data-section="dashboard" className="active">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#" data-section="people">
                <i className="fas fa-users"></i> People
              </a>
            </li>
            <li>
              <a href="#" data-section="settings">
                <i className="fas fa-cog"></i> Settings
              </a>
            </li>
            <li>
              <a href="#" data-section="logs">
                <i className="fas fa-list"></i> Logs
              </a>
            </li>
            <li>
              <a href="#" data-section="metrics">
                <i className="fas fa-chart-bar"></i> Metrics
              </a>
            </li>
            <li>
              <a href="#" data-section="guide">
                <i className="fas fa-book"></i> Guide
              </a>
            </li>
            <li>
              <a href="#" data-section="profile">
                <i className="fas fa-user"></i> Profile
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <section id="dashboard" className="section active">
          <div className="section-header">
            <h2>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </h2>
          </div>
          <p>Welcome to the dashboard!</p>
        </section>

        <section id="people" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-users"></i> People
            </h2>
          </div>
          <p>Manage users and their roles here.</p>
        </section>

        <section id="settings" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-cog"></i> Settings
            </h2>
          </div>
          <p>Configure system settings.</p>
        </section>

        <section id="logs" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-list"></i> Logs
            </h2>
          </div>
          <p>View system logs.</p>
        </section>

        <section id="metrics" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-chart-bar"></i> Metrics
            </h2>
          </div>
          <p>Analyze system performance.</p>
        </section>

        <section id="guide" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-book"></i> Guide
            </h2>
          </div>
          <p>Read the user guide.</p>
        </section>

        {/* Profile Section */}
        <div id="profile" className="section">
          <div className="section-header">
            <h2>
              <i className="fas fa-user"></i> User Profile
            </h2>
          </div>
          <div className="profile-grid">
            {/* Profile Information Card */}
            <div className="card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-user-circle"></i> Profile Information
                </h3>
              </div>
              <div className="card-body">
                <form id="profile-form">
                  <div className="form-group">
                    <label htmlFor="profile-username">Username</label>
                    <input type="text" id="profile-username" className="form-control" readOnly />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-name">Full Name</label>
                    <input type="text" id="profile-name" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-email">Email</label>
                    <input type="email" id="profile-email" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-role">Role</label>
                    <input type="text" id="profile-role" className="form-control" readOnly />
                  </div>
                  <div className="form-group">
                    <label htmlFor="profile-password">New Password (leave blank to keep current)</label>
                    <input type="password" id="profile-password" className="form-control" />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save"></i> Update Profile
                  </button>
                </form>
              </div>
            </div>

            {/* Permissions Card */}
            <div className="card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-key"></i> Permissions
                </h3>
              </div>
              <div className="card-body">
                <div id="user-permissions">
                  <div className="loading">Loading permissions...</div>
                </div>
              </div>
            </div>

            {/* Fingerprint Card */}
            <div className="card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-fingerprint"></i> Fingerprint Authentication
                </h3>
              </div>
              <div className="card-body">
                <div className="fingerprint-profile-section">
                  <div className="fingerprint-status-display">
                    <div className="status-item">
                      <label>Status:</label>
                      <span id="profile-fingerprint-status" className="status-badge">
                        Loading...
                      </span>
                    </div>
                    <div className="status-item" id="enrollment-details" style={{ display: "none" }}>
                      <label>Enrolled:</label>
                      <span id="enrollment-date"></span>
                    </div>
                  </div>

                  <div className="fingerprint-actions">
                    <button type="button" className="btn btn-primary" id="profile-enroll-fingerprint-btn" style={{ display: "none" }}>
                      <i className="fas fa-fingerprint"></i> Enroll Fingerprint
                    </button>
                    <button type="button" className="btn btn-danger" id="profile-delete-fingerprint-btn" style={{ display: "none" }}>
                      <i className="fas fa-trash"></i> Remove Fingerprint
                    </button>
                  </div>

                  <div className="fingerprint-info">
                    <p>
                      <i className="fas fa-info-circle"></i> Fingerprint authentication allows you to log in quickly and securely without entering your password.
                    </p>
                    <p>
                      <strong>Note:</strong> You can use fingerprint authentication on the login page or physical keypad (if available).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Card */}
            <div className="card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-history"></i> Recent Activity
                </h3>
              </div>
              <div className="card-body">
                <div className="activity-list" id="profile-activity">
                  <div className="loading">Loading activity...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="main-footer">
        <p>&copy; 2024 Admin Dashboard</p>
      </footer>
    </div>
  );
}
