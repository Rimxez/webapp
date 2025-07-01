#!/usr/bin/env python3
"""
Keypad Service Installer for Smart Door Lock System
This script installs the keypad controller as a systemd service
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

class KeypadInstaller:
    def __init__(self):
        self.script_dir = Path(__file__).parent
        self.project_dir = self.script_dir.parent
        self.service_name = "smart-door-keypad"
        self.service_file = f"/etc/systemd/system/{self.service_name}.service"
        self.keypad_script = self.script_dir / "keypad_controller.py"
        
    def check_requirements(self):
        """Check if all requirements are met"""
        print("Checking requirements...")
        
        # Check if running as root
        if os.geteuid() != 0:
            print("❌ This script must be run as root (use sudo)")
            return False
        
        # Check if keypad script exists
        if not self.keypad_script.exists():
            print(f"❌ Keypad script not found: {self.keypad_script}")
            return False
        
        # Check if RPi.GPIO is available
        try:
            import RPi.GPIO
            print("✓ RPi.GPIO is available")
        except ImportError:
            print("❌ RPi.GPIO not found. Install with: pip3 install RPi.GPIO")
            return False
        
        # Check if requests is available
        try:
            import requests
            print("✓ requests library is available")
        except ImportError:
            print("❌ requests library not found. Install with: pip3 install requests")
            return False
        
        print("✓ All requirements met")
        return True
    
    def create_service_file(self):
        """Create systemd service file"""
        print(f"Creating service file: {self.service_file}")
        
        service_content = f"""[Unit]
