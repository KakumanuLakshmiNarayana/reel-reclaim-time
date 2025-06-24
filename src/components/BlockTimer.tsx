
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface BlockTimerProps {
  endTime: Date;
  platforms: string[];
  onBlockEnd: () => void;
}

export const BlockTimer: React.FC<BlockTimerProps> = ({ endTime, platforms, onBlockEnd }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = new Date();
    const totalDuration = endTime.getTime() - startTime.getTime();

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = endTime.getTime() - now.getTime();

      if (remaining <= 0) {
        setTimeLeft('00:00:00');
        setProgress(100);
        clearInterval(timer);
        onBlockEnd();
        return;
      }

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      setProgress(((totalDuration - remaining) / totalDuration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onBlockEnd]);

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">⏰</div>
            <div className="text-4xl font-mono font-bold">{timeLeft}</div>
            <p className="text-green-100">Time remaining in focus session</p>
            <Progress value={progress} className="bg-green-400" />
          </div>
        </CardContent>
      </Card>

      {/* Blocked Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🚫</span>
            Currently Blocked
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {platforms.map((platform, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-gray-900">{platform}</span>
                <Badge variant="destructive">Blocked</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-2xl">🎯</div>
            <h3 className="font-semibold text-gray-900">Stay Strong!</h3>
            <p className="text-gray-600 text-sm">
              You're building better habits. Every minute counts towards your goals.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
