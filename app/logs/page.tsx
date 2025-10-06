"use client"

import { useEffect, useState } from "react"

interface LogEntry {
  timestamp: string
  action: string
  status: string
  user: string
  details: string
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filter, setFilter] = useState("all")

  // Fetch logs from API
  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch(`/api/logs?filter=${filter}`)
        const data = await res.json()
        setLogs(data.logs || [])
      } catch (err) {
        console.error("Failed to fetch logs:", err)
      }
    }
    fetchLogs()
  }, [filter])

  // Download logs as CSV
  const handleDownload = () => {
    window.location.href = "/api/logs/download"
  }

  return (
    <section className="section">
      <div className="section-header">
        <h2>
          <i className="fas fa-list"></i> Activity Logs
        </h2>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Activity Logs</h3>
          <div className="filter-controls">
            <select
              id="log-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Activities</option>
              <option value="door">Door Access</option>
              <option value="login">Authentication</option>
              <option value="camera">Camera</option>
              <option value="user">User Management</option>
              <option value="settings">Settings</option>
            </select>
            <button className="btn btn-sm" id="download-logs-btn" onClick={handleDownload}>
              <i className="fas fa-download"></i> Download CSV
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Status</th>
                  <th>User</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody id="logs-table-body">
                {logs.length > 0 ? (
                  logs.map((log, i) => (
                    <tr key={i}>
                      <td>{log.timestamp}</td>
                      <td>{log.action}</td>
                      <td>{log.status}</td>
                      <td>{log.user}</td>
                      <td>{log.details}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No logs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
