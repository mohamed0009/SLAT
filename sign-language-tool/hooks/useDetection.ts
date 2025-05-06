import { useState, useEffect, useCallback } from "react";
import { signLanguageApi } from "@/services/api";
import detectionWebSocket from "@/services/websocket";

interface DetectionState {
  isDetecting: boolean;
  currentGesture: string | null;
  confidence: number;
  detectionTime: number;
  fps: number;
  systemStatus: {
    camera: "initializing" | "ready" | "error";
    model: "loading" | "ready" | "error";
    processing: "idle" | "active" | "error";
  };
}

export const useDetection = () => {
  const [state, setState] = useState<DetectionState>({
    isDetecting: false,
    currentGesture: null,
    confidence: 0,
    detectionTime: 0,
    fps: 0,
    systemStatus: {
      camera: "initializing",
      model: "loading",
      processing: "idle",
    },
  });

  const handleDetectionUpdate = useCallback((data: any) => {
    setState((prev) => ({
      ...prev,
      currentGesture: data.gesture,
      confidence: data.confidence,
      detectionTime: data.detection_time,
      fps: data.fps,
      systemStatus: data.system_status,
    }));
  }, []);

  useEffect(() => {
    detectionWebSocket.setOnMessageCallback(handleDetectionUpdate);
    detectionWebSocket.connect();

    return () => {
      detectionWebSocket.disconnect();
    };
  }, [handleDetectionUpdate]);

  const startDetection = async () => {
    try {
      await signLanguageApi.startDetection();
      setState((prev) => ({ ...prev, isDetecting: true }));
    } catch (error) {
      console.error("Failed to start detection:", error);
    }
  };

  const stopDetection = async () => {
    try {
      await signLanguageApi.stopDetection();
      setState((prev) => ({ ...prev, isDetecting: false }));
    } catch (error) {
      console.error("Failed to stop detection:", error);
    }
  };

  const saveDetection = async (video?: File) => {
    if (!state.currentGesture) return;

    try {
      await signLanguageApi.saveDetection({
        gesture: state.currentGesture,
        confidence: state.confidence,
        video,
      });
    } catch (error) {
      console.error("Failed to save detection:", error);
    }
  };

  return {
    ...state,
    startDetection,
    stopDetection,
    saveDetection,
  };
};

export default useDetection;
