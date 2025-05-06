import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const signLanguageApi = {
  // Detection endpoints
  startDetection: () => api.post("/detection/start"),
  stopDetection: () => api.post("/detection/stop"),
  getDetectionResult: () => api.get("/detection/result"),

  // History endpoints
  getDetectionHistory: (page = 1) => api.get(`/detection/history?page=${page}`),
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
    return api.post("/detection/save", formData);
  },

  // Analytics endpoints
  getUserAnalytics: () => api.get("/analytics/user"),
  getSystemMetrics: () => api.get("/analytics/system"),

  // Settings endpoints
  getUserSettings: () => api.get("/settings"),
  updateUserSettings: (settings: {
    detection_sensitivity: number;
    enable_sound: boolean;
    enable_notifications: boolean;
    preferred_language: string;
    camera_device: string;
    dark_mode: boolean;
  }) => api.put("/settings", settings),

  // Translation endpoints
  translateText: (text: string) => api.post("/translate/text", { text }),

  // Authentication endpoints
  login: (credentials: { username: string; password: string }) =>
    api.post("/auth/login", credentials),
  register: (userData: { username: string; password: string; email: string }) =>
    api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
};

export default signLanguageApi;
