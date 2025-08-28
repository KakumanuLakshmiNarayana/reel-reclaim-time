package com.example.app;

import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.Intent;
import android.content.SharedPreferences;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.content.pm.PackageManager;
import android.app.ActivityManager;
import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;
import android.provider.Settings;
import android.app.AlertDialog;
import android.content.DialogInterface;

import java.util.List;
import java.util.Arrays;

public class AppBlockingAccessibilityService extends AccessibilityService {
    private static final String PREFS_NAME = "AppBlockerPrefs";
    private static final String KEY_BLOCKED_APPS = "blocked_apps";
    private static final String KEY_BLOCK_END_TIME = "block_end_time";
    
    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable blockChecker;
    
    @Override
    public void onServiceConnected() {
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED | 
                         AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC;
        info.flags = AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS;
        info.notificationTimeout = 100;
        setServiceInfo(info);
        
        startBlockMonitoring();
    }
    
    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) {
        if (event.getEventType() == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            String packageName = event.getPackageName() != null ? event.getPackageName().toString() : "";
            
            if (isAppCurrentlyBlocked(packageName)) {
                // App is blocked, prevent it from opening
                preventAppLaunch(packageName);
            }
        }
    }
    
    @Override
    public void onInterrupt() {
        // Service interrupted
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        stopBlockMonitoring();
    }
    
    private boolean isAppCurrentlyBlocked(String packageName) {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String blockedApps = prefs.getString(KEY_BLOCKED_APPS, "");
        long endTime = prefs.getLong(KEY_BLOCK_END_TIME, 0);
        
        if (blockedApps.isEmpty() || endTime == 0) {
            return false;
        }
        
        // Check if block has expired
        if (System.currentTimeMillis() > endTime) {
            // Clear expired block
            SharedPreferences.Editor editor = prefs.edit();
            editor.remove(KEY_BLOCKED_APPS);
            editor.remove(KEY_BLOCK_END_TIME);
            editor.apply();
            return false;
        }
        
        return blockedApps.contains(packageName);
    }
    
    private void preventAppLaunch(String packageName) {
        // Go back to home screen
        Intent homeIntent = new Intent(Intent.ACTION_MAIN);
        homeIntent.addCategory(Intent.CATEGORY_HOME);
        homeIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(homeIntent);
        
        // Show blocking notification
        showBlockingNotification(packageName);
    }
    
    private void showBlockingNotification(String packageName) {
        handler.post(() -> {
            String appName = getAppName(packageName);
            String message = appName + " is blocked during your focus session. Stay focused! 🧠";
            
            Toast.makeText(this, message, Toast.LENGTH_LONG).show();
            
            // Show dialog
            showBlockingDialog(appName);
        });
    }
    
    private void showBlockingDialog(String appName) {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("🚫 App Blocked")
               .setMessage(appName + " is currently blocked during your focus session.\n\nStay focused on your goals! 💪")
               .setPositiveButton("Got it!", null)
               .setIcon(android.R.drawable.ic_dialog_alert)
               .show();
    }
    
    private String getAppName(String packageName) {
        try {
            PackageManager pm = getPackageManager();
            return pm.getApplicationLabel(pm.getApplicationInfo(packageName, 0)).toString();
        } catch (Exception e) {
            return packageName;
        }
    }
    
    private void startBlockMonitoring() {
        if (blockChecker != null) {
            stopBlockMonitoring();
        }
        
        blockChecker = new Runnable() {
            @Override
            public void run() {
                checkCurrentApp();
                handler.postDelayed(this, 2000); // Check every 2 seconds
            }
        };
        
        handler.post(blockChecker);
    }
    
    private void stopBlockMonitoring() {
        if (blockChecker != null) {
            handler.removeCallbacks(blockChecker);
            blockChecker = null;
        }
    }
    
    private void checkCurrentApp() {
        ActivityManager am = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> processes = am.getRunningAppProcesses();
        
        if (processes != null) {
            for (ActivityManager.RunningAppProcessInfo processInfo : processes) {
                if (processInfo.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
                    String packageName = processInfo.processName;
                    if (isAppCurrentlyBlocked(packageName)) {
                        preventAppLaunch(packageName);
                        break;
                    }
                }
            }
        }
    }
}