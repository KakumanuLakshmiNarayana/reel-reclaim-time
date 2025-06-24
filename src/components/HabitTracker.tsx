import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AppBlockingService } from '@/services/AppBlockingService';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface HabitTrackerProps {
  platforms: Platform[];
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({ platforms }) => {
  const [usageStats, setUsageStats] = useState<Array<{ platform: string, timeSpent: number }>>([]);

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    const stats = await AppBlockingService.getUsageStats();
    setUsageStats(stats);
  };

  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', blocked: 3, used: 1 },
    { day: 'Tue', blocked: 4, used: 0.5 },
    { day: 'Wed', blocked: 2, used: 2 },
    { day: 'Thu', blocked: 5, used: 0 },
    { day: 'Fri', blocked: 3, used: 1.5 },
    { day: 'Sat', blocked: 1, used: 3 },
    { day: 'Sun', blocked: 4, used: 0.5 }
  ];

  const totalBlocked = weeklyData.reduce((sum, day) => sum + day.blocked, 0);
  const totalUsed = weeklyData.reduce((sum, day) => sum + day.used, 0);
  const focusScore = Math.round((totalBlocked / (totalBlocked + totalUsed)) * 100);

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span>
            This Week's Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalBlocked}h</div>
              <div className="text-green-100">Time Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{focusScore}%</div>
              <div className="text-green-100">Focus Score</div>
            </div>
          </div>
          <Progress value={focusScore} className="bg-green-400" />
        </CardContent>
      </Card>

      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📅</span>
            Daily Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-center font-medium text-gray-700">{day.day}</div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {day.blocked}h blocked
                    </Badge>
                    {day.used > 0 && (
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        {day.used}h used
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {day.blocked > day.used ? (
                    <span className="text-green-600 font-medium">✓ Good</span>
                  ) : (
                    <span className="text-orange-600 font-medium">⚠ Review</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🏆</span>
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-sm font-medium">3 Day Streak</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-sm font-medium">Focus Master</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-medium">20h Blocked</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🚀</div>
              <div className="text-sm font-medium">Productivity+</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Insight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-2xl">💡</div>
            <h3 className="font-semibold text-gray-900">Daily Insight</h3>
            <p className="text-gray-600 text-sm">
              You've improved your focus by 40% this week! Keep up the momentum by maintaining consistent blocking sessions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
