from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
import base64
import cv2
import numpy as np
from PIL import Image
import io
import logging

from .model_loader import SignLanguageModel

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint for the API."""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Sign Language Detection API',
        'version': '1.0.0',
        'features': {
            'landmark_detection': True,
            'image_detection': True,
            'mediapipe_integration': True
        }
    })

@csrf_exempt
@require_http_methods(["GET"])
def model_info(request):
    """Get information about the loaded model."""
    try:
        model_instance = SignLanguageModel()
        info = model_instance.get_model_info()
        
        return JsonResponse({
            'model_info': info,
            'available_methods': ['landmarks', 'image'],
            'supported_formats': ['base64_image', 'landmark_coordinates'],
            'output_classes': 26,  # A-Z
            'input_requirements': {
                'landmarks': '21 hand landmarks with x,y,z coordinates',
                'image': 'Base64 encoded image (JPEG/PNG)'
            }
        })
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        return JsonResponse({
            'error': f'Failed to get model info: {str(e)}'
        }, status=500)

@method_decorator(csrf_exempt, name='dispatch')
class DetectSignView(View):
    """Main detection endpoint for sign language recognition."""
    
    def __init__(self):
        super().__init__()
        self.model = SignLanguageModel()
    
    def post(self, request):
        """Handle sign detection requests."""
        try:
            # Parse request data
            data = json.loads(request.body)
            use_landmarks = data.get('use_landmarks', True)
            
            if use_landmarks and 'landmarks' in data:
                return self._detect_from_landmarks(data['landmarks'])
            elif 'image_data' in data:
                return self._detect_from_image(data['image_data'])
            else:
                return JsonResponse({
                    'error': 'Missing required data. Provide either landmarks or image_data.'
                }, status=400)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'error': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            logger.error(f"Detection error: {str(e)}")
            return JsonResponse({
                'error': f'Detection failed: {str(e)}'
            }, status=500)
    
    def _detect_from_landmarks(self, landmarks_data):
        """Detect sign from hand landmarks."""
        try:
            if not landmarks_data or len(landmarks_data) != 21:
                return JsonResponse({
                    'error': 'Invalid landmarks data. Expected 21 landmarks with x,y,z coordinates.'
                }, status=400)
            
            # Convert landmarks to the format expected by the model
            landmarks = []
            for landmark in landmarks_data:
                if not all(key in landmark for key in ['x', 'y', 'z']):
                    return JsonResponse({
                        'error': 'Each landmark must have x, y, and z coordinates.'
                    }, status=400)
                landmarks.append([landmark['x'], landmark['y'], landmark['z']])
            
            # Make prediction
            result = self.model.predict(np.array(landmarks))
            
            return JsonResponse({
                'letter': result['letter'],
                'confidence': float(result['confidence']),
                'processing_time': result.get('processing_time', 0),
                'method': 'landmarks',
                'landmarks_detected': True,
                'raw_predictions': result.get('raw_predictions', [])
            })
            
        except Exception as e:
            logger.error(f"Landmark detection error: {str(e)}")
            return JsonResponse({
                'error': f'Landmark detection failed: {str(e)}',
                'letter': '?',
                'confidence': 0.0
            }, status=500)
    
    def _detect_from_image(self, image_data):
        """Detect sign from base64 encoded image."""
        try:
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes))
            
            # Convert PIL image to numpy array
            image_array = np.array(image)
            
            # Convert RGB to BGR for OpenCV compatibility
            if len(image_array.shape) == 3 and image_array.shape[2] == 3:
                image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
            
            # Use the model to extract landmarks first, then predict
            landmarks = self.model.extract_hand_landmarks(image_array)
            
            if landmarks is not None:
                # Use landmarks for prediction (more accurate)
                result = self.model.predict(landmarks)
                method = 'landmarks_from_image'
                landmarks_detected = True
            else:
                # Fallback: direct image prediction (less accurate but still works)
                # This would require additional implementation in the model
                result = {
                    'letter': '?',
                    'confidence': 0.0,
                    'error': 'No hand landmarks detected in image'
                }
                method = 'image_direct'
                landmarks_detected = False
            
            return JsonResponse({
                'letter': result['letter'],
                'confidence': float(result['confidence']),
                'processing_time': result.get('processing_time', 0),
                'method': method,
                'landmarks_detected': landmarks_detected,
                'error': result.get('error'),
                'raw_predictions': result.get('raw_predictions', [])
            })
            
        except Exception as e:
            logger.error(f"Image detection error: {str(e)}")
            return JsonResponse({
                'error': f'Image detection failed: {str(e)}',
                'letter': '?',
                'confidence': 0.0
            }, status=500)

# Additional utility endpoints

@csrf_exempt
@require_http_methods(["POST"])
def extract_landmarks(request):
    """Extract hand landmarks from an image."""
    try:
        data = json.loads(request.body)
        image_data = data.get('image_data')
        
        if not image_data:
            return JsonResponse({
                'error': 'Missing image_data'
            }, status=400)
        
        # Decode and process image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        
        if len(image_array.shape) == 3 and image_array.shape[2] == 3:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
        
        # Extract landmarks
        model_instance = SignLanguageModel()
        landmarks = model_instance.extract_hand_landmarks(image_array)
        
        if landmarks is not None:
            # Convert numpy array to list for JSON serialization
            landmarks_list = landmarks.tolist()
            return JsonResponse({
                'landmarks': landmarks_list,
                'count': len(landmarks_list),
                'success': True
            })
        else:
            return JsonResponse({
                'landmarks': None,
                'count': 0,
                'success': False,
                'message': 'No hand landmarks detected'
            })
            
    except Exception as e:
        logger.error(f"Landmark extraction error: {str(e)}")
        return JsonResponse({
            'error': f'Landmark extraction failed: {str(e)}'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def get_gesture_classes(request):
    """Get the list of supported gesture classes."""
    return JsonResponse({
        'classes': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                   'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        'count': 26,
        'type': 'American Sign Language Alphabet'
    }) 