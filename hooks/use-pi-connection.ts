"use client"

import { useState, useEffect, useCallback } from 'react'

interface PiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
  timestamp: string
}

interface PiConnectionState {
  isConnected: boolean
  isLoading: boolean
  lastError: string | null
  lastHeartbeat: Date | null
}

export function usePiConnection() {
  const [state, setState] = useState<PiConnectionState>({
    isConnected: false,
    isLoading: true,
    lastError: null,
    lastHeartbeat: null
  })

  // Check Pi health/connectivity
  const checkHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/pi?endpoint=health', {
        credentials: 'include'
      })
      const result: PiResponse = await response.json()

      if (result.ok) {
        setState(prev => ({
          ...prev,
          isConnected: true,
          lastError: null,
          lastHeartbeat: new Date(),
          isLoading: false
        }))
        return true
      } else {
        throw new Error(result.error || 'Health check failed')
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        lastError: error instanceof Error ? error.message : 'Connection failed',
        isLoading: false
      }))
      return false
    }
  }, [])

  // Send command to Pi
  const sendCommand = useCallback(async (endpoint: string, data?: any): Promise<PiResponse> => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch('/api/pi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ endpoint, ...data })
      })

      const result: PiResponse = await response.json()

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: result.ok ? null : result.error || 'Command failed'
      }))

      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: errorMsg
      }))

      return {
        ok: false,
        error: errorMsg,
        timestamp: new Date().toISOString()
      }
    }
  }, [])

  // Get data from Pi
  const getData = useCallback(async (endpoint: string): Promise<PiResponse> => {
    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const response = await fetch(`/api/pi?endpoint=${endpoint}`, {
        credentials: 'include'
      })
      const result: PiResponse = await response.json()

      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: result.ok ? null : result.error || 'Data fetch failed'
      }))

      return result
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        lastError: errorMsg
      }))

      return {
        ok: false,
        error: errorMsg,
        timestamp: new Date().toISOString()
      }
    }
  }, [])

  // Periodic health check
  useEffect(() => {
    checkHealth()

    const interval = setInterval(() => {
      checkHealth()
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [checkHealth])

  return {
    ...state,
    checkHealth,
    sendCommand,
    getData
  }
}