from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import login_required
from . import views
from . import api_views_simple

# API endpoints
api_patterns = [
    path('predict/', views.predict, name='predict'),
    path('record_audio/', views.record_audio, name='record_audio'),
    path('get_recordings/', views.get_recordings, name='get_recordings'),
    path('delete_recording/', views.delete_recording, name='delete_recording'),
    path('audio/<str:filename>', views.serve_audio, name='serve_audio'),
    path('model_info/', views.model_info, name='model_info'),
    # New simplified API endpoints
    path('health/', api_views_simple.health_check, name='api_health'),
    path('model-info/', api_views_simple.model_info, name='api_model_info'),
    path('detect-sign/', api_views_simple.DetectSignView.as_view(), name='api_detect_sign'),
    path('extract-landmarks/', api_views_simple.extract_landmarks, name='api_extract_landmarks'),
    path('gesture-classes/', api_views_simple.get_gesture_classes, name='api_gesture_classes'),
]

# Main URL patterns
urlpatterns = [
    path('', login_required(views.index), name='index'),
    path('predict/', views.predict, name='predict'),
    path('save_audio/', views.save_audio, name='save_audio'),
    path('delete_recording/', views.delete_recording, name='delete_recording'),
    path('fetch_recordings/', views.fetch_recordings, name='fetch_recordings'),
    path('audio/<str:filename>', views.serve_audio, name='serve_audio'),
    path('api/', include(api_patterns)),  # Group all API endpoints under /api/
    path('analytics/', views.analytics_view, name='analytics'),
    path('history/', views.history_view, name='history'),
    path('settings/', views.settings_view, name='settings'),
    path('update-settings/', views.update_settings, name='update_settings'),
    path('load_model/', views.load_model, name='load_model'),
    path('detect/', views.detect_sign, name='detect'),
    path('upload/', views.upload_recording, name='upload'),
    path('train/', views.train_model, name='train'),
    path('export/', views.export_model, name='export'),
    path('recordings/', views.recordings_list, name='recordings'),
    path('recordings/<int:recording_id>/', views.recording_detail, name='recording_detail'),
    path('recordings/<int:recording_id>/delete/', views.delete_recording, name='delete_recording'),
    path('model-status/', views.model_status, name='model_status'),
]

# Add static and media file serving in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 