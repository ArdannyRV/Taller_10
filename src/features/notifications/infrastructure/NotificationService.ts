import { Platform } from 'react-native';

export class NotificationService {
  static setupAndroidChannel(): void {
    // No-op en Expo Go SDK 53+
    // Activar en development build reemplazando este archivo
  }

  static async requestPermissions(): Promise<boolean> {
    return false;
  }

  static async scheduleLocalNotification(title: string, body: string): Promise<void> {
    if (__DEV__) {
      console.log(`[Notificación Realtime] De: ${title} → ${body}`);
    }
  }
}
