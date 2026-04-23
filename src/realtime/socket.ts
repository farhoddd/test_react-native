import { bootstrapDeviceUserId } from '../auth/device-user';
import type { RealtimeEvent } from './types';

type Listener = (event: RealtimeEvent) => void;

const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'wss://k8s.mectest.ru/test-app/ws';

class SocketService {
  private listeners = new Set<Listener>();
  private socket: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private subscribers = 0;

  async connect() {
    if (this.socket || this.subscribers === 0) {
      return;
    }

    const token = await bootstrapDeviceUserId();
    if (!token) {
      return;
    }

    this.socket = new WebSocket(`${WS_URL}?token=${token}`);

    this.socket.onmessage = (message) => {
      try {
        const payload = JSON.parse(message.data as string) as RealtimeEvent;
        this.listeners.forEach((listener) => listener(payload));
      } catch {
        return;
      }
    };

    this.socket.onclose = () => {
      this.socket = null;
      this.scheduleReconnect();
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  subscribe() {
    this.subscribers += 1;
    void this.connect();

    return () => {
      this.subscribers = Math.max(0, this.subscribers - 1);
      if (this.subscribers === 0) {
        this.disconnect();
      }
    };
  }

  addListener(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.socket?.close();
    this.socket = null;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout || this.subscribers === 0) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      void this.connect();
    }, 2000);
  }
}

export const socketService = new SocketService();
