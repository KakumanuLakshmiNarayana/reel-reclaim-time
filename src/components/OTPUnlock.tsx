
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface OTPUnlockProps {
  onSuccess: () => void;
  platforms: string[];
}

export const OTPUnlock: React.FC<OTPUnlockProps> = ({ onSuccess, platforms }) => {
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes delay
  const { toast } = useToast();

  useEffect(() => {
    // Generate a random OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowOTP(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp === generatedOTP) {
      toast({
        title: "Access granted! ✅",
        description: "Welcome back to your apps. Use them mindfully!",
      });
      onSuccess();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the code and try again.",
        variant: "destructive",
      });
      setOtp('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-2xl font-bold">Focus Session Complete!</h2>
            <p className="text-orange-100">
              Your blocked apps are ready to unlock
            </p>
          </div>
        </CardContent>
      </Card>

      {!showOTP ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⏳</span>
              Preparing unlock code...
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-3xl font-mono font-bold text-blue-600">
              {formatTime(countdown)}
            </div>
            <p className="text-gray-600">
              Taking a moment to reflect? Your unlock code will appear soon.
            </p>
            <div className="text-sm text-gray-500">
              This brief pause encourages mindful app usage
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🔑</span>
              Enter Unlock Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 mb-2">Your unlock code:</p>
              <div className="text-2xl font-mono font-bold text-blue-900">{generatedOTP}</div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="text-center text-lg font-mono"
              />
              <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                Unlock Apps
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Apps to unlock:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {platforms.map((platform, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
