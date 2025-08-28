import { WebPlugin } from '@capacitor/core';
import type { BackgroundTaskPlugin } from './BackgroundTask';

export class BackgroundTaskWeb extends WebPlugin implements BackgroundTaskPlugin {
  private periodicTaskInterval: NodeJS.Timeout | null = null;
  private backgroundTasks: Set<string> = new Set();

  async startBackgroundTask(): Promise<{ taskId: string }> {
    const taskId = `web-task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.backgroundTasks.add(taskId);
    
    console.log('Web: Started background task', taskId);
    
    // In a real app, this would request background execution time
    return { taskId };
  }

  async stopBackgroundTask(options: { taskId: string }): Promise<void> {
    this.backgroundTasks.delete(options.taskId);
    console.log('Web: Stopped background task', options.taskId);
  }

  async schedulePeriodicTask(options: { interval: number }): Promise<{ success: boolean }> {
    if (this.periodicTaskInterval) {
      this.cancelPeriodicTask();
    }
    
    // Schedule periodic task for web simulation
    this.periodicTaskInterval = setInterval(() => {
      this.executePeriodicTask();
    }, options.interval * 1000);
    
    console.log('Web: Scheduled periodic task every', options.interval, 'seconds');
    return { success: true };
  }

  async cancelPeriodicTask(): Promise<void> {
    if (this.periodicTaskInterval) {
      clearInterval(this.periodicTaskInterval);
      this.periodicTaskInterval = null;
      console.log('Web: Cancelled periodic task');
    }
  }

  private executePeriodicTask(): void {
    // Check if any apps are blocked and need monitoring
    const blockedApps = localStorage.getItem('blockedApps');
    if (blockedApps) {
      try {
        const data = JSON.parse(blockedApps);
        const now = Date.now();
        
        if (now > data.endTime) {
          // Block expired, clear it
          localStorage.removeItem('blockedApps');
          console.log('Web: Background task detected expired block and cleared it');
          
          // Show notification
          this.showBackgroundNotification('Focus session ended', 'Your focus session has ended. Apps are now unblocked.');
        }
      } catch (error) {
        console.error('Web: Error in periodic task:', error);
      }
    }
  }

  private showBackgroundNotification(title: string, message: string): void {
    // Use browser notifications if available
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    }
    
    // Also log to console for development
    console.log(`[FocusGuard Background] ${title}: ${message}`);
  }
}