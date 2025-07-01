#!/bin/bash

# Install Fingerprint Service as systemd service
# This script sets up the fingerprint controller to run automatically

echo "Installing Fingerprint Service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use sudo)"
    exit 1
fi

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Project directory: $PROJECT_DIR"

# Create systemd service file
cat > /etc/systemd/system/fingerprint-controller.service << EOF
[Unit]
Description=Smart Door Lock Fingerprint Controller
After=network.target
Wants=network.target

[Service]
Type=simple
User=pi
Group=pi
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/python3 $SCRIPT_DIR/fingerprint_service.py
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment variables
Environment=PYTHONPATH=$PROJECT_DIR

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
chmod 644 /etc/systemd/system/fingerprint-controller.service

# Create log directory
mkdir -p /var/log
touch /var/log/fingerprint_service.log
chown pi:pi /var/log/fingerprint_service.log

# Install required Python packages
echo "Installing required Python packages..."
pip3 install pyserial requests

# Add user to dialout group for USB access
usermod -a -G dialout pi

# Reload systemd and enable service
systemctl daemon-reload
systemctl enable fingerprint-controller.service

echo "Fingerprint service installed successfully!"
echo ""
echo "To start the service:"
echo "  sudo systemctl start fingerprint-controller"
echo ""
echo "To check service status:"
echo "  sudo systemctl status fingerprint-controller"
echo ""
echo "To view logs:"
echo "  sudo journalctl -u fingerprint-controller -f"
echo ""
echo "To stop the service:"
echo "  sudo systemctl stop fingerprint-controller"
echo ""
echo "The service will automatically start on boot."
