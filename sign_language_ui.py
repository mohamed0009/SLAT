import tkinter as tk
from tkinter import ttk
import cv2
from PIL import Image, ImageTk
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model
from tkinter import scrolledtext
import sounddevice as sd
import wave

# Load the trained model
model = load_model('sign_language_model.h5')

# MediaPipe Initialization
mp_holistic = mp.solutions.holistic  # Holistic model for face/pose/hand landmarks
mp_drawing = mp.solutions.drawing_utils  # Drawing utilities

# Actions and threshold
actions = np.array(['hello', 'thanks', 'iloveyou'])
threshold = 0.8

# Initialize the main window
class SignLanguageApp:
    def __init__(self, root):
        self.root = root
        self.root.title('Sign Language Detection')
        self.root.geometry('800x600')
        self.root.configure(bg='#f0f0f0')  # Set background color

        # Create a frame for video and action display
        self.video_frame = ttk.Frame(self.root, padding='10', style='My.TFrame')
        self.video_frame.pack(fill='both', expand=True, padx=10, pady=10)

        # Create a label to display the video feed
        self.video_label = ttk.Label(self.video_frame)
        self.video_label.pack(padx=10, pady=10)

        # Create a label to display detected actions
        self.action_label = ttk.Label(self.video_frame, text='Detected Action: None', font=('Helvetica', 16), background='#f0f0f0')
        self.action_label.pack(padx=10, pady=10)

        # Create a frame for audio controls
        self.audio_frame = ttk.Frame(self.root, padding='10', style='My.TFrame')
        self.audio_frame.pack(fill='x', padx=10, pady=10)

        # Create a text area for displaying audio messages
        self.audio_text_area = scrolledtext.ScrolledText(self.audio_frame, wrap=tk.WORD, width=40, height=5, font=('Arial', 10), bg='#ffffff', fg='#333333')
        self.audio_text_area.pack(padx=10, pady=10)

        # Create a button to start/stop audio recording
        self.record_button = ttk.Button(self.audio_frame, text='Start Recording', command=self.toggle_recording, style='My.TButton')
        self.record_button.pack(pady=10)

        # Create a frame for detection controls
        self.control_frame = ttk.Frame(self.root, padding='10', style='My.TFrame')
        self.control_frame.pack(fill='x', padx=10, pady=10)

        # Create start and stop buttons
        self.start_button = ttk.Button(self.control_frame, text='Start Detection', command=self.start_detection, style='My.TButton')
        self.start_button.pack(side='left', padx=10, pady=10)

        self.stop_button = ttk.Button(self.control_frame, text='Stop Detection', command=self.stop_detection, style='My.TButton')
        self.stop_button.pack(side='right', padx=10, pady=10)

        # Initialize video capture
        self.cap = None
        self.running = False
        self.sequence = []
        self.sentence = []
        self.predictions = []

        # Audio recording state
        self.recording = False
        self.fs = 44100  # Sample rate
        self.duration = 5  # Duration of recording in seconds

        # Style configuration
        style = ttk.Style()
        style.configure('My.TFrame', background='#f0f0f0')
        style.configure('My.TButton', font=('Helvetica', 12), padding=5)

    def start_detection(self):
        if not self.running:
            self.cap = cv2.VideoCapture(0)
            self.running = True
            self.update_frame()

    def stop_detection(self):
        if self.running:
            self.running = False
            self.cap.release()
            self.video_label.config(image='')

    def update_frame(self):
        if self.running:
            ret, frame = self.cap.read()
            if ret:
                # Convert the frame to RGB
                cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                img = Image.fromarray(cv2image)
                imgtk = ImageTk.PhotoImage(image=img)
                self.video_label.imgtk = imgtk
                self.video_label.configure(image=imgtk)

                # Process the frame with MediaPipe
                with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:
                    image, results = self.mediapipe_detection(frame, holistic)
                    self.draw_landmarks(image, results)

                    # Extract keypoints
                    keypoints = self.extract_keypoints(results)
                    self.sequence.append(keypoints)
                    self.sequence = self.sequence[-30:]

                    if len(self.sequence) == 30:
                        res = model.predict(np.expand_dims(self.sequence, axis=0))[0]
                        self.predictions.append(np.argmax(res))

                        # Smooth predictions
                        if np.unique(self.predictions[-10:])[0] == np.argmax(res) and res[np.argmax(res)] > threshold:
                            if len(self.sentence) == 0 or actions[np.argmax(res)] != self.sentence[-1]:
                                self.sentence.append(actions[np.argmax(res)])
                            if len(self.sentence) > 5:
                                self.sentence = self.sentence[-5:]

                        # Update the action label
                        self.action_label.config(text='Detected Action: ' + ' '.join(self.sentence))

            self.root.after(10, self.update_frame)

    def mediapipe_detection(self, image, model):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = model.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        return image, results

    def draw_landmarks(self, image, results):
        mp_drawing.draw_landmarks(image, results.face_landmarks, mp_holistic.FACEMESH_TESSELATION)
        mp_drawing.draw_landmarks(image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)

    def extract_keypoints(self, results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33*4)
        face = np.array([[res.x, res.y, res.z] for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(468*3)
        lh = np.array([[res.x, res.y, res.z] for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21*3)
        rh = np.array([[res.x, res.y, res.z] for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(21*3)
        return np.concatenate([pose, face, lh, rh])

    def toggle_recording(self):
        if not self.recording:
            self.start_recording()
        else:
            self.stop_recording()

    def start_recording(self):
        self.recording = True
        self.record_button.config(text='Stop Recording')
        self.audio_text_area.insert(tk.END, 'Recording started...\n')
        self.audio_text_area.see(tk.END)
        self.audio_data = sd.rec(int(self.duration * self.fs), samplerate=self.fs, channels=2, dtype='int16')

    def stop_recording(self):
        self.recording = False
        self.record_button.config(text='Start Recording')
        sd.wait()  # Wait until recording is finished
        self.audio_text_area.insert(tk.END, 'Recording stopped.\n')
        self.audio_text_area.see(tk.END)
        # Save the audio data to a file
        with wave.open('output.wav', 'wb') as wf:
            wf.setnchannels(2)
            wf.setsampwidth(2)
            wf.setframerate(self.fs)
            wf.writeframes(self.audio_data.tobytes())

# Run the application
if __name__ == '__main__':
    root = tk.Tk()
    app = SignLanguageApp(root)
    root.mainloop() 