Description=Smart Door Lock Keypad Controller
After=network.target
Wants=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory={self.project_dir}
ExecStart=/usr/bin/python3 {self.keypad_script}
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Environment variables
Environment=PYTHONPATH={self.project_dir}
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
"""
        
        try:
            with open(self.service_file, 'w') as f:
                f.write(service_content)
            
            # Set proper permissions
            os.chmod(self.service_file, 0o644)
            print(f"✓ Service file created: {self.service_file}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating service file: {e}")
            return False
    
    def install_service(self):
        """Install and enable the systemd service"""
        print("Installing systemd service...")
        
        try:
            # Reload systemd daemon
            subprocess.run(['systemctl', 'daemon-reload'], check=True)
            print("✓ Systemd daemon reloaded")
            
            # Enable the service
            subprocess.run(['systemctl', 'enable', self.service_name], check=True)
            print(f"✓ Service {self.service_name} enabled")
            
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error installing service: {e}")
            return False
    
    def start_service(self):
        """Start the keypad service"""
        print("Starting keypad service...")
        
        try:
            subprocess.run(['systemctl', 'start', self.service_name], check=True)
            print(f"✓ Service {self.service_name} started")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error starting service: {e}")
            return False
    
    def stop_service(self):
        """Stop the keypad service"""
        print("Stopping keypad service...")
        
        try:
            subprocess.run(['systemctl', 'stop', self.service_name], check=True)
            print(f"✓ Service {self.service_name} stopped")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error stopping service: {e}")
            return False
    
    def uninstall_service(self):
        """Uninstall the systemd service"""
        print("Uninstalling keypad service...")
        
        try:
            # Stop the service
            subprocess.run(['systemctl', 'stop', self.service_name], check=False)
            
            # Disable the service
            subprocess.run(['systemctl', 'disable', self.service_name], check=False)
            
            # Remove service file
            if os.path.exists(self.service_file):
                os.remove(self.service_file)
                print(f"✓ Service file removed: {self.service_file}")
            
            # Reload systemd daemon
            subprocess.run(['systemctl', 'daemon-reload'], check=True)
            print("✓ Systemd daemon reloaded")
            
            print(f"✓ Service {self.service_name} uninstalled")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error uninstalling service: {e}")
            return False
    
    def get_service_status(self):
        """Get the status of the keypad service"""
        try:
            result = subprocess.run(['systemctl', 'is-active', self.service_name], 
                                  capture_output=True, text=True)
            status = result.stdout.strip()
            
            result2 = subprocess.run(['systemctl', 'is-enabled', self.service_name], 
                                   capture_output=True, text=True)
            enabled = result2.stdout.strip()
            
            print(f"Service status: {status}")
            print(f"Service enabled: {enabled}")
            
            return status, enabled
            
        except Exception as e:
            print(f"❌ Error getting service status: {e}")
            return "unknown", "unknown"
    
    def show_logs(self, lines=50):
        """Show service logs"""
        print(f"Showing last {lines} lines of service logs:")
        print("-" * 50)
        
        try:
            subprocess.run(['journalctl', '-u', self.service_name, '-n', str(lines), '--no-pager'])
        except Exception as e:
            print(f"❌ Error showing logs: {e}")
    
    def interactive_menu(self):
        """Interactive installation menu"""
        while True:
            print("\n" + "="*50)
            print("KEYPAD SERVICE INSTALLER")
            print("="*50)
            print("1. Install keypad service")
            print("2. Start service")
            print("3. Stop service")
            print("4. Restart service")
            print("5. Check service status")
            print("6. Show service logs")
            print("7. Uninstall service")
            print("8. Test keypad (without service)")
            print("9. Exit")
            
            choice = input("\nSelect option (1-9): ").strip()
            
            if choice == '1':
                self.install_keypad_service()
            elif choice == '2':
                self.start_service()
            elif choice == '3':
                self.stop_service()
            elif choice == '4':
                self.restart_service()
            elif choice == '5':
                self.get_service_status()
            elif choice == '6':
                lines = input("Number of log lines to show (default 50): ").strip()
                lines = int(lines) if lines.isdigit() else 50
                self.show_logs(lines)
            elif choice == '7':
                confirm = input("Are you sure you want to uninstall the service? (y/N): ")
                if confirm.lower() == 'y':
                    self.uninstall_service()
            elif choice == '8':
                self.test_keypad()
            elif choice == '9':
                break
            else:
                print("Invalid option. Please try again.")
    
    def install_keypad_service(self):
        """Complete installation process"""
        print("Installing keypad service...")
        
        if not self.check_requirements():
            return False
        
        if not self.create_service_file():
            return False
        
        if not self.install_service():
            return False
        
        print("\n✓ Keypad service installed successfully!")
        print(f"To start the service: sudo systemctl start {self.service_name}")
        print(f"To check status: sudo systemctl status {self.service_name}")
        print(f"To view logs: sudo journalctl -u {self.service_name} -f")
        
        start_now = input("\nStart the service now? (Y/n): ").strip().lower()
        if start_now != 'n':
            self.start_service()
        
        return True
    
    def restart_service(self):
        """Restart the keypad service"""
        print("Restarting keypad service...")
        
        try:
            subprocess.run(['systemctl', 'restart', self.service_name], check=True)
            print(f"✓ Service {self.service_name} restarted")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Error restarting service: {e}")
            return False
    
    def test_keypad(self):
        """Test keypad without service"""
        print("Testing keypad (make sure service is stopped first)...")
        
        # Stop service if running
        subprocess.run(['systemctl', 'stop', self.service_name], check=False)
        
        try:
            # Run the test script
            test_script = self.script_dir / "test_keypad.py"
            if test_script.exists():
                subprocess.run([sys.executable, str(test_script), '--scan'])
            else:
                print(f"❌ Test script not found: {test_script}")
        except KeyboardInterrupt:
            print("\n✓ Keypad test completed")
        except Exception as e:
            print(f"❌ Error running keypad test: {e}")

def main():
    """Main function"""
    print("Smart Door Lock - Keypad Service Installer")
    print("=" * 50)
    
    if len(sys.argv) > 1:
        installer = KeypadInstaller()
        
        if sys.argv[1] == 'install':
            installer.install_keypad_service()
        elif sys.argv[1] == 'uninstall':
            installer.uninstall_service()
        elif sys.argv[1] == 'start':
            installer.start_service()
        elif sys.argv[1] == 'stop':
            installer.stop_service()
        elif sys.argv[1] == 'restart':
            installer.restart_service()
        elif sys.argv[1] == 'status':
            installer.get_service_status()
        elif sys.argv[1] == 'logs':
            lines = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 50
            installer.show_logs(lines)
        else:
            print("Usage:")
            print("  sudo python3 keypad_installer.py install")
            print("  sudo python3 keypad_installer.py uninstall")
            print("  sudo python3 keypad_installer.py start")
            print("  sudo python3 keypad_installer.py stop")
            print("  sudo python3 keypad_installer.py restart")
            print("  sudo python3 keypad_installer.py status")
            print("  sudo python3 keypad_installer.py logs [lines]")
    else:
        # Interactive mode
        installer = KeypadInstaller()
        installer.interactive_menu()

if __name__ == "__main__":
    main()
