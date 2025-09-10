import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class MusicNotificationManager {
  constructor() {
    this.isInitialized = false;
    this.currentNotificationId = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('[Notifications]', 'Permission not granted');
        return;
      }

      // Set up notification channels for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('music', {
          name: 'Music Controls',
          importance: Notifications.AndroidImportance.LOW,
          vibrationPattern: [0],
          lightColor: '#FF231F7C',
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: false,
        });
      }

      this.isInitialized = true;
      console.log('[Notifications]', 'Initialized successfully');
    } catch (error) {
      console.log('[Notifications]', 'Failed to initialize:', error.message);
    }
  }

  async showMusicNotification(songInfo, isPlaying = false) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Cancel existing notification
      if (this.currentNotificationId) {
        await Notifications.dismissNotificationAsync(this.currentNotificationId);
      }

      const notification = {
        title: songInfo.name || 'Unknown Song',
        body: songInfo.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist',
        categoryIdentifier: 'music',
        data: {
          type: 'music_control',
          songId: songInfo.id,
          isPlaying: isPlaying,
        },
      };

      // For Android, set channel and additional options
      if (Platform.OS === 'android') {
        notification.channelId = 'music';
        notification.priority = Notifications.AndroidNotificationPriority.LOW;
      }

      const identifier = await Notifications.scheduleNotificationAsync({
        content: notification,
        trigger: null, // Show immediately
      });

      this.currentNotificationId = identifier;
      console.log('[Notifications]', 'Music notification shown');
    } catch (error) {
      console.log('[Notifications]', 'Failed to show notification:', error.message);
    }
  }

  async hideMusicNotification() {
    try {
      if (this.currentNotificationId) {
        await Notifications.dismissNotificationAsync(this.currentNotificationId);
        this.currentNotificationId = null;
        console.log('[Notifications]', 'Music notification hidden');
      }
    } catch (error) {
      console.log('[Notifications]', 'Failed to hide notification:', error.message);
    }
  }

  async updateMusicNotification(songInfo, isPlaying = false) {
    // For now, we'll just show a new notification
    // In a more advanced implementation, you could update the existing one
    await this.showMusicNotification(songInfo, isPlaying);
  }
}

export default new MusicNotificationManager();