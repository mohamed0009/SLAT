import kagglehub
import tensorflow as tf
import numpy as np
import os
import glob
import cv2
import mediapipe as mp
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SignLanguageModel:
    def __init__(self, auto_load=True):
        self.model = None
        self.model_path = None
        self.is_initialized = False
        # Initialize MediaPipe hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=True, 
            max_num_hands=1, 
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        if auto_load:
            self.load_model()

    def load_model(self):
        try:
            logger.info("Starting model loading process...")
            
            # Check if model is already loaded
            if self.model is not None:
                logger.info("Model already loaded")
                return True
                
            # Download the model from Kaggle
            logger.info("Downloading model from Kaggle...")
            download_path = kagglehub.model_download("vnefedov/american-sign-language-with-landmarks/keras/default")
            logger.info(f"Model downloaded to: {download_path}")
            
            # Check what files actually exist in the download path
            model_files = self._find_model_files(download_path)
            logger.info(f"Found model files: {model_files}")
            
            if not model_files:
                logger.warning(f"No model files found in {download_path}, creating fallback model")
                self._create_fallback_model()
                return True
            
            # Try to load the model based on available files
            self.model_path = model_files[0]  # Use the first found model file
            
            # Try different loading approaches based on file extension
            if self.model_path.endswith('.h5') or self.model_path.endswith('.keras'):
                logger.info(f"Loading Keras model from {self.model_path}")
                self.model = tf.keras.models.load_model(self.model_path)
            elif os.path.isdir(self.model_path) and (os.path.exists(os.path.join(self.model_path, 'saved_model.pb')) or 
                                                    os.path.exists(os.path.join(self.model_path, 'saved_model.pbtxt'))):
                logger.info(f"Loading SavedModel from {self.model_path}")
                self.model = tf.saved_model.load(self.model_path)
            else:
                logger.warning(f"Could not determine model format for {self.model_path}, using fallback model")
                self._create_fallback_model()
            
            self.is_initialized = True
            logger.info("Model loaded successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            logger.info("Creating fallback model instead")
            self._create_fallback_model()
            return False

    def _find_model_files(self, base_path):
        """Find model files in the download directory"""
        model_files = []
        
        # Check for directories that might contain SavedModel
        for dirpath, dirnames, filenames in os.walk(base_path):
            for dirname in dirnames:
                dir_full_path = os.path.join(dirpath, dirname)
                if os.path.exists(os.path.join(dir_full_path, 'saved_model.pb')) or \
                   os.path.exists(os.path.join(dir_full_path, 'saved_model.pbtxt')):
                    model_files.append(dir_full_path)
        
        # Check for .h5, .keras files
        for ext in ['*.h5', '*.keras', '*.pb', '*.tflite']:
            model_files.extend(glob.glob(os.path.join(base_path, '**', ext), recursive=True))
        
        return model_files

    def _create_fallback_model(self):
        """Create a simple fallback CNN model for sign language detection based on landmarks"""
        logger.info("Creating simple fallback model for landmarks")
        try:
            model = tf.keras.Sequential([
                tf.keras.layers.Input(shape=(21, 3)),  # 21 landmarks with 3 coordinates each
                tf.keras.layers.Flatten(),
                tf.keras.layers.Dense(128, activation='relu'),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(64, activation='relu'),
                tf.keras.layers.Dropout(0.2),
                tf.keras.layers.Dense(26, activation='softmax')  # 26 letters
            ])
            model.compile(
                optimizer='adam',
                loss='sparse_categorical_crossentropy',
                metrics=['accuracy']
            )
            self.model = model
            self.model_path = "fallback_model"
            self.is_initialized = True
            logger.info("Fallback model created successfully")
        except Exception as e:
            logger.error(f"Error creating fallback model: {str(e)}")
            self.is_initialized = False

    def extract_hand_landmarks(self, image):
        """Extract hand landmarks from an image using MediaPipe."""
        try:
            # Convert image to RGB for MediaPipe
            if image.shape[2] == 4:  # If RGBA
                image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
            
            # Process the image
            results = self.hands.process(image)
            
            # Check if any hands were detected
            if not results.multi_hand_landmarks:
                logger.debug("No hands detected in the image")
                return None
            
            # Get landmarks for the first hand
            hand_landmarks = results.multi_hand_landmarks[0]
            
            # Extract landmark coordinates (x, y, z)
            landmarks = []
            for landmark in hand_landmarks.landmark:
                landmarks.append([landmark.x, landmark.y, landmark.z])
            
            return np.array(landmarks, dtype=np.float32)
            
        except Exception as e:
            logger.error(f"Error extracting landmarks: {str(e)}")
            return None

    def predict(self, image):
        try:
            if not self.is_initialized:
                logger.warning("Model not initialized, attempting to load...")
                if not self.load_model():
                    raise ValueError("Failed to initialize model")
            
            if self.model is None:
                raise ValueError("Model not loaded")

            # Extract hand landmarks
            landmarks = self.extract_hand_landmarks(image)
            
            if landmarks is None:
                return {
                    'letter': '?',
                    'confidence': 0.0,
                    'raw_predictions': [],
                    'error': "No hand landmarks detected"
                }
            
            # Reshape for model input (add batch dimension)
            landmarks = np.expand_dims(landmarks, axis=0)
            
            # Make prediction
            if isinstance(self.model, tf.keras.Model):
                predictions = self.model.predict(landmarks, verbose=0)
            else:
                # Handle SavedModel format
                infer = self.model.signatures["serving_default"]
                input_name = list(infer.structured_input_signature[1].keys())[0]
                output_name = list(infer.structured_outputs.keys())[0]
                predictions = infer(**{input_name: landmarks})[output_name].numpy()
            
            # Get the predicted class and confidence
            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
            
            # Map class index to sign language letter (A-Z)
            predicted_letter = chr(predicted_class + 65)  # 65 is ASCII for 'A'
            
            logger.debug(f"Prediction: {predicted_letter} with confidence {confidence:.2f}")
            
            return {
                'letter': predicted_letter,
                'confidence': confidence,
                'raw_predictions': predictions[0].tolist()
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            return {
                'letter': '?',
                'confidence': 0.0,
                'raw_predictions': [],
                'error': str(e)
            }

    def get_model_info(self):
        if not self.is_initialized:
            return {
                'ready': False,
                'status': 'Model not initialized'
            }
        
        if self.model is None:
            return {
                'ready': False,
                'status': 'Model not loaded'
            }
        
        model_type = "Unknown"
        if isinstance(self.model, tf.keras.Model):
            model_type = "Keras Model"
        elif hasattr(self.model, "signatures"):
            model_type = "SavedModel"
        
        return {
            'ready': True,
            'model_path': self.model_path,
            'model_type': model_type,
            'is_fallback': self.model_path == "fallback_model",
            'input_type': 'Hand Landmarks (21 points)'
        }

# Initialize model with auto_load=True to ensure it's loaded at startup
sign_language_model = SignLanguageModel(auto_load=True) 