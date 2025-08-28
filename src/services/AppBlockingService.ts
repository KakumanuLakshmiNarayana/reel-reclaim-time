
import AppBlocker from '../plugins/AppBlocker';
import BackgroundTask from '../plugins/BackgroundTask';

export class AppBlockingService {
  private static readonly PLATFORM_PACKAGES = {
    instagram: 'com.instagram.android',
    youtube: 'com.google.android.youtube',
    tiktok: 'com.zhiliaoapp.musically',
    facebook: 'com.facebook.katana',
    twitter: 'com.twitter.android',
    snapchat: 'com.snapchat.android'
  };

  private static backgroundTaskId: string | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await AppBlocker.requestPermissions();
      
      // If permissions granted, also request notification permissions for web
      if (result.granted && 'Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      return result.granted;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      return false;
    }
  }

  static async blockPlatforms(platformIds: string[], durationHours: number): Promise<boolean> {
    try {
      const packageNames = platformIds.map(id => this.PLATFORM_PACKAGES[id as keyof typeof this.PLATFORM_PACKAGES]).filter(Boolean);
      const result = await AppBlocker.blockApps({ packageNames, duration: durationHours });
      
      if (result.success) {
        // Start background monitoring
        await this.startBackgroundMonitoring(durationHours);
      }
      
      return result.success;
    } catch (error) {
      console.error('Failed to block apps:', error);
      return false;
    }
  }

  static async unblockPlatforms(platformIds: string[]): Promise<boolean> {
    try {
      const packageNames = platformIds.map(id => this.PLATFORM_PACKAGES[id as keyof typeof this.PLATFORM_PACKAGES]).filter(Boolean);
      const result = await AppBlocker.unblockApps({ packageNames });
      
      if (result.success) {
        // Stop background monitoring
        await this.stopBackgroundMonitoring();
      }
      
      return result.success;
    } catch (error) {
      console.error('Failed to unblock apps:', error);
      return false;
    }
  }

  static async getUsageStats(): Promise<Array<{ platform: string, timeSpent: number }>> {
    try {
      const result = await AppBlocker.getUsageStats();
      return result.stats.map(stat => ({
        platform: this.getPlatformFromPackage(stat.packageName),
        timeSpent: stat.timeSpent
      })).filter(stat => stat.platform !== 'unknown');
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return [];
    }
  }

  static async isAnyAppBlocked(): Promise<boolean> {
    try {
      // Check if any of the known platforms are currently blocked
      for (const platformId of Object.keys(this.PLATFORM_PACKAGES)) {
        const packageName = this.PLATFORM_PACKAGES[platformId as keyof typeof this.PLATFORM_PACKAGES];
        const result = await AppBlocker.isAppBlocked({ packageName });
        if (result.blocked) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Failed to check if any app is blocked:', error);
      return false;
    }
  }

  static async getRemainingBlockTime(): Promise<number | null> {
    try {
      // For web, check localStorage
      if (typeof window !== 'undefined') {
        const blockedApps = localStorage.getItem('blockedApps');
        if (blockedApps) {
          const data = JSON.parse(blockedApps);
          const remaining = data.endTime - Date.now();
          return remaining > 0 ? Math.ceil(remaining / 1000) : null; // Return seconds
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get remaining block time:', error);
      return null;
    }
  }

  private static async startBackgroundMonitoring(durationHours: number): Promise<void> {
    try {
      // Start a background task
      const taskResult = await BackgroundTask.startBackgroundTask();
      this.backgroundTaskId = taskResult.taskId;
      
      // Schedule periodic monitoring (every 30 seconds)
      await BackgroundTask.schedulePeriodicTask({ interval: 30 });
      
      console.log('Background monitoring started for', durationHours, 'hours');
    } catch (error) {
      console.error('Failed to start background monitoring:', error);
    }
  }

  private static async stopBackgroundMonitoring(): Promise<void> {
    try {
      if (this.backgroundTaskId) {
        await BackgroundTask.stopBackgroundTask({ taskId: this.backgroundTaskId });
        this.backgroundTaskId = null;
      }
      
      await BackgroundTask.cancelPeriodicTask();
      console.log('Background monitoring stopped');
    } catch (error) {
      console.error('Failed to stop background monitoring:', error);
    }
  }

  private static getPlatformFromPackage(packageName: string): string {
    const entry = Object.entries(this.PLATFORM_PACKAGES).find(([_, pkg]) => pkg === packageName);
    return entry ? entry[0] : 'unknown';
  }
}
