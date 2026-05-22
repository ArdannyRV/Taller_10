import { Platform } from 'react-native';

// expo-notifications no funciona en Expo Go SDK 53+
// Esta implementación es un stub que no crashea en Expo Go
// y está lista para activarse en un development build
const isExpoGo = process.env.EXPO_PUBLIC_IS_EXPO_GO !== 'false';

export class NotificationService {
  static setupAndroidChannel(): void {
    if (isExpoGo || Platform.OS !== 'android') return;
    // Solo activo en development build / APK
  }

  static async requestPermissions(): Promise<boolean> {
    if (isExpoGo) return false;
    return false;
  }

  static async scheduleLocalNotification(title: string, body: string): Promise<void> {
    if (isExpoGo) {
      // En Expo Go solo logueamos — en APK esto dispararía la notificación real
      console.log(`[Notificación simulada] ${title}: ${body}`);
      return;
    }
  }
}
