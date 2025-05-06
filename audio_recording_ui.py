import tkinter as tk
from tkinter import scrolledtext
import sounddevice as sd
import numpy as np
import wave

class AudioRecorderApp:
    def __init__(self, root):
        self.root = root
        self.root.title('Audio Recorder')
        self.root.geometry('400x300')

        # Create a text area for displaying messages
        self.text_area = scrolledtext.ScrolledText(self.root, wrap=tk.WORD, width=40, height=10, font=('Arial', 12))
        self.text_area.pack(padx=10, pady=10)

        # Create a button to start/stop recording
        self.record_button = tk.Button(self.root, text='Start Recording', command=self.toggle_recording)
        self.record_button.pack(pady=10)

        # Recording state
        self.recording = False
        self.fs = 44100  # Sample rate
        self.duration = 5  # Duration of recording in seconds

    def toggle_recording(self):
        if not self.recording:
            self.start_recording()
        else:
            self.stop_recording()

    def start_recording(self):
        self.recording = True
        self.record_button.config(text='Stop Recording')
        self.text_area.insert(tk.END, 'Recording started...\n')
        self.text_area.see(tk.END)
        self.audio_data = sd.rec(int(self.duration * self.fs), samplerate=self.fs, channels=2, dtype='int16')

    def stop_recording(self):
        self.recording = False
        self.record_button.config(text='Start Recording')
        sd.wait()  # Wait until recording is finished
        self.text_area.insert(tk.END, 'Recording stopped.\n')
        self.text_area.see(tk.END)
        # Save the audio data to a file
        with wave.open('output.wav', 'wb') as wf:
            wf.setnchannels(2)
            wf.setsampwidth(2)
            wf.setframerate(self.fs)
            wf.writeframes(self.audio_data.tobytes())

# Run the application
if __name__ == '__main__':
    root = tk.Tk()
    app = AudioRecorderApp(root)
    root.mainloop() 