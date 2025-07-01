#!/usr/bin/env python3
import subprocess
import time
import json
import os
import wave
from datetime import datetime

class WorkingSpeechRecognition:
    def __init__(self):
        """Initialize working speech recognition"""
        print("🎤 Initializing Speech Recognition...")
        
        self.model_path = "/home/pi/vosk-models/vosk-model-small-en-us-0.15"
        self.conversation_log = []
        
        # Initialize Vosk
        try:
            import vosk
            self.vosk_model = vosk.Model(self.model_path)
            self.vosk_rec = vosk.KaldiRecognizer(self.vosk_model, 16000)
            print("✅ Vosk model loaded successfully!")
            self.has_vosk = True
        except Exception as e:
            print(f"❌ Vosk failed: {e}")
            self.has_vosk = False
        
        # Initialize Google Speech Recognition as backup
        try:
            import speech_recognition as sr
            self.sr = sr
            self.microphone = sr.Microphone()
            self.recognizer = sr.Recognizer()
            print("✅ Google Speech Recognition available!")
            self.has_google_sr = True
        except Exception as e:
            print(f"❌ Google SR failed: {e}")
            self.has_google_sr = False
        
        print("🎤 Speech Recognition ready!")
    
    def speak(self, text):
        """Speak text using espeak"""
        print(f"\n🤖 AI SAYS: {text}")
        print("-" * 50)
        
        # Log conversation
        self.conversation_log.append({
            'timestamp': datetime.now().strftime('%H:%M:%S'),
            'speaker': 'AI',
            'text': text
        })
        
        try:
            cmd = ['espeak', '-s', '140', '-a', '200', '-v', 'en+f3', text]
            subprocess.run(cmd, check=True)
            print("🔊 Audio played")
        except Exception as e:
            print(f"⚠️  Audio failed: {e}")
        
        time.sleep(1)
    
    def record_audio(self, duration=5):
        """Record audio using arecord"""
        filename = f"/tmp/recording_{int(time.time())}.wav"
        
        try:
            print(f"🎤 Recording for {duration} seconds...")
            print("🗣️  SPEAK NOW!")
            
            cmd = [
                'arecord',
                '-D', 'plughw:3,0',  # Your USB audio device
                '-f', 'S16_LE',
                '-r', '16000',
                '-c', '1',
                '-d', str(duration),
                filename
            ]
            
            result = subprocess.run(cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Recording completed")
                return filename
            else:
                print(f"❌ Recording failed: {result.stderr}")
                return None
                
        except Exception as e:
            print(f"❌ Recording error: {e}")
            return None
    
    def transcribe_with_vosk(self, audio_file):
        """Transcribe using Vosk offline"""
        if not self.has_vosk:
            return None
        
        try:
            import vosk
            
            wf = wave.open(audio_file, 'rb')
            
            results = []
            while True:
                data = wf.readframes(4000)
                if len(data) == 0:
                    break
                if self.vosk_rec.AcceptWaveform(data):
                    result = json.loads(self.vosk_rec.Result())
                    if result.get('text'):
                        results.append(result['text'])
            
            final_result = json.loads(self.vosk_rec.FinalResult())
            if final_result.get('text'):
                results.append(final_result['text'])
            
            text = ' '.join(results).strip()
            return text if text else None
            
        except Exception as e:
            print(f"⚠️  Vosk transcription failed: {e}")
            return None
    
    def transcribe_with_google(self, audio_file):
        """Transcribe using Google Speech Recognition"""
        if not self.has_google_sr:
            return None
        
        try:
            with self.sr.AudioFile(audio_file) as source:
                audio = self.recognizer.record(source)
            
            text = self.recognizer.recognize_google(audio)
            return text
            
        except Exception as e:
            print(f"⚠️  Google transcription failed: {e}")
            return None
    
    def listen_and_transcribe(self, prompt="", duration=5):
        """Listen and transcribe with multiple methods"""
        print(f"\n🎧 {prompt}")
        print("🎤 LISTENING... (speak clearly)")
        print("=" * 50)
        
        # Record audio
        audio_file = self.record_audio(duration)
        
        if not audio_file:
            return self.get_manual_input("Recording failed. Please type:")
        
        print("🔄 TRANSCRIBING...")
        
        # Try Vosk first (offline)
        text = self.transcribe_with_vosk(audio_file)
        
        if not text:
            # Try Google as backup
            text = self.transcribe_with_google(audio_file)
        
        # Clean up audio file
        try:
            os.remove(audio_file)
        except:
            pass
        
        if text and text.strip():
            print(f"👤 USER SAID: '{text}'")
            print("=" * 50)
            
            # Log user response
            self.conversation_log.append({
                'timestamp': datetime.now().strftime('%H:%M:%S'),
                'speaker': 'USER',
                'text': text
            })
            
            return text
        else:
            print("❌ Speech recognition failed")
            return self.get_manual_input("Please type your response:")
    
    def get_manual_input(self, prompt):
        """Get manual input as fallback"""
        print(f"\n⌨️  {prompt}")
        
        try:
            user_input = input("👤 Type here: ").strip()
            if user_input:
                print(f"👤 USER SAID: '{user_input}'")
                print("=" * 50)
                
                self.conversation_log.append({
                    'timestamp': datetime.now().strftime('%H:%M:%S'),
                    'speaker': 'USER',
                    'text': user_input
                })
                
                return user_input
        except KeyboardInterrupt:
            return None
        
        return None
    
    def run_conversation_flow(self):
        """Run the exact conversation flow requested"""
        print("\n" + "="*60)
        print("🎬 CONVERSATION FLOW: Hello → Name → Wait → Purpose")
        print("="*60)
        
        # Step 1: Say Hello
        print("\n📍 STEP 1: GREETING")
        self.speak("Hello! Welcome to the smart door system.")
        
        time.sleep(2)
        
        # Step 2: Ask for name
        print("\n📍 STEP 2: ASKING FOR NAME")
        self.speak("What is your name?")
        
        # Listen for name
        user_name = self.listen_and_transcribe("Please tell me your name...", 5)
        
        if user_name:
            response = f"Nice to meet you, {user_name}!"
            self.speak(response)
        else:
            self.speak("I didn't catch your name, but that's okay.")
        
        # Step 3: Wait (as requested)
        print("\n📍 STEP 3: WAITING...")
        print("⏳ Waiting for 3 seconds as requested...")
        time.sleep(3)
        
        # Step 4: Ask purpose
        print("\n📍 STEP 4: ASKING PURPOSE OF VISIT")
        self.speak("What is the purpose of your visit today?")
        
        # Listen for purpose
        purpose = self.listen_and_transcribe("Please tell me why you're here...", 7)
        
        if purpose:
            response = f"I understand. You're here because: {purpose}. Thank you!"
            self.speak(response)
        else:
            self.speak("Thank you for visiting.")
        
        # Step 5: Show complete transcription
        print("\n📍 STEP 5: COMPLETE TRANSCRIPTION")
        self.show_transcription()
        
        self.speak("Conversation flow completed. Thank you!")
    
    def show_transcription(self):
        """Show complete conversation transcription"""
        print("\n" + "="*60)
        print("📝 COMPLETE CONVERSATION TRANSCRIPTION")
        print("="*60)
        
        for i, entry in enumerate(self.conversation_log, 1):
            speaker_icon = "🤖" if entry['speaker'] == 'AI' else "👤"
            print(f"{i:2d}. [{entry['timestamp']}] {speaker_icon} {entry['speaker']}: {entry['text']}")
        
        print("="*60)
        
        # Save to file
        try:
            filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(filename, 'w') as f:
                json.dump(self.conversation_log, f, indent=2)
            print(f"💾 Conversation saved to: {filename}")
        except Exception as e:
            print(f"⚠️  Could not save: {e}")
    
    def test_speech_recognition(self):
        """Test speech recognition"""
        print("\n🧪 TESTING SPEECH RECOGNITION")
        print("=" * 30)
        
        print("🔊 Testing speaker...")
        self.speak("This is a speaker test. Can you hear me clearly?")
        
        print("\n🎤 Testing speech recognition...")
        result = self.listen_and_transcribe("Say 'hello test' clearly...", 3)
        
        if result:
            print("✅ Speech recognition test completed!")
            self.speak(f"Perfect! I heard: {result}")
            return True
        else:
            print("⚠️  Speech recognition needs improvement")
            return False

def main():
    """Main function"""
    print("🎤 Working Speech Recognition System")
    print("=" * 40)
    
    try:
        recognizer = WorkingSpeechRecognition()
        
        while True:
            print("\n" + "="*40)
            print("🎤 SPEECH RECOGNITION MENU")
            print("="*40)
            print("1. 🧪 Test Speech Recognition")
            print("2. 🎬 Run Full Conversation Flow")
            print("3. 🎤 Quick Speech Test")
            print("4. 🔊 Quick Speaker Test")
            print("5. 🚪 Exit")
            print("="*40)
            
            choice = input("Enter choice (1-5): ").strip()
            
            if choice == '1':
                recognizer.test_speech_recognition()
            elif choice == '2':
                print("\n🚀 Starting conversation flow...")
                input("Press Enter when ready...")
                recognizer.run_conversation_flow()
            elif choice == '3':
                result = recognizer.listen_and_transcribe("Say something...", 5)
                if result:
                    recognizer.speak(f"I heard: {result}")
            elif choice == '4':
                recognizer.speak("This is a speaker test. Can you hear me clearly?")
            elif choice == '5':
                print("👋 Goodbye!")
                break
            else:
                print("❌ Invalid choice!")
    
    except KeyboardInterrupt:
        print("\n🛑 Exiting...")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
