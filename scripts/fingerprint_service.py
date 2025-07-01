#!/usr/bin/env python3
"""
Fingerprint Service - Auto-start fingerprint monitoring as a system service
"""

import os
import sys
import time
import signal
import logging
from pathlib import Path

# Add the parent directory to the path so we can import the fingerprint controller
sys.path.append(str(Path(__file__).parent))

from fingerprint_controller import FingerprintController

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/fingerprint_service.log'),
        logging.StreamHandler()
    ]
)

class FingerprintService:
    def __init__(self):
        self.controller = None
        self.running = False
        
    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logging.info(f"Received signal {signum}, shutting down...")
        self.stop()
    
    def start(self):
        """Start the fingerprint service"""
        logging.info("Starting Fingerprint Service...")
        
        # Set up signal handlers
        signal.signal(signal.SIGTERM, self.signal_handler)
        signal.signal(signal.SIGINT, self.signal_handler)
        
        # Initialize controller
        self.controller = FingerprintController()
        
        if not self.controller.sensor:
            logging.error("Failed to initialize fingerprint sensor")
            return False
        
        logging.info("Fingerprint sensor initialized successfully")
        self.running = True
        
        try:
            # Run continuous monitoring
            self.controller.run_continuous_monitoring()
        except Exception as e:
            logging.error(f"Error in fingerprint service: {e}")
        finally:
            self.stop()
        
        return True
    
    def stop(self):
        """Stop the fingerprint service"""
        if self.running:
            logging.info("Stopping Fingerprint Service...")
            self.running = False
            
            if self.controller:
                self.controller.stop()
                self.controller.cleanup()
            
            logging.info("Fingerprint Service stopped")

def main():
    """Main function"""
    service = FingerprintService()
    
    try:
        service.start()
    except Exception as e:
        logging.error(f"Failed to start fingerprint service: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
