#!/usr/bin/env python3
import os
import sys

def test_basic_audio():
    """Test basic audio without complex libraries"""
    print("🎤 Basic Audio Test")
    print("=" * 20)
    
    # Test if we can access audio devices
    if os.path.exists("/dev/snd/"):
        devices = os.listdir("/dev/snd/")
        print(f"✅ Found audio devices: {devices}")
    else:
        print("❌ No audio devices found")
        return False
    
    # Try to record with arecord
    print("\n🎧 Testing microphone with arecord...")
    print("Say something for 3 seconds...")
    
    cmd = "arecord -f S16_LE -r 16000 -d 3 /tmp/mic_test.wav"
    result = os.system(cmd)
    
    if result == 0:
        print("✅ Recording successful!")
        
        # Play it back
        print("🔊 Playing back your recording...")
        play_result = os.system("aplay /tmp/mic_test.wav")
        
        if play_result == 0:
            print("✅ Playback successful!")
        else:
            print("⚠️  Playback had issues")
        
        # Clean up
        os.system("rm -f /tmp/mic_test.wav")
        return True
    else:
        print("❌ Recording failed")
        return False

if __name__ == "__main__":
    test_basic_audio()
