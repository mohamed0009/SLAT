class DetectionWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private onMessageCallback: ((data: any) => void) | null = null;

  constructor() {
    this.url = `${
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"
    }/ws/detection/`;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket Connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket Disconnected");
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => this.connect(), 2000 * this.reconnectAttempts);
    }
  }

  setOnMessageCallback(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }

  sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const detectionWebSocket = new DetectionWebSocket();
export default detectionWebSocket;
