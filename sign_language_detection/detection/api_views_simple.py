from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging
import random

from .model_loader_simple import sign_language_model

logger = logging.getLogger(__name__)

@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint for the API."""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Sign Language Detection API (Simplified)',
        'version': '1.0.0-simple',
        'features': {
            'landmark_detection': True,
            'image_detection': False,  # Disabled without TensorFlow
            'mediapipe_integration': False  # Simplified version
        },
        'note': 'This is a simplified version. Install TensorFlow for full functionality.'
    })

@csrf_exempt
@require_http_methods(["GET"])
def model_info(request):
    """Get information about the loaded model."""
    try:
        info = sign_language_model.get_model_info()
        
        return JsonResponse({
            'model_info': info,
            'available_methods': ['landmarks_mock'],
            'supported_formats': ['landmark_coordinates'],
            'output_classes': 26,  # A-Z
            'input_requirements': {
                'landmarks': '21 hand landmarks with x,y,z coordinates (mock data)',
            },
            'note': 'This is a simplified version for testing. Install TensorFlow for real predictions.'
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
        self.model = sign_language_model
    
    def post(self, request):
        """Handle sign detection requests."""
        try:
            # Parse request data
            data = json.loads(request.body)
            use_landmarks = data.get('use_landmarks', True)
            
            if use_landmarks and 'landmarks' in data:
                return self._detect_from_landmarks(data['landmarks'])
            elif 'image_data' in data:
                return self._detect_from_image_mock(data['image_data'])
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
            
            # Make prediction using simplified model
            result = self.model.predict(landmarks)
            
            return JsonResponse({
                'letter': result['letter'],
                'confidence': float(result['confidence']),
                'processing_time': result.get('processing_time', 0),
                'method': 'landmarks_mock',
                'landmarks_detected': True,
                'raw_predictions': result.get('raw_predictions', []),
                'note': 'This is a mock prediction. Install TensorFlow for real detection.'
            })
            
        except Exception as e:
            logger.error(f"Landmark detection error: {str(e)}")
            return JsonResponse({
                'error': f'Landmark detection failed: {str(e)}',
                'letter': '?',
                'confidence': 0.0
            }, status=500)
    
    def _detect_from_image_mock(self, image_data):
        """Mock detection from image (simplified version)."""
        try:
            # Generate mock landmarks and prediction
            mock_landmarks = self.model.extract_hand_landmarks(None)  # Mock landmarks
            
            if mock_landmarks is not None:
                result = self.model.predict(mock_landmarks)
                method = 'image_to_landmarks_mock'
                landmarks_detected = True
            else:
                result = {
                    'letter': random.choice(['A', 'B', 'C', 'D', 'E']),
                    'confidence': random.uniform(0.3, 0.7),
                    'processing_time': random.uniform(20, 80)
                }
                method = 'image_direct_mock'
                landmarks_detected = False
            
            return JsonResponse({
                'letter': result['letter'],
                'confidence': float(result['confidence']),
                'processing_time': result.get('processing_time', 0),
                'method': method,
                'landmarks_detected': landmarks_detected,
                'raw_predictions': result.get('raw_predictions', []),
                'note': 'This is a mock prediction. Install TensorFlow for real detection.'
            })
            
        except Exception as e:
            logger.error(f"Image detection error: {str(e)}")
            return JsonResponse({
                'error': f'Image detection failed: {str(e)}',
                'letter': '?',
                'confidence': 0.0
            }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def extract_landmarks(request):
    """Extract hand landmarks from an image (mock version)."""
    try:
        data = json.loads(request.body)
        image_data = data.get('image_data')
        
        if not image_data:
            return JsonResponse({
                'error': 'Missing image_data'
            }, status=400)
        
        # Generate mock landmarks
        landmarks = sign_language_model.extract_hand_landmarks(None)
        
        if landmarks is not None:
            landmarks_list = landmarks.tolist()
            return JsonResponse({
                'landmarks': landmarks_list,
                'count': len(landmarks_list),
                'success': True,
                'note': 'These are mock landmarks. Install MediaPipe for real extraction.'
            })
        else:
            return JsonResponse({
                'landmarks': None,
                'count': 0,
                'success': False,
                'message': 'No hand landmarks detected (mock)',
                'note': 'This is a simplified version.'
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
        'type': 'American Sign Language Alphabet (Mock Version)',
        'note': 'This is a simplified version for testing.'
    }) 