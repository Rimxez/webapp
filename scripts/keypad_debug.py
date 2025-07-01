#!/usr/bin/env python3
"""
Debug script for 4x4 matrix keypad
This will help identify wiring and configuration issues
"""

import RPi.GPIO as GPIO
import time
import sys
import os

class KeypadDebugger:
    def __init__(self):
        # Default pin configuration - CHANGE THESE TO MATCH YOUR WIRING
        self.ROWS = [5, 6, 13, 19]    # GPIO pins connected to keypad rows
        self.COLS = [12, 16, 20, 21]  # GPIO pins connected to keypad columns
        
        # Standard 4x4 keypad layout
        self.KEYS = [
            ['1', '2', '3', 'A'],
            ['4', '5', '6', 'B'], 
            ['7', '8', '9', 'C'],
            ['*', '0', '#', 'D']
        ]
        
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        
        print("4x4 Keypad Debugger")
        print("=" * 40)
        print(f"Row pins: {self.ROWS}")
        print(f"Col pins: {self.COLS}")
        print("\nExpected keypad layout:")
        for i, row in enumerate(self.KEYS):
            print(f"Row {i+1}: {' '.join(row)}")
    
    def test_1_individual_pins(self):
        """Test 1: Check if we can control individual GPIO pins"""
        print("\n" + "="*50)
        print("TEST 1: Individual GPIO Pin Test")
        print("="*50)
        
        all_pins = self.ROWS + self.COLS
        
        for pin in all_pins:
            try:
                print(f"Testing GPIO pin {pin}...")
                
                # Test as output
                GPIO.setup(pin, GPIO.OUT)
                GPIO.output(pin, GPIO.HIGH)
                time.sleep(0.1)
                GPIO.output(pin, GPIO.LOW)
                time.sleep(0.1)
                print(f"  Pin {pin} as OUTPUT: OK")
                
                # Test as input
                GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
                state = GPIO.input(pin)
                print(f"  Pin {pin} as INPUT: {'HIGH' if state else 'LOW'}")
                
            except Exception as e:
                print(f"  Pin {pin}: ERROR - {e}")
        
        print("Individual pin test complete")
    
    def test_2_pin_availability(self):
        """Test 2: Check if pins are available (not used by other processes)"""
        print("\n" + "="*50)
        print("TEST 2: Pin Availability Check")
        print("="*50)
        
        # Try to export pins (this will fail if already in use)
        all_pins = self.ROWS + self.COLS
        
        for pin in all_pins:
            try:
                # Try to setup pin
                GPIO.setup(pin, GPIO.OUT)
                GPIO.output(pin, GPIO.HIGH)
                print(f"Pin {pin}: Available")
            except Exception as e:
                print(f"Pin {pin}: NOT AVAILABLE - {e}")
    
    def test_3_basic_matrix_scan(self):
        """Test 3: Basic matrix scanning without keypad library"""
        print("\n" + "="*50)
        print("TEST 3: Basic Matrix Scanning")
        print("="*50)
        print("Setting up matrix scanning...")
        
        try:
            # Setup row pins as outputs (HIGH)
            for pin in self.ROWS:
                GPIO.setup(pin, GPIO.OUT)
                GPIO.output(pin, GPIO.HIGH)
                print(f"Row pin {pin}: OUTPUT (HIGH)")
            
            # Setup column pins as inputs with pull-up
            for pin in self.COLS:
                GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
                state = GPIO.input(pin)
                print(f"Col pin {pin}: INPUT ({'HIGH' if state else 'LOW'})")
            
            print("\nAll columns should be HIGH when no keys pressed")
            print("Press and hold a key on your keypad, then press Enter here...")
            input("Press Enter when ready...")
            
            # Check column states
            print("Checking column states:")
            for i, pin in enumerate(self.COLS):
                state = GPIO.input(pin)
                print(f"Col {i+1} (pin {pin}): {'HIGH' if state else 'LOW'}")
            
            print("\nStarting matrix scan test...")
            print("Press keys on your keypad (Ctrl+C to stop)")
            
            scan_count = 0
            while True:
                key_found = False
                
                for row_num, row_pin in enumerate(self.ROWS):
                    # Set all rows HIGH
                    for r_pin in self.ROWS:
                        GPIO.output(r_pin, GPIO.HIGH)
                    
                    # Set current row LOW
                    GPIO.output(row_pin, GPIO.LOW)
                    time.sleep(0.001)  # Stabilization delay
                    
                    # Check columns
                    for col_num, col_pin in enumerate(self.COLS):
                        if GPIO.input(col_pin) == GPIO.LOW:
                            key = self.KEYS[row_num][col_num]
                            print(f"KEY DETECTED: {key} (Row {row_num+1}, Col {col_num+1})")
                            key_found = True
                            
                            # Wait for key release
                            while GPIO.input(col_pin) == GPIO.LOW:
                                time.sleep(0.01)
                            print(f"Key {key} released")
                
                # Reset all rows HIGH
                for r_pin in self.ROWS:
                    GPIO.output(r_pin, GPIO.HIGH)
                
                scan_count += 1
                if scan_count % 1000 == 0:
                    print(f"Scanning... (scan #{scan_count})")
                
                time.sleep(0.01)
                
        except KeyboardInterrupt:
            print("\nMatrix scan test stopped")
        except Exception as e:
            print(f"Error in matrix scan: {e}")
    
    def test_4_pad4pi_test(self):
        """Test 4: Test with pad4pi library"""
        print("\n" + "="*50)
        print("TEST 4: pad4pi Library Test")
        print("="*50)
        
        try:
            from pad4pi import rpi_gpio
            print("pad4pi library imported successfully")
            
            # Create keypad
            factory = rpi_gpio.KeypadFactory()
            keypad = factory.create_keypad(
                keypad=self.KEYS,
                row_pins=self.ROWS,
                col_pins=self.COLS
            )
            
            def key_pressed(key):
                print(f"pad4pi detected key: {key}")
            
            keypad.registerKeyPressHandler(key_pressed)
            
            print("pad4pi keypad created successfully")
            print("Press keys on your keypad (Ctrl+C to stop)")
            
            try:
                while True:
                    time.sleep(0.1)
            except KeyboardInterrupt:
                print("\npad4pi test stopped")
            finally:
                keypad.cleanup()
                
        except ImportError:
            print("pad4pi library not installed")
            print("Install with: pip3 install pad4pi")
        except Exception as e:
            print(f"pad4pi test error: {e}")
    
    def test_5_wiring_helper(self):
        """Test 5: Interactive wiring verification"""
        print("\n" + "="*50)
        print("TEST 5: Interactive Wiring Verification")
        print("="*50)
        print("This test will help verify your keypad wiring")
        print("\nStandard 4x4 keypad pinout (from left to right):")
        print("Pin 1: Row 1")
        print("Pin 2: Row 2") 
        print("Pin 3: Row 3")
        print("Pin 4: Row 4")
        print("Pin 5: Col 1")
        print("Pin 6: Col 2")
        print("Pin 7: Col 3")
        print("Pin 8: Col 4")
        
        print(f"\nYour current GPIO configuration:")
        print(f"Rows: {self.ROWS} (should connect to keypad pins 1,2,3,4)")
        print(f"Cols: {self.COLS} (should connect to keypad pins 5,6,7,8)")
        
        print("\nDo you want to test a different pin configuration? (y/n)")
        if input().lower() == 'y':
            try:
                print("Enter new row pins (4 numbers separated by spaces):")
                new_rows = [int(x) for x in input().split()]
                print("Enter new col pins (4 numbers separated by spaces):")
                new_cols = [int(x) for x in input().split()]
                
                if len(new_rows) == 4 and len(new_cols) == 4:
                    self.ROWS = new_rows
                    self.COLS = new_cols
                    print(f"Updated configuration:")
                    print(f"Rows: {self.ROWS}")
                    print(f"Cols: {self.COLS}")
                else:
                    print("Invalid input - need exactly 4 pins for rows and 4 for columns")
            except:
                print("Invalid input")
    
    def run_all_tests(self):
        """Run all diagnostic tests"""
        print("Running all keypad diagnostic tests...")
        
        try:
            self.test_1_individual_pins()
            self.test_2_pin_availability()
            self.test_5_wiring_helper()
            self.test_3_basic_matrix_scan()
            
        except KeyboardInterrupt:
            print("\nTests interrupted by user")
        except Exception as e:
            print(f"Test error: {e}")
        finally:
            GPIO.cleanup()
            print("GPIO cleanup complete")
    
    def interactive_menu(self):
        """Interactive test menu"""
        while True:
            print("\n" + "="*50)
            print("4x4 KEYPAD DIAGNOSTIC MENU")
            print("="*50)
            print("1. Test individual GPIO pins")
            print("2. Check pin availability")
            print("3. Basic matrix scanning test")
            print("4. Test pad4pi library")
            print("5. Wiring verification helper")
            print("6. Run all tests")
            print("7. Exit")
            
            choice = input("\nSelect test (1-7): ").strip()
            
            try:
                if choice == '1':
                    self.test_1_individual_pins()
                elif choice == '2':
                    self.test_2_pin_availability()
                elif choice == '3':
                    self.test_3_basic_matrix_scan()
                elif choice == '4':
                    self.test_4_pad4pi_test()
                elif choice == '5':
                    self.test_5_wiring_helper()
                elif choice == '6':
                    self.run_all_tests()
                elif choice == '7':
                    break
                else:
                    print("Invalid choice")
                    
            except KeyboardInterrupt:
                print("\nTest interrupted")
            except Exception as e:
                print(f"Test error: {e}")
            finally:
                GPIO.cleanup()

def main():
    print("4x4 Matrix Keypad Diagnostic Tool")
    print("=" * 40)
    
    if os.geteuid() != 0:
        print("ERROR: Must run as root (use sudo)")
        sys.exit(1)
    
    try:
        debugger = KeypadDebugger()
        
        if len(sys.argv) > 1:
            if sys.argv[1] == '--scan':
                debugger.test_3_basic_matrix_scan()
            elif sys.argv[1] == '--pins':
                debugger.test_1_individual_pins()
            elif sys.argv[1] == '--pad4pi':
                debugger.test_4_pad4pi_test()
            elif sys.argv[1] == '--all':
                debugger.run_all_tests()
            else:
                print("Usage: sudo python3 keypad_debug.py [--scan|--pins|--pad4pi|--all]")
        else:
            debugger.interactive_menu()
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        GPIO.cleanup()

if __name__ == "__main__":
    main()
