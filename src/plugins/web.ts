
import { WebPlugin } from '@capacitor/core';
import type { AppBlockerPlugin } from './AppBlocker';

export class AppBlockerWeb extends WebPlugin implements AppBlockerPlugin {
  async blockApps(options: { packageNames: string[], duration: number }): Promise<{ success: boolean }> {
    console.log('Web: Blocking apps', options);
    // Store blocked apps in localStorage for web demo
    localStorage.setItem('blockedApps', JSON.stringify({
      packageNames: options.packageNames,
      endTime: Date.now() + (options.duration * 60 * 60 * 1000)
    }));
    return { success: true };
  }

  async unblockApps(options: { packageNames: string[] }): Promise<{ success: boolean }> {
    console.log('Web: Unblocking apps', options);
    localStorage.removeItem('blockedApps');
    return { success: true };
  }

  async isAppBlocked(options: { packageName: string }): Promise<{ blocked: boolean }> {
    const blockedApps = localStorage.getItem('blockedApps');
    if (!blockedApps) return { blocked: false };
    
    const data = JSON.parse(blockedApps);
    const isBlocked = data.packageNames.includes(options.packageName) && Date.now() < data.endTime;
    return { blocked: isBlocked };
  }

  async getUsageStats(): Promise<{ stats: Array<{ packageName: string, timeSpent: number }> }> {
    // Mock data for web
    return {
      stats: [
        { packageName: 'com.instagram.android', timeSpent: 120 },
        { packageName: 'com.google.android.youtube', timeSpent: 180 },
        { packageName: 'com.zhiliaoapp.musically', timeSpent: 90 }
      ]
    };
  }

  async requestPermissions(): Promise<{ granted: boolean }> {
    console.log('Web: Requesting permissions (mock)');
    return { granted: true };
  }
}
