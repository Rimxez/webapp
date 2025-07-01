#!/usr/bin/env python3
"""
Real Fingerprint Controller for Smart Door Lock
Optimized for CP210x USB-to-UART Bridge (Silicon Labs)
"""

import time
import hashlib
import json
import os
import threading
from datetime import datetime
from pyfingerprint.pyfingerprint import PyFingerprint

class FingerprintController:
    def __init__(self, port='/dev/ttyUSB0', baudrate=57600):
        try:
            self.sensor = PyFingerprint(port, baudrate, 0xFFFFFFFF, 0x00000000)
            if not self.sensor.verifyPassword():
                raise Exception("Fingerprint sensor password incorrect")
            self.available = True
        except Exception as e:
            print("❌ Sensor init failed:", e)
            self.sensor = None
            self.available = False

    def enroll_fingerprint(self, username):
        print("🌀 Place your finger...")
        while not self.sensor.readImage():
            time.sleep(0.5)

        self.sensor.convertImage(0x01)
        result = self.sensor.searchTemplate()
        pos = result[0]

        if pos >= 0:
            return {'success': False, 'message': 'Fingerprint already exists'}

        print("✅ Remove finger")
        time.sleep(2)

        print("🌀 Place same finger again...")
        while not self.sensor.readImage():
            time.sleep(0.5)

        self.sensor.convertImage(0x02)

        if self.sensor.compareCharacteristics() == 0:
            return {'success': False, 'message': 'Fingerprints did not match'}

        self.sensor.createTemplate()
        slot_id = self.sensor.storeTemplate()

        return {'success': True, 'slot_id': slot_id}
        
        
    def authenticate_fingerprint(self, users_data, timeout=10):
        print("🔍 Waiting for finger...")
        start = time.time()
    
        while time.time() - start < timeout:
            if self.sensor.readImage():
                self.sensor.convertImage(0x01)
                result = self.sensor.searchTemplate()
                position_number = result[0]
                accuracy_score = result[1]
    
                if position_number == -1:
                    return {'success': False, 'message': 'No match found'}
                
                # Optionally get stored characteristics:
                self.sensor.loadTemplate(position_number, 0x01)
                characteristics = self.sensor.downloadCharacteristics(0x01)
    
                # Find username from slot
                matched_user = None
                for username, user in users_data.items():
                    if user.get('fingerprint_slot_id') == position_number:
                        matched_user = username
                        break
    
                return {
                    'success': True,
                    'message': 'Fingerprint matched',
                    'username': matched_user,
                    'confidence': accuracy_score
                }
    
            time.sleep(0.5)
    
        return {'success': False, 'message': 'Timeout waiting for finger'}


if __name__ == "__main__":
    main()
