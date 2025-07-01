# Smart Door Lock - Setup Guide

## Quick Start

### 1. Hardware Setup

**Keypad Wiring:**
\`\`\`
Keypad → Raspberry Pi GPIO
Row 1  → GPIO 5
Row 2  → GPIO 6
Row 3  → GPIO 13
Row 4  → GPIO 19
Col 1  → GPIO 12
Col 2  → GPIO 16
Col 3  → GPIO 20
Col 4  → GPIO 21
\`\`\`

**Door Lock Relay:**
\`\`\`
Relay → GPIO 18
\`\`\`

### 2. Software Installation

\`\`\`bash
# Install dependencies
pip install flask RPi.GPIO requests pillow

# Run web app
python3 app.py

# Run keypad controller (separate terminal)
sudo python3 scripts/keypad_controller.py
\`\`\`

### 3. First Login

- Open browser: `http://your-pi-ip:5000`
- Login: `admin` / `admin123`
- Change default password immediately

### 4. Test Keypad

- Default passcode: `1234`
- Press keys: `1` `2` `3` `4` `A`
- Door should unlock for 5 seconds

## Keypad Functions

- **0-9**: Enter digits
- **A**: Submit passcode  
- **B**: Backspace
- **C**: Clear input
- **D**: Doorbell (future)
- **\* & #**: No function

## Default Settings

- **System Passcode**: 1234
- **Lockout Override**: 9999
- **Max Failed Attempts**: 3
- **Lockout Duration**: 5 minutes
- **Auto-lock Delay**: 5 seconds

## Troubleshooting

**Keypad not detecting:**
1. Check wiring connections
2. Run with `sudo`
3. Verify GPIO pins not in use

**Web interface not accessible:**
1. Check Flask is running
2. Verify IP address and port 5000
3. Check firewall settings

**Door not unlocking:**
1. Check relay wiring to GPIO 18
2. Verify relay power supply
3. Test relay manually

## Security Setup

1. **Change default passwords**
2. **Update system passcode**
3. **Set strong lockout override code**
4. **Review user permissions**
5. **Enable HTTPS for production**

For detailed troubleshooting, see README.md
