#!/usr/bin/env python3
"""
Quick test script to verify AS608 sensor connectivity
"""

import sys
import time
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent))

try:
    from fingerprint_controller import AS608FingerprintSensor
except ImportError as e:
    print(f"❌ Error importing fingerprint controller: {e}")
    sys.exit(1)

def test_sensor_connection():
    """Test basic sensor connectivity"""
    print("🔐 AS608 Fingerprint Sensor Test")
    print("=" * 40)
    
    # Try to connect to sensor
    sensor = None
    ports = ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyACM0', '/dev/ttyACM1']
    
    print("🔍 Searching for AS608 sensor...")
    
    for port in ports:
        try:
            print(f"   Trying {port}...")
            sensor = AS608FingerprintSensor(port=port)
            if sensor.serial and sensor.serial.is_open:
                print(f"✅ Connected to AS608 sensor on {port}")
                break
        except Exception as e:
            print(f"   ❌ Failed on {port}: {e}")
            continue
    
    if not sensor or not sensor.serial:
        print("\n❌ Could not connect to AS608 sensor")
        print("\n🔧 Troubleshooting:")
        print("   1. Check USB connection")
        print("   2. Verify sensor power (red LED should be on)")
        print("   3. Check USB permissions:")
        print("      sudo usermod -a -G dialout $USER")
        print("   4. Try different USB port")
        return False
    
    # Test basic functions
    print("\n🧪 Testing sensor functions...")
    
    # Test template count
    try:
        count = sensor.get_template_count()
        if count >= 0:
            print(f"✅ Template count: {count}")
        else:
            print("❌ Failed to get template count")
    except Exception as e:
        print(f"❌ Template count error: {e}")
    
    # Test finger detection
    print("\n👆 Testing finger detection...")
    print("Place finger on sensor for 3 seconds...")
    
    detected_count = 0
    for i in range(30):  # Test for 3 seconds
        try:
            if sensor.has_finger():
                detected_count += 1
                print("🟢", end="", flush=True)
            else:
                print("⚪", end="", flush=True)
        except Exception as e:
            print("❌", end="", flush=True)
        
        time.sleep(0.1)
    
    print(f"\n📊 Detection results: {detected_count}/30 scans detected finger")
    
    if detected_count > 0:
        print("✅ Finger detection working!")
    else:
        print("❌ No finger detected - check sensor placement")
    
    # Cleanup
    sensor.cleanup()
    print("\n✅ Sensor test completed")
    return True

if __name__ == "__main__":
    test_sensor_connection()
