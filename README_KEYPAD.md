# Smart Door Lock - Keypad Integration Guide

This guide explains how to set up and use the 4x4 matrix keypad with your Smart Door Lock system.

## Hardware Requirements

- Raspberry Pi (any model with GPIO pins)
- 4x4 Matrix Keypad
- Jumper wires (8 wires needed)
- Breadboard (optional)

## Keypad Wiring

### Default Pin Configuration

The keypad uses 8 GPIO pins total:
- 4 pins for rows (outputs)
- 4 pins for columns (inputs)

**Default GPIO Pin Assignment:**
\`\`\`
Rows (Outputs):    [5, 6, 13, 19]
Columns (Inputs):  [12, 16, 20, 21]
\`\`\`

### Physical Wiring

Connect your 4x4 keypad to the Raspberry Pi as follows:

\`\`\`
Keypad Pin → Raspberry Pi GPIO
Row 1      → GPIO 5
Row 2      → GPIO 6
Row 3      → GPIO 13
Row 4      → GPIO 19
Col 1      → GPIO 12
Col 2      → GPIO 16
Col 3      → GPIO 20
Col 4      → GPIO 21
\`\`\`

### Keypad Layout

The standard 4x4 keypad layout is:
\`\`\`
[1] [2] [3] [A]
[4] [5] [6] [B]
[7] [8] [9] [C]
[*] [0] [#] [D]
\`\`\`

## Key Functions

Each key has a specific function in the door lock system:

- **0-9**: Enter passcode digits
- **A**: Submit/Enter passcode
- **B**: Backspace (delete last digit)
- **C**: Clear entire input
- **D**: Doorbell for AI interaction (to be added later)
- **\***: No function assigned
- **#**: No function assigned

## Installation Steps

### 1. Test Your Keypad Wiring

First, test your keypad to ensure it's wired correctly:

\`\`\`bash
# Run the keypad test script
sudo python3 scripts/test_keypad.py

# Or run a quick scan test
sudo python3 scripts/test_keypad.py --scan
\`\`\`

The test script will help you:
- Verify GPIO pin configuration
- Test individual pins
- Test keypad matrix scanning
- Check continuity for each key

### 2. Configure Keypad Settings

If you need to change the GPIO pins, you can:

1. **Via Web Interface:**
   - Log in as admin
   - Go to Settings
   - Update keypad configuration

2. **Via Test Script:**
   - Run `sudo python3 scripts/test_keypad.py`
   - Choose option 5 to change pin configuration

3. **Manually edit settings:**
   \`\`\`bash
   # Edit the settings file
   nano settings.json
   \`\`\`

### 3. Install Keypad Service

Install the keypad controller as a system service:

\`\`\`bash
# Run the installer
sudo python3 scripts/keypad_installer.py

# Or use command line options
sudo python3 scripts/keypad_installer.py install
\`\`\`

The installer will:
- Check requirements
- Create systemd service file
- Enable and start the service
- Configure automatic startup

### 4. Verify Installation

Check that the keypad service is running:

\`\`\`bash
# Check service status
sudo systemctl status smart-door-keypad

# View service logs
sudo journalctl -u smart-door-keypad -f

# Or use the installer
sudo python3 scripts/keypad_installer.py status
\`\`\`

## Usage

### Basic Operation

1. **Enter Passcode:**
   - Type your passcode using number keys (0-9)
   - Press **A** to submit
   - Door will unlock if passcode is correct

2. **Correct Mistakes:**
   - Press **B** to delete the last digit
   - Press **C** to clear entire input

### Security Features

- **Failed Attempt Lockout:** After 3 failed attempts, system locks out for 5 minutes
- **Lockout Override:** Use the lockout passcode to override
