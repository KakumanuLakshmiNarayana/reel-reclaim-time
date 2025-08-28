import { registerPlugin } from '@capacitor/core';

export interface BackgroundTaskPlugin {
  startBackgroundTask(): Promise<{ taskId: string }>;
  stopBackgroundTask(options: { taskId: string }): Promise<void>;
  schedulePeriodicTask(options: { interval: number }): Promise<{ success: boolean }>;
  cancelPeriodicTask(): Promise<void>;
}

const BackgroundTask = registerPlugin<BackgroundTaskPlugin>('BackgroundTask', {
  web: () => import('./web-background').then(m => new m.BackgroundTaskWeb()),
});

export default BackgroundTask;