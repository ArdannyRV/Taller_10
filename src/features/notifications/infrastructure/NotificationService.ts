import { Platform } from 'react-native';

export class NotificationService {
  static setupAndroidChannel(): void {
    // Notificaciones locales no disponibles en Expo Go SDK 53+
    // Listo para activar en development build / APK
  }

  static async requestPermissions(): Promise<boolean> {
    return false;
  }

  static async scheduleLocalNotification(title: string, body: string): Promise<void> {
    // En Expo Go solo se loguea. En APK dispararía la notificación real.
    if (__DEV__) {
      console.log(`[Notificación] ${title}: ${body}`);
    }
  }
}
