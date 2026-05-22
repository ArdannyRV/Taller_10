import { Platform } from 'react-native';

// Importaciones lazy para evitar que expo-notifications registre push tokens automáticamente
let Notifications: typeof import('expo-notifications') | null = null;

async function getNotifications() {
  if (!Notifications) {
    Notifications = await import('expo-notifications');
  }
  return Notifications;
}

export class NotificationService {
  static setupAndroidChannel(): void {
    if (Platform.OS !== 'android') return;
    getNotifications().then((N) => {
      N.setNotificationChannelAsync('chat-messages', {
        name: 'Mensajes de Chat',
        importance: N.AndroidImportance.HIGH,
        sound: 'default',
      });
    });
  }

  static async requestPermissions(): Promise<boolean> {
    const N = await getNotifications();
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleLocalNotification(title: string, body: string): Promise<void> {
    const N = await getNotifications();
    await N.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
  }
}
