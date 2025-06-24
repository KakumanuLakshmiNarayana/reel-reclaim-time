
import { registerPlugin } from '@capacitor/core';

export interface AppBlockerPlugin {
  blockApps(options: { packageNames: string[], duration: number }): Promise<{ success: boolean }>;
  unblockApps(options: { packageNames: string[] }): Promise<{ success: boolean }>;
  isAppBlocked(options: { packageName: string }): Promise<{ blocked: boolean }>;
  getUsageStats(): Promise<{ stats: Array<{ packageName: string, timeSpent: number }> }>;
  requestPermissions(): Promise<{ granted: boolean }>;
}

const AppBlocker = registerPlugin<AppBlockerPlugin>('AppBlocker', {
  web: () => import('./web').then(m => new m.AppBlockerWeb()),
});

export default AppBlocker;
