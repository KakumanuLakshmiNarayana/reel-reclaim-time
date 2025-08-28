package com.example.app;

import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.os.Handler;
import android.os.Looper;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;
import java.util.ArrayList;

@CapacitorPlugin(name = "AppBlocker")
public class AppBlockerPlugin extends Plugin {
    private static final String PREFS_NAME = "AppBlockerPrefs";
    private static final String KEY_BLOCKED_APPS = "blocked_apps";
    private static final String KEY_BLOCK_END_TIME = "block_end_time";
    
    private Handler handler = new Handler(Looper.getMainLooper());
    private Runnable blockChecker;
    
    @PluginMethod
    public void requestPermissions(PluginCall call) {
        // Check if accessibility service is enabled
        if (isAccessibilityServiceEnabled()) {
            call.resolve(createResult(true));
        } else {
            // Open accessibility settings
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            
            // For now, return false - user needs to manually enable
            call.resolve(createResult(false));
        }
    }
    
    @PluginMethod
    public void blockApps(PluginCall call) {
        try {
            JSObject options = call.getData();
            List<String> packageNames = options.getList("packageNames");
            int duration = options.getInteger("duration");
            
            // Store blocked apps in preferences
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            
            long endTime = System.currentTimeMillis() + (duration * 60 * 60 * 1000L);
            editor.putLong(KEY_BLOCK_END_TIME, endTime);
            editor.putString(KEY_BLOCKED_APPS, String.join(",", packageNames));
            editor.apply();
            
            // Start monitoring for blocked apps
            startBlockMonitoring();
            
            call.resolve(createResult(true));
        } catch (Exception e) {
            call.reject("Failed to block apps", e);
        }
    }
    
    @PluginMethod
    public void unblockApps(PluginCall call) {
        try {
            // Clear blocked apps from preferences
            SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = prefs.edit();
            editor.remove(KEY_BLOCKED_APPS);
            editor.remove(KEY_BLOCK_END_TIME);
            editor.apply();
            
            // Stop monitoring
            stopBlockMonitoring();
            
            call.resolve(createResult(true));
        } catch (Exception e) {
            call.reject("Failed to unblock apps", e);
        }
    }
    
    @PluginMethod
    public void isAppBlocked(PluginCall call) {
        try {
            JSObject options = call.getData();
            String packageName = options.getString("packageName");
            
            boolean isBlocked = isAppCurrentlyBlocked(packageName);
            JSObject result = new JSObject();
            result.put("blocked", isBlocked);
            
            call.resolve(result);
        } catch (Exception e) {
            call.reject("Failed to check app status", e);
        }
    }
    
    @PluginMethod
    public void getUsageStats(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                UsageStatsManager usageStatsManager = (UsageStatsManager) getContext().getSystemService(Context.USAGE_STATS_SERVICE);
                
                long endTime = System.currentTimeMillis();
                long startTime = endTime - TimeUnit.DAYS.toMillis(1); // Last 24 hours
                
                List<UsageStats> stats = usageStatsManager.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, startTime, endTime);
                
                JSObject result = new JSObject();
                List<Map<String, Object>> statsList = new ArrayList<>();
                
                for (UsageStats stat : stats) {
                    if (stat.getTotalTimeInForeground() > 0) {
                        Map<String, Object> statMap = new HashMap<>();
                        statMap.put("packageName", stat.getPackageName());
                        statMap.put("timeSpent", stat.getTotalTimeInForeground() / 1000); // Convert to seconds
                        statsList.add(statMap);
                    }
                }
                
                result.put("stats", statsList);
                call.resolve(result);
            } else {
                call.reject("Usage stats not available on this Android version");
            }
        } catch (Exception e) {
            call.reject("Failed to get usage stats", e);
        }
    }
    
    private boolean isAccessibilityServiceEnabled() {
        String enabledServices = Settings.Secure.getString(
            getContext().getContentResolver(),
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        );
        
        return enabledServices != null && enabledServices.contains(getContext().getPackageName());
    }
    
    private boolean isAppCurrentlyBlocked(String packageName) {
        SharedPreferences prefs = getContext().getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
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
    
    private void startBlockMonitoring() {
        if (blockChecker != null) {
            stopBlockMonitoring();
        }
        
        blockChecker = new Runnable() {
            @Override
            public void run() {
                checkAndBlockApps();
                handler.postDelayed(this, 1000); // Check every second
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
    
    private void checkAndBlockApps() {
        // This would be implemented in the AccessibilityService
        // For now, we'll just log that monitoring is active
        System.out.println("App blocking monitoring active");
    }
    
    private JSObject createResult(boolean success) {
        JSObject result = new JSObject();
        result.put("success", success);
        return result;
    }
}