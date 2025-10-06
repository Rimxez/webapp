"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Thermometer, Droplets, Activity, Clock, Wifi, WifiOff } from 'lucide-react'
import { usePiSocket } from '@/hooks/use-pi-socket'

export function PiRealtimeData() {
  const { isConnected, sensorData, recentLogs, lastUpdate } = usePiSocket()

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      {/* Real-time Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-600" />
            )}
            Real-time Data Stream
          </CardTitle>
          <CardDescription>
            Live sensor data and system events from Raspberry Pi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Streaming" : "Disconnected"}
            </Badge>
            {lastUpdate && (
              <p className="text-sm text-gray-600">
                Last update: {formatTimestamp(lastUpdate.toISOString())}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sensor Data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Thermometer className="w-4 h-4" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.temperature ? `${sensorData.temperature}°C` : '--'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {sensorData?.timestamp ? formatTimestamp(sensorData.timestamp) : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Droplets className="w-4 h-4" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sensorData?.humidity ? `${sensorData.humidity}%` : '--'}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {sensorData?.timestamp ? formatTimestamp(sensorData.timestamp) : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4" />
              Motion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant={sensorData?.motion ? "destructive" : "secondary"}>
                {sensorData?.motion ? "Detected" : "Clear"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              {sensorData?.timestamp ? formatTimestamp(sensorData.timestamp) : 'No data'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Live system logs and events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentLogs.length > 0 ? (
              recentLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        log.level === 'error' ? 'destructive' : 
                        log.level === 'warning' ? 'outline' : 
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {log.level}
                    </Badge>
                    <span>{log.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                {isConnected ? 'Waiting for activity...' : 'Connect to view logs'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}