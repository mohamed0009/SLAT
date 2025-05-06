from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
import numpy as np
import json
import sounddevice as sd
import wave
import time
import os
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from django.conf import settings
from pathlib import Path
from django.views.decorators.http import require_http_methods
import base64
import cv2
from .model_loader import sign_language_model
import threading
import traceback
import uuid
from django.contrib.auth.decorators import login_required
from django.utils import timezone
from .models import DetectionHistory, UserAnalytics, UserSettings
from .model import SignLanguageModel
from django.db.models import Count, Avg

# Initialize model in a separate thread to avoid blocking the server
def initialize_model():
    try:
        sign_language_model.load_model()
        print("Model initialization complete")
    except Exception as e:
        print(f"Error initializing model: {str(e)}")
        print(traceback.format_exc())

# Start model initialization in background
threading.Thread(target=initialize_model).start()

# Initialize model
model = SignLanguageModel()

def get_audio_duration(filepath):
    """Get the duration of a WAV file in seconds."""
    try:
        with wave.open(filepath, "rb") as wf:
            frames = wf.getnframes()
            rate = wf.getframerate()
            duration = frames / float(rate)
            return round(duration, 2)
    except Exception as e:
        print(f"Error getting duration for {filepath}: {e}")
        return 0

def get_recording_info(filepath):
    """Get information about a recording file."""
    try:
        filename = os.path.basename(filepath)
        duration = get_audio_duration(filepath)
        timestamp = filename.split('_')[1].split('.')[0]
        return {
            'filename': filename,
            'duration': duration,
            'timestamp': timestamp,
            'url': f'/media/recordings/{filename}',
            'filepath': str(filepath),
            'exists': os.path.exists(filepath),
            'size': os.path.getsize(filepath)
        }
    except Exception as e:
        print(f"Error getting info for {filepath}: {e}")
        return None

@csrf_exempt
def record_audio(request):
    if request.method == "POST":
        try:
            audio_data = request.FILES.get("audio")
            if not audio_data:
                return JsonResponse({
                    "success": False,
                    "error": "No audio data received"
                }, status=400)

            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"recording_{timestamp}.wav"
            filepath = settings.RECORDINGS_DIR / filename

            # Ensure the recordings directory exists
            settings.RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)

            # Save the audio file
            try:
                with open(filepath, "wb") as f:
                    for chunk in audio_data.chunks():
                        f.write(chunk)
            except Exception as e:
                return JsonResponse({
                    "success": False,
                    "error": f"Error saving audio file: {str(e)}"
                }, status=500)

            # Get recording info
            recording_info = get_recording_info(filepath)
            if not recording_info:
                return JsonResponse({
                    "success": False,
                    "error": "Failed to process recording"
                }, status=500)

            return JsonResponse({
                "success": True,
                "recording": recording_info
            })

        except Exception as e:
            return JsonResponse({
                "success": False,
                "error": str(e)
            }, status=500)

    return JsonResponse({
        "success": False,
        "error": "Invalid request method"
    }, status=405)

@csrf_exempt
def get_recordings(request):
    try:
        recordings_dir = settings.RECORDINGS_DIR
        print(f"Looking for recordings in: {recordings_dir}")
        
        if not recordings_dir.exists():
            print(f"Creating recordings directory: {recordings_dir}")
            recordings_dir.mkdir(parents=True, exist_ok=True)
        
        recordings = []
        for filepath in recordings_dir.glob("*.wav"):
            recording_info = get_recording_info(filepath)
            if recording_info:
                recordings.append(recording_info)
        
        # Sort recordings by timestamp (newest first)
        recordings.sort(key=lambda x: x['timestamp'], reverse=True)
        
        response_data = {
            'success': True,
            'recordings': recordings,
            'message': f"Found {len(recordings)} recordings" if recordings else "No recordings found",
            'debug_info': {
                'directory': str(recordings_dir),
                'wav_count': len(recordings)
            }
        }
        
        print(f"Response data: {response_data}")
        return JsonResponse(response_data)
        
    except Exception as e:
        error_msg = str(e)
        print(f"Error in get_recordings: {error_msg}")
        return JsonResponse({
            'success': False,
            'error': error_msg,
            'recordings': [],
            'debug_info': {
                'error_type': type(e).__name__,
                'error_msg': error_msg,
                'recordings_dir': str(settings.RECORDINGS_DIR)
            }
        })

@csrf_exempt
def delete_recording(request):
    """
    Handle deleting audio recordings
    """
    if request.method == 'POST':
        try:
            # Parse the JSON data from the request
            data = json.loads(request.body)
            
            # Get the filename from the data
            filename = data.get('filename')
            
            if not filename:
                return JsonResponse({"success": False, "error": "No filename provided"})
            
            # Define the file path
            file_path = settings.RECORDINGS_DIR / filename
            
            # Check if the file exists
            if not file_path.exists():
                return JsonResponse({"success": False, "error": "File not found"})
            
            # Delete the file
            file_path.unlink()
            
            # Return success response
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    
    # If not a POST request
    return JsonResponse({"success": False, "error": "Invalid request method"})

@csrf_exempt
def serve_audio(request, filename):
    try:
        filepath = settings.RECORDINGS_DIR / filename
        if not filepath.exists():
            return HttpResponseNotFound("Audio file not found")
            
        with open(filepath, 'rb') as f:
            response = HttpResponse(f.read(), content_type='audio/wav')
            response['Content-Disposition'] = f'inline; filename="{filename}"'
            return response
    except Exception as e:
        return HttpResponse(str(e), status=500)

