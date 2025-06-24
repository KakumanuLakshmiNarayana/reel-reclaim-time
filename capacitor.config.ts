
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.84407d1b91ee4c2e8ceae4a7dfe66669',
  appName: 'reel-reclaim-time',
  webDir: 'dist',
  server: {
    url: 'https://84407d1b-91ee-4c2e-8cea-e4a7dfe66669.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6366f1',
      showSpinner: false
    }
  }
};

export default config;
