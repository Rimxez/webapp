"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Lock, Unlock, Wifi, WifiOff, Camera, Users, BarChart3 } from 'lucide-react'
import { usePiConnection } from '@/hooks/use-pi-connection'

export function PiDeviceControl() {
  const { isConnected, isLoading, lastError, sendCommand, getData } = usePiConnection()
  const [doorState, setDoorState] = useState<'locked' | 'unlocked' | 'unknown'>('unknown')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleDoorControl = async (action: 'lock' | 'unlock') => {
    setActionLoading(action)

    try {
      const result = await sendCommand('door/control', { action })

      if (result.ok) {
        setDoorState(action === 'lock' ? 'locked' : 'unlocked')
      }
    } finally {
      setActionLoading(null)
    }
  }

  const handleCameraCapture = async () => {
    setActionLoading('camera')

    try {
      await sendCommand('camera/capture')
    } finally {
      setActionLoading(null)
    }
  }

  const handleGetMetrics = async () => {
    setActionLoading('metrics')

    try {
      const result = await getData('metrics')
      if (result.ok) {
        console.log('Metrics:', result.data)
      }
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Raspberry Pi Connection
          </CardTitle>
          <CardDescription>
            Wireless connection to smart door lock system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </div>
          {lastError && (
            <p className="text-sm text-red-600 mt-2">{lastError}</p>
          )}
        </CardContent>
      </Card>

      {/* Door Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {doorState === 'locked' ? (
              <Lock className="w-5 h-5 text-red-600" />
            ) : doorState === 'unlocked' ? (
              <Unlock className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
            Door Lock Control
          </CardTitle>
          <CardDescription>
            Control the smart door lock remotely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => handleDoorControl('unlock')}
              disabled={!isConnected || actionLoading === 'unlock'}
              variant="outline"
              className="flex items-center gap-2"
            >
              {actionLoading === 'unlock' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
              Unlock
            </Button>
            <Button
              onClick={() => handleDoorControl('lock')}
              disabled={!isConnected || actionLoading === 'lock'}
              variant="outline"
              className="flex items-center gap-2"
            >
              {actionLoading === 'lock' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Lock
            </Button>
          </div>
          <div className="mt-2">
            <Badge variant={
              doorState === 'locked' ? "destructive" : 
              doorState === 'unlocked' ? "default" : 
              "secondary"
            }>
              Status: {doorState}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Device Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Camera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCameraCapture}
              disabled={!isConnected || actionLoading === 'camera'}
              className="w-full"
            >
              {actionLoading === 'camera' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              Capture Photo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              disabled={!isConnected}
              className="w-full"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGetMetrics}
              disabled={!isConnected || actionLoading === 'metrics'}
              className="w-full"
              variant="outline"
            >
              {actionLoading === 'metrics' ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <BarChart3 className="w-4 h-4 mr-2" />
              )}
              View Metrics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}