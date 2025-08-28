
import { WebPlugin } from '@capacitor/core';
import type { AppBlockerPlugin } from './AppBlocker';

export class AppBlockerWeb extends WebPlugin implements AppBlockerPlugin {
  private blockedApps: Set<string> = new Set();
  private blockEndTime: number = 0;
  private blockInterval: NodeJS.Timeout | null = null;

  async blockApps(options: { packageNames: string[], duration: number }): Promise<{ success: boolean }> {
    console.log('Web: Blocking apps', options);
    
    // Store blocked apps in localStorage for persistence
    const blockData = {
      packageNames: options.packageNames,
      endTime: Date.now() + (options.duration * 60 * 60 * 1000)
    };
    localStorage.setItem('blockedApps', JSON.stringify(blockData));
    
    // Update local state
    this.blockedApps = new Set(options.packageNames);
    this.blockEndTime = blockData.endTime;
    
    // Start monitoring for blocked apps
    this.startWebMonitoring();
    
    // Show notification
    this.showWebNotification('Apps blocked', `${options.packageNames.length} apps are now blocked for ${options.duration} hour(s)`);
    
    return { success: true };
  }

  async unblockApps(options: { packageNames: string[] }): Promise<{ success: boolean }> {
    console.log('Web: Unblocking apps', options);
    
    // Clear blocked apps
    localStorage.removeItem('blockedApps');
    this.blockedApps.clear();
    this.blockEndTime = 0;
    
    // Stop monitoring
    this.stopWebMonitoring();
    
    // Show notification
    this.showWebNotification('Apps unblocked', 'All apps have been unblocked');
    
    return { success: true };
  }

  async isAppBlocked(options: { packageName: string }): Promise<{ blocked: boolean }> {
    // Check if block has expired
    if (Date.now() > this.blockEndTime) {
      this.blockedApps.clear();
      this.blockEndTime = 0;
      localStorage.removeItem('blockedApps');
      return { blocked: false };
    }
    
    const isBlocked = this.blockedApps.has(options.packageName);
    return { blocked: isBlocked };
  }

  async getUsageStats(): Promise<{ stats: Array<{ packageName: string, timeSpent: number }> }> {
    // Enhanced mock data for web
    const mockStats = [
      { packageName: 'com.instagram.android', timeSpent: Math.floor(Math.random() * 300) + 60 },
      { packageName: 'com.google.android.youtube', timeSpent: Math.floor(Math.random() * 400) + 120 },
      { packageName: 'com.zhiliaoapp.musically', timeSpent: Math.floor(Math.random() * 200) + 30 },
      { packageName: 'com.facebook.katana', timeSpent: Math.floor(Math.random() * 250) + 45 },
      { packageName: 'com.twitter.android', timeSpent: Math.floor(Math.random() * 180) + 20 },
      { packageName: 'com.snapchat.android', timeSpent: Math.floor(Math.random() * 150) + 15 }
    ];
    
    return { stats: mockStats };
  }

  async requestPermissions(): Promise<{ granted: boolean }> {
    console.log('Web: Requesting permissions (mock)');
    
    // Simulate permission request
    const granted = await this.simulatePermissionRequest();
    return { granted };
  }

  private async simulatePermissionRequest(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate a permission dialog
      const result = confirm(
        'FocusGuard needs accessibility permissions to block apps.\n\n' +
        'In a real app, this would open Android settings.\n\n' +
        'Click OK to simulate granted permissions, Cancel to simulate denied.'
      );
      resolve(result);
    });
  }

  private startWebMonitoring(): void {
    if (this.blockInterval) {
      this.stopWebMonitoring();
    }
    
    // Check every 5 seconds for web simulation
    this.blockInterval = setInterval(() => {
      this.checkWebBlockStatus();
    }, 5000);
  }

  private stopWebMonitoring(): void {
    if (this.blockInterval) {
      clearInterval(this.blockInterval);
      this.blockInterval = null;
    }
  }

  private checkWebBlockStatus(): void {
    // Check if block has expired
    if (Date.now() > this.blockEndTime && this.blockEndTime > 0) {
      this.blockedApps.clear();
      this.blockEndTime = 0;
      localStorage.removeItem('blockedApps');
      this.stopWebMonitoring();
      
      this.showWebNotification('Block expired', 'Your focus session has ended. Apps are now unblocked.');
    }
  }

  private showWebNotification(title: string, message: string): void {
    // Use browser notifications if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body: message, icon: '/favicon.ico' });
        }
      });
    }
    
    // Also log to console for development
    console.log(`[FocusGuard] ${title}: ${message}`);
  }

  // Initialize from localStorage on plugin load
  constructor() {
    super();
    this.loadBlockedAppsFromStorage();
  }

  private loadBlockedAppsFromStorage(): void {
    try {
      const stored = localStorage.getItem('blockedApps');
      if (stored) {
        const data = JSON.parse(stored);
        this.blockedApps = new Set(data.packageNames);
        this.blockEndTime = data.endTime;
        
        // If block hasn't expired, start monitoring
        if (Date.now() < this.blockEndTime) {
          this.startWebMonitoring();
        } else {
          // Clear expired block
          localStorage.removeItem('blockedApps');
          this.blockedApps.clear();
          this.blockEndTime = 0;
        }
      }
    } catch (error) {
      console.error('Failed to load blocked apps from storage:', error);
    }
  }
}
