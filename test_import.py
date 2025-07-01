#!/usr/bin/env python3
"""
Test script to check imports and basic functionality
"""

import sys
import os

print("🧪 Testing Smart Door Lock imports...")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")

# Test basic imports
try:
    import flask
    print("✓ Flask imported successfully")
except ImportError as e:
    print(f"✗ Flask import failed: {e}")

try:
    import json
    print("✓ JSON imported successfully")
except ImportError as e:
    print(f"✗ JSON import failed: {e}")

try:
    import serial
    print("✓ PySerial imported successfully")
except ImportError as e:
    print(f"✗ PySerial import failed: {e}")
    print("  Install with: pip install pyserial")

# Test fingerprint controller import
try:
    from scripts.fingerprint_controller import AS608FingerprintController
    print("✓ Fingerprint controller imported successfully")
    
    # Test basic initialization (without hardware)
    try:
        controller = AS608FingerprintController(port='/dev/null')  # Use null device for testing
        print("✓ Fingerprint controller can be instantiated")
    except Exception as e:
        print(f"⚠ Fingerprint controller instantiation failed: {e}")
        
except ImportError as e:
    print(f"✗ Fingerprint controller import failed: {e}")
except Exception as e:
    print(f"✗ Fingerprint controller error: {e}")

# Check if scripts directory exists
if os.path.exists('scripts'):
    print("✓ Scripts directory exists")
    scripts_files = os.listdir('scripts')
    print(f"  Files: {scripts_files}")
else:
    print("✗ Scripts directory not found")

# Check if templates directory exists
if os.path.exists('templates'):
    print("✓ Templates directory exists")
else:
    print("✗ Templates directory not found")

# Check if static directory exists
if os.path.exists('static'):
    print("✓ Static directory exists")
else:
    print("✗ Static directory not found")

print("\n🏁 Import test complete!")
