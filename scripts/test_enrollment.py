#!/usr/bin/env python3
"""
Test script for fingerprint enrollment
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fingerprint_controller import enroll_fingerprint_standalone, AS608FingerprintSensor

def test_sensor_connection():
    """Test basic sensor connection"""
    print("🔍 Testing sensor connection...")
    
    ports = ['/dev/ttyUSB0', '/dev/ttyUSB1', '/dev/ttyACM0', '/dev/ttyACM1']
    
    for port in ports:
        try:
            print(f"   Trying {port}...")
            sensor = AS608FingerprintSensor(port=port)
            if sensor.serial and sensor.serial.is_open:
                print(f"   ✅ Connected on {port}")
                
                # Test basic functions
                if sensor.verify_password():
                    print(f"   ✅ Password verification successful")
                else:
                    print(f"   ❌ Password verification failed")
                
                count = sensor.get_template_count()
                print(f"   📊 Templates stored: {count}")
                
                sensor.cleanup()
                return True
            else:
                sensor.cleanup()
        except Exception as e:
            print(f"   ❌ Failed: {e}")
    
    print("❌ No sensor found")
    return False

def test_enrollment():
    """Test standalone enrollment"""
    print("\n🔐 Testing standalone enrollment...")
    
    # Test enrollment without monitoring functions
    success, message = enroll_fingerprint_standalone(
        username="test_user",
        location=1,
        pause_monitoring_func=None,
        resume_monitoring_func=None
    )
    
    if success:
        print(f"✅ Enrollment test successful: {message}")
        return True
    else:
        print(f"❌ Enrollment test failed: {message}")
        return False

def main():
    print("🧪 Fingerprint System Test")
    print("=" * 40)
    
    # Test 1: Sensor connection
    if not test_sensor_connection():
        print("\n❌ Sensor connection test failed - cannot continue")
        return
    
    # Test 2: Enrollment
    print("\n" + "=" * 40)
    response = input("Do you want to test enrollment? (y/N): ").lower().strip()
    
    if response == 'y':
        test_enrollment()
    else:
        print("⏭️  Skipping enrollment test")
    
    print("\n✅ Test completed!")

if __name__ == "__main__":
    main()
