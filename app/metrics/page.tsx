"use client"

import { useEffect, useState } from "react"
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"

interface AuthMetric {
  time: string
  success: number
  failed: number
}

interface DoorMetric {
  time: string
  success: number
  failed: number
}

export default function MetricsPage() {
  const [authMetrics, setAuthMetrics] = useState<AuthMetric[]>([])
  const [doorMetrics, setDoorMetrics] = useState<DoorMetric[]>([])
  const [cpu, setCpu] = useState(0)
  const [ram, setRam] = useState(0)
  const [temperature, setTemperature] = useState(0)
  const [uptime, setUptime] = useState("0d 0h 0m")
  const [cameraLatency, setCameraLatency] = useState(0)

  // Fetch metrics from backend
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/metrics")
        const data = await res.json()
        setAuthMetrics(data.authMetrics || [])
        setDoorMetrics(data.doorMetrics || [])
        setCpu(data.cpu || 0)
        setRam(data.ram || 0)
        setTemperature(data.temperature || 0)
        setUptime(data.uptime || "0d 0h 0m")
        setCameraLatency(data.cameraLatency || 0)
      } catch (err) {
        console.error("Failed to load metrics", err)
      }
    }
    fetchMetrics()
  }, [])

  return (
    <section className="section">
      <div className="section-header">
        <h2><i className="fas fa-chart-bar" /> Metrics</h2>
      </div>

      <div className="metrics-grid">
        {/* Authentication Metrics */}
        <div className="card">
          <div className="card-header"><h3>Authentication Metrics</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={authMetrics}>
                <Line type="monotone" dataKey="success" stroke="#4caf50" />
                <Line type="monotone" dataKey="failed" stroke="#f44336" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            <div className="metrics-summary">
              <div className="metric-item">
                <span className="metric-label">Successful Logins</span>
                <span className="metric-value">
                  {authMetrics.reduce((a, b) => a + b.success, 0)}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Failed Logins</span>
                <span className="metric-value">
                  {authMetrics.reduce((a, b) => a + b.failed, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Door Access Metrics */}
        <div className="card">
          <div className="card-header"><h3>Door Access Metrics</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={doorMetrics}>
                <Line type="monotone" dataKey="success" stroke="#4caf50" />
                <Line type="monotone" dataKey="failed" stroke="#f44336" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
            <div className="metrics-summary">
              <div className="metric-item">
                <span className="metric-label">Successful Unlocks</span>
                <span className="metric-value">
                  {doorMetrics.reduce((a, b) => a + b.success, 0)}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Failed Unlocks</span>
                <span className="metric-value">
                  {doorMetrics.reduce((a, b) => a + b.failed, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="card">
          <div className="card-header"><h3>System Performance</h3></div>
          <div className="card-body metrics-summary">
            <div className="metric-item">
              <span className="metric-label">CPU Usage</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${cpu}%` }}></div>
              </div>
              <span className="metric-value">{cpu}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">RAM Usage</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${ram}%` }}></div>
              </div>
              <span className="metric-value">{ram}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Temperature</span>
              <span className="metric-value">{temperature}°C</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Uptime</span>
              <span className="metric-value">{uptime}</span>
            </div>
          </div>
        </div>

        {/* Camera Performance */}
        <div className="card">
          <div className="card-header"><h3>Camera Performance</h3></div>
          <div className="card-body">
            <div className="metric-item">
              <span className="metric-label">Camera Latency</span>
              <span className="metric-value">{cameraLatency}ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
