#!/bin/bash

echo "🔐 Fingerprint System Status Check"
echo "=================================="

# Check if fingerprint service is running
echo ""
echo "📋 Service Status:"
if systemctl is-active --quiet fingerprint-controller; then
    echo "✅ Fingerprint service is running"
    echo "📊 Service details:"
    systemctl status fingerprint-controller --no-pager -l
else
    echo "❌ Fingerprint service is not running"
    echo ""
    echo "🚀 To start the service:"
    echo "   sudo systemctl start fingerprint-controller"
    echo ""
    echo "🔧 To start manually for testing:"
    echo "   ./scripts/start_fingerprint_monitor.sh"
fi

echo ""
echo "🔌 Hardware Check:"

# Check for USB devices
if ls /dev/ttyUSB* >/dev/null 2>&1; then
    echo "✅ USB serial devices found:"
    ls -la /dev/ttyUSB*
elif ls /dev/ttyACM* >/dev/null 2>&1; then
    echo "✅ ACM serial devices found:"
    ls -la /dev/ttyACM*
else
    echo "❌ No USB serial devices found"
    echo "   Check AS608 sensor USB connection"
fi

echo ""
echo "👤 Permissions Check:"
if groups | grep -q dialout; then
    echo "✅ User is in dialout group"
else
    echo "❌ User not in dialout group"
    echo "   Run: sudo usermod -a -G dialout $USER"
    echo "   Then logout and login again"
fi

echo ""
echo "📝 Recent Logs:"
if systemctl is-active --quiet fingerprint-controller; then
    echo "Last 10 lines from fingerprint service:"
    journalctl -u fingerprint-controller -n 10 --no-pager
else
    echo "Service not running - no logs available"
fi

echo ""
echo "🧪 Quick Test:"
echo "Run this to test sensor connectivity:"
echo "   python3 scripts/test_fingerprint_sensor.py"