# Create your views here.
def index(request):
    context = {
        'user': request.user,
    }
    return render(request, 'detection/index.html', context)

@csrf_exempt
@require_http_methods(["POST"])
def predict(request):
    if request.method == 'POST':
        try:
            # Parse landmarks from request
            data = json.loads(request.body)
            landmarks = data.get('landmarks', [])
            
            # Make prediction
            predicted_class, confidence = model.predict(landmarks)
            
            # Convert class to letter (assuming classes are 0-25 for A-Z)
            prediction = chr(65 + predicted_class)  # 65 is ASCII for 'A'
            
            return JsonResponse({
                'prediction': prediction,
                'confidence': float(confidence)
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@csrf_exempt
@require_http_methods(["GET"])
def model_info(request):
    try:
        # If model isn't loaded yet, return status
        if sign_language_model.model is None:
            return JsonResponse({
                'success': False,
                'status': 'Model is initializing',
                'ready': False
            })
            
        info = sign_language_model.get_model_info()
        info['ready'] = True
        
        return JsonResponse({
            'success': True,
            'info': info
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'ready': False
        }, status=500)

# Add save_audio function to handle audio saving from the frontend
@csrf_exempt
def save_audio(request):
    """
    Handle saving audio recordings sent from the client
    """
    if request.method == 'POST':
        try:
            # Check if audio file is in the request
            if 'audio' not in request.FILES:
                return JsonResponse({"success": False, "error": "No audio file received"})
            
            # Get the audio file
            audio_file = request.FILES['audio']
            
            # Create a unique filename
            filename = f"{uuid.uuid4()}.wav"
            
            # Define the directory to save recordings
            recordings_dir = os.path.join(settings.MEDIA_ROOT, 'recordings')
            
            # Create the directory if it doesn't exist
            if not os.path.exists(recordings_dir):
                os.makedirs(recordings_dir)
            
            # Define the full path
            file_path = os.path.join(recordings_dir, filename)
            
            # Save the file
            with open(file_path, 'wb+') as destination:
                for chunk in audio_file.chunks():
                    destination.write(chunk)
            
            # Return success response with the file info
            return JsonResponse({
                "success": True,
                "recording": {
                    "filename": filename,
                    "url": f"/media/recordings/{filename}"
                }
            })
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    
    # If not a POST request
    return JsonResponse({"success": False, "error": "Invalid request method"})

def fetch_recordings(request):
    """
    Fetch all recordings for a user
    """
    recordings_dir = os.path.join(settings.MEDIA_ROOT, 'recordings')
    
    # Create the directory if it doesn't exist
    if not os.path.exists(recordings_dir):
        os.makedirs(recordings_dir)
    
    recordings = []
    
    # Get all files in the recordings directory
    for filename in os.listdir(recordings_dir):
        if filename.endswith('.wav'):
            file_path = os.path.join(recordings_dir, filename)
            
            # Get file creation time
            creation_time = os.path.getctime(file_path)
            created_date = datetime.fromtimestamp(creation_time)
            
            recordings.append({
                "filename": filename,
                "url": f"/media/recordings/{filename}",
                "created": created_date.strftime("%Y-%m-%d %H:%M:%S")
            })
    
    # Sort recordings by creation time (newest first)
    recordings.sort(key=lambda x: x["created"], reverse=True)
    
    return JsonResponse({"success": True, "recordings": recordings})

@login_required
def analytics_view(request):
    user_analytics, created = UserAnalytics.objects.get_or_create(user=request.user)
    
    # Get detection statistics
    detection_history = DetectionHistory.objects.filter(user=request.user)
    total_detections = detection_history.count()
    
    # Calculate most common gestures
    common_gestures = detection_history.values('gesture').annotate(
        count=Count('gesture')).order_by('-count')[:5]
    
    # Calculate accuracy over time
    accuracy_data = list(detection_history.values('timestamp', 'confidence'))
    
    context = {
        'user_analytics': user_analytics,
        'total_detections': total_detections,
        'common_gestures': common_gestures,
        'accuracy_data': json.dumps(accuracy_data),
    }
    return render(request, 'detection/analytics.html', context)

@login_required
def history_view(request):
    history = DetectionHistory.objects.filter(user=request.user)
    return render(request, 'detection/history.html', {'history': history})

@login_required
def settings_view(request):
    settings, created = UserSettings.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        settings.detection_sensitivity = float(request.POST.get('detection_sensitivity', 0.5))
        settings.enable_sound = request.POST.get('enable_sound') == 'on'
        settings.enable_notifications = request.POST.get('enable_notifications') == 'on'
        settings.preferred_language = request.POST.get('preferred_language', 'en')
        settings.camera_device = request.POST.get('camera_device', '0')
        settings.dark_mode = request.POST.get('dark_mode') == 'on'
        settings.save()
        return redirect('settings')
    
    return render(request, 'detection/settings.html', {'settings': settings})

@login_required
def update_settings(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        settings = UserSettings.objects.get(user=request.user)
        
        for key, value in data.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        
        settings.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

@csrf_exempt
def load_model(request):
    try:
        # Load model weights
        model.load_weights('detection/models/weights/sign_language_model_weights.h5')
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
