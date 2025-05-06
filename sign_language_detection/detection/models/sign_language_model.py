import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np

class SignLanguageModel:
    def __init__(self, num_classes=26):  # 26 letters in the alphabet
        self.model = self._build_model(num_classes)
        self.num_classes = num_classes
        
    def _build_model(self, num_classes):
        model = models.Sequential([
            # Input layer - expecting 21 keypoints (x,y,z) for each hand
            layers.Input(shape=(21, 3)),
            
            # First LSTM layer
            layers.LSTM(128, return_sequences=True),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            # Second LSTM layer
            layers.LSTM(64, return_sequences=False),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            # Dense layers
            layers.Dense(128, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.3),
            
            layers.Dense(64, activation='relu'),
            layers.BatchNormalization(),
            layers.Dropout(0.2),
            
            # Output layer
            layers.Dense(num_classes, activation='softmax')
        ])
        
        # Compile the model
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def preprocess_landmarks(self, landmarks):
        """Preprocess hand landmarks for the model"""
        # Convert landmarks to numpy array
        landmarks = np.array(landmarks)
        
        # Normalize landmarks
        min_val = np.min(landmarks, axis=0)
        max_val = np.max(landmarks, axis=0)
        landmarks = (landmarks - min_val) / (max_val - min_val + 1e-8)
        
        # Reshape for model input
        landmarks = landmarks.reshape(1, 21, 3)
        
        return landmarks
    
    def predict(self, landmarks):
        """Make prediction on preprocessed landmarks"""
        # Preprocess landmarks
        processed_landmarks = self.preprocess_landmarks(landmarks)
        
        # Make prediction
        prediction = self.model.predict(processed_landmarks)
        
        # Get predicted class and confidence
        predicted_class = np.argmax(prediction)
        confidence = prediction[0][predicted_class]
        
        return predicted_class, confidence
    
    def load_weights(self, weights_path):
        """Load model weights from file"""
        self.model.load_weights(weights_path)
    
    def save_weights(self, weights_path):
        """Save model weights to file"""
        self.model.save_weights(weights_path) 