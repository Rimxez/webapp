#!/usr/bin/env python3
"""
Simple keypad test - minimal code to test basic functionality
"""

import RPi.GPIO as GPIO
import time

# CHANGE THESE PINS TO MATCH YOUR WIRING
ROWS = [5, 6, 13, 19]     # Connect to keypad pins 1,2,3,4
COLS = [12, 16, 20, 21]   # Connect to keypad pins 5,6,7,8

KEYS = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D']
]

def setup():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    
    # Rows as outputs (HIGH)
    for pin in ROWS:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, GPIO.HIGH)
    
    # Columns as inputs with pull-up
    for pin in COLS:
        GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def scan_keypad():
    for row_num, row_pin in enumerate(ROWS):
        # Set current row LOW
        GPIO.output(row_pin, GPIO.LOW)
        time.sleep(0.001)
        
        # Check columns
        for col_num, col_pin in enumerate(COLS):
            if GPIO.input(col_pin) == GPIO.LOW:
                key = KEYS[row_num][col_num]
                GPIO.output(row_pin, GPIO.HIGH)  # Reset row
                return key
        
        # Reset row
        GPIO.output(row_pin, GPIO.HIGH)
    
    return None

def main():
    print("Simple Keypad Test")
    print("Press keys on your 4x4 keypad")
    print("Ctrl+C to exit")
    
    setup()
    
    try:
        while True:
            key = scan_keypad()
            if key:
                print(f"Key pressed: {key}")
                # Wait for key release
                while scan_keypad() == key:
                    time.sleep(0.01)
                print(f"Key {key} released")
            
            time.sleep(0.01)
            
    except KeyboardInterrupt:
        print("\nExiting...")
    finally:
        GPIO.cleanup()

if __name__ == "__main__":
    main()
