import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signLanguageApi = {
  // Detection endpoints - Updated to match Django URLs
  startDetection: () => api.post("/app/api/detect-sign/"),
  stopDetection: () => api.post("/app/api/detect-sign/"),
  getDetectionResult: () => api.get("/app/api/model-info/"),
  predict: (landmarks: any[]) => api.post("/app/predict/", { landmarks }),

  // History endpoints - Updated to match Django URLs
  getDetectionHistory: (page = 1) => api.get(`/app/history/?page=${page}`),
  saveDetection: (data: {
    gesture: string;
    confidence: number;
    video?: File;
  }) => {
    const formData = new FormData();
    formData.append("gesture", data.gesture);
    formData.append("confidence", data.confidence.toString());
    if (data.video) {
      formData.append("video", data.video);
    }
    return api.post("/app/save_audio/", formData);
  },

  // Analytics endpoints - Updated to match Django URLs
  getUserAnalytics: () => api.get("/app/analytics/"),
  getSystemMetrics: () => api.get("/app/api/model-info/"),

  // Settings endpoints - Updated to match Django URLs
  getUserSettings: () => api.get("/app/settings/"),
  updateUserSettings: (settings: {
    detection_sensitivity: number;
    enable_sound: boolean;
    enable_notifications: boolean;
    preferred_language: string;
    camera_device: string;
    dark_mode: boolean;
  }) => api.put("/app/update-settings/", settings),

  // Audio/Recording endpoints - Updated to match Django URLs
  recordAudio: (audioFile: File) => {
    const formData = new FormData();
    formData.append("audio", audioFile);
    return api.post("/app/record_audio/", formData);
  },
  getRecordings: () => api.get("/app/get_recordings/"),
  deleteRecording: (filename: string) => api.post("/app/delete_recording/", { filename }),

  // Model endpoints - Updated to match Django URLs
  loadModel: () => api.post("/app/load_model/"),
  getModelStatus: () => api.get("/app/model-status/"),
  getModelInfo: () => api.get("/app/api/model-info/"),

  // Health check
  healthCheck: () => api.get("/app/api/health/"),

  // Translation endpoints (placeholder - not implemented in Django yet)
  translateText: (text: string) => api.post("/app/translate/text/", { text }),

  // Authentication endpoints - Updated to match Django URLs
  login: (credentials: { username: string; password: string }) =>
    api.post("/login/", credentials),
  register: (userData: { username: string; password: string; email: string }) =>
    api.post("/register/", userData),
  logout: () => api.post("/logout/"),
};

export default signLanguageApi;
