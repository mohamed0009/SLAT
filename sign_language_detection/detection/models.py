from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.

class DetectionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gesture = models.CharField(max_length=50)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)
    video_clip = models.FileField(upload_to='detection_clips/', null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Detection History'
        verbose_name_plural = 'Detection Histories'

    def __str__(self):
        return f"{self.user.username} - {self.gesture} ({self.timestamp})"

class UserAnalytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_detections = models.IntegerField(default=0)
    average_confidence = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Analytics'
        verbose_name_plural = 'User Analytics'

    def update_analytics(self):
        self.total_detections = DetectionHistory.objects.filter(user=self.user).count()
        if self.total_detections > 0:
            self.average_confidence = DetectionHistory.objects.filter(
                user=self.user
            ).aggregate(models.Avg('confidence'))['confidence__avg']
        self.save()

    def __str__(self):
        return f"Analytics for {self.user.username}"

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    detection_sensitivity = models.FloatField(default=0.5)
    enable_sound = models.BooleanField(default=True)
    enable_notifications = models.BooleanField(default=True)
    preferred_language = models.CharField(max_length=10, default='en')
    camera_device = models.CharField(max_length=50, default='0')
    dark_mode = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'User Settings'
        verbose_name_plural = 'User Settings'
    
    def __str__(self):
        return f"Settings for {self.user.username}"
