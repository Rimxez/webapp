"use client"

import { useEffect, useState, useCallback } from 'react'

interface SensorData {
  temperature?: number
  humidity?: number
  motion?: boolean
  door_state?: 'locked' | 'unlocked' | 'unknown'
  timestamp: string
}

interface LogEntry {
  id: string
  level: 'info' | 'warning' | 'error'
  message: string
  timestamp: string
}

interface PiSocketState {
  isConnected: boolean
  sensorData: SensorData | null
  recentLogs: LogEntry[]
  lastUpdate: Date | null
}

export function usePiSocket() {
  const [state, setState] = useState<PiSocketState>({
    isConnected: false,
    sensorData: null,
    recentLogs: [],
    lastUpdate: null
  })
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const connectStream = useCallback(() => {
    // Use server-side proxy for secure real-time communication
    const es = new EventSource('/api/pi/socket')

    es.onopen = () => {
      setState(prev => ({ ...prev, isConnected: true }))
    }

    es.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)

        switch (message.type) {
          case 'connected':
            setState(prev => ({ ...prev, isConnected: true }))
            break

          case 'sensor_data':
            setState(prev => ({
              ...prev,
              sensorData: message.data,
              lastUpdate: new Date()
            }))
            break

          case 'log_entry':
            setState(prev => ({
              ...prev,
              recentLogs: [message.data, ...prev.recentLogs.slice(0, 49)]
            }))
            break

          case 'door_state_change':
            setState(prev => ({
              ...prev,
              sensorData: prev.sensorData ? {
                ...prev.sensorData,
                door_state: message.data.state,
                timestamp: message.data.timestamp
              } : {
                door_state: message.data.state,
                timestamp: message.data.timestamp
              },
              lastUpdate: new Date()
            }))
            break
        }
      } catch (error) {
        console.error('Error parsing SSE message:', error)
      }
    }

    es.onerror = () => {
      setState(prev => ({ ...prev, isConnected: false }))
      // Auto-reconnect after 5 seconds
      setTimeout(() => {
        if (es.readyState === EventSource.CLOSED) {
          connectStream()
        }
      }, 5000)
    }

    setEventSource(es)
    return es
  }, [])

  const disconnectStream = useCallback(() => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
      setState(prev => ({ ...prev, isConnected: false }))
    }
  }, [eventSource])

  const sendCommand = useCallback((command: string, data?: any) => {
    // Commands are sent via authenticated API calls, not real-time stream
    return fetch('/api/pi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ endpoint: command, ...data })
    })
  }, [])

  useEffect(() => {
    const es = connectStream()
    return () => es.close()
  }, [connectStream])

  return {
    ...state,
    sendCommand,
    reconnect: connectStream,
    disconnect: disconnectStream
  }
}