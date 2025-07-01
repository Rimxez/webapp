#!/bin/bash

# Quick start script for fingerprint monitoring
# Use this for testing without installing as a service

echo "🔐 Starting Fingerprint Monitor..."
echo "Press Ctrl+C to stop"
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if AS608 sensor is connected
echo "🔍 Checking for AS608 sensor..."
if ls /dev/ttyUSB* >/dev/null 2>&1; then
    echo "✅ Found USB serial device(s):"
    ls -la /dev/ttyUSB*
elif ls /dev/ttyACM* >/dev/null 2>&1; then
    echo "✅ Found ACM serial device(s):"
    ls -la /dev/ttyACM*
else
    echo "❌ No USB serial devices found"
    echo "Please check AS608 sensor connection"
    echo ""
fi

# Check permissions
echo ""
echo "🔧 Checking USB permissions..."
if groups | grep -q dialout; then
    echo "✅ User is in dialout group"
else
    echo "❌ User not in dialout group - you may need to run:"
    echo "   sudo usermod -a -G dialout $USER"
    echo "   Then logout and login again"
fi

echo ""
echo "🚀 Starting fingerprint controller..."
echo "You should see scanning messages every 10 seconds"
echo ""

# Run the fingerprint controller
cd "$SCRIPT_DIR"
python3 fingerprint_controller.py
