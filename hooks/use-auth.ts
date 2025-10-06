"use client"

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isLoggedIn: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isLoggedIn: false
  })

  const checkAuth = useCallback(async () => {
    try {
      // Get actual user info from auth endpoint
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        if (result.ok && result.user) {
          setState({
            user: result.user,
            isLoading: false,
            isLoggedIn: true
          })
        } else {
          setState({
            user: null,
            isLoading: false,
            isLoggedIn: false
          })
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          isLoggedIn: false
        })
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isLoggedIn: false
      })
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/login', {
        method: 'DELETE',
        credentials: 'include'
      })
    } finally {
      setState({
        user: null,
        isLoading: false,
        isLoggedIn: false
      })
    }
  }, [])

  const onLoginSuccess = useCallback(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    ...state,
    checkAuth,
    logout,
    onLoginSuccess
  }
}