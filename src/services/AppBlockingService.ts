
import AppBlocker from '../plugins/AppBlocker';

export class AppBlockingService {
  private static readonly PLATFORM_PACKAGES = {
    instagram: 'com.instagram.android',
    youtube: 'com.google.android.youtube',
    tiktok: 'com.zhiliaoapp.musically',
    facebook: 'com.facebook.katana',
    twitter: 'com.twitter.android',
    snapchat: 'com.snapchat.android'
  };

  static async requestPermissions(): Promise<boolean> {
    try {
      const result = await AppBlocker.requestPermissions();
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
        platform: this.getplatformFromPackage(stat.packageName),
        timeSpent: stat.timeSpent
      })).filter(stat => stat.platform !== 'unknown');
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return [];
    }
  }

  private static getplatformFromPackage(packageName: string): string {
    const entry = Object.entries(this.PLATFORM_PACKAGES).find(([_, pkg]) => pkg === packageName);
    return entry ? entry[0] : 'unknown';
  }
}
