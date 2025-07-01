# Smart Door Lock System

A comprehensive smart door lock system with web interface, keypad control, and camera integration for Raspberry Pi.

## Features

- **Web Interface**: Complete dashboard for managing users, settings, and monitoring
- **4x4 Matrix Keypad**: Physical keypad for passcode entry
- **Camera Integration**: Live streaming and photo capture
- **User Management**: Multiple user roles with different permissions
- **Security Features**: Failed attempt lockout, auto-lock timer
- **Real-time Logging**: Complete audit trail of all activities

## Hardware Requirements

- Raspberry Pi (any model with GPIO pins)
- 4x4 Matrix Keypad
- Relay module for door lock control
- Camera module (optional)
- Jumper wires and breadboard

## Installation

1. **Clone the repository**:
   \`\`\`bash
   git clone <repository-url>
   cd smart-door-lock
   \`\`\`

2. **Install dependencies**:
   \`\`\`bash
   pip install flask RPi.GPIO requests pillow
   \`\`\`

3. **Wire the hardware**:
   - Connect keypad to GPIO pins: Rows [5,6,13,19], Columns [12,16,20,21]
   - Connect relay to GPIO 18 for door control
   - Connect camera module if using

4. **Run the web application**:
   \`\`\`bash
   python3 app.py
   \`\`\`

5. **Run the keypad controller** (in separate terminal):
   \`\`\`bash
   sudo python3 scripts/keypad_controller.py
   \`\`\`

## Usage

### Web Interface
- Access at `http://raspberry-pi-ip:5000`
- Default admin login: `admin` / `admin123`
- Manage users, view logs, change settings

### Keypad Controls
- **0-9**: Enter passcode digits
- **A**: Submit passcode
- **B**: Backspace
- **C**: Clear input
- **D**: Doorbell (future feature)
- **Default passcode**: 1234

### Security Features
- 3 failed attempts = 5 minute lockout
- Lockout override code: 9999
- Auto-lock after 5 seconds (configurable)

## Configuration

Edit `settings.json` to customize:
- System passcode
- Auto-lock delay
- Maximum failed attempts
- Lockout duration
- GPIO pin assignments

## API Endpoints

The system provides REST API endpoints for integration:
- `GET /api/door/status` - Get door lock status
- `POST /api/door/toggle` - Lock/unlock door
- `GET /api/settings` - Get system settings
- `POST /api/settings/update` - Update settings
- `GET /api/logs` - Get activity logs

## File Structure

\`\`\`
smart-door-lock/
├── app.py                 # Main Flask application
├── scripts/
│   ├── keypad_controller.py   # Keypad controller
│   └── camera_controller.py   # Camera controller
├── templates/             # HTML templates
├── static/               # CSS, JS, images
├── settings.json         # System settings
├── users.json           # User database
└── logs.json            # Activity logs
\`\`\`

## Troubleshooting

### Keypad Not Working
1. Check GPIO pin connections
2. Verify keypad wiring with multimeter
3. Run keypad controller with sudo privileges
4. Check for GPIO pin conflicts

### Camera Issues
1. Enable camera in raspi-config
2. Check camera module connection
3. Verify libcamera installation

### Web Interface Issues
1. Check Flask is running on port 5000
2. Verify network connectivity
3. Check firewall settings

## Security Notes

- Change default passwords immediately
- Use strong passcodes
- Regularly review access logs
- Keep system updated
- Use HTTPS in production

## License

This project is open source. See LICENSE file for details.
