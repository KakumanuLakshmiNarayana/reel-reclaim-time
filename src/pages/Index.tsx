
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlatformCard } from '@/components/PlatformCard';
import { BlockTimer } from '@/components/BlockTimer';
import { HabitTracker } from '@/components/HabitTracker';
import { OTPUnlock } from '@/components/OTPUnlock';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<Date | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [blockDuration, setBlockDuration] = useState(1); // hours
  const { toast } = useToast();

  const platforms = [
    { id: 'instagram', name: 'Instagram Reels', icon: '📸', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'youtube', name: 'YouTube Shorts', icon: '📺', color: 'bg-gradient-to-br from-red-500 to-red-600' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-gradient-to-br from-black to-gray-800' },
    { id: 'facebook', name: 'Facebook Watch', icon: '👥', color: 'bg-gradient-to-br from-blue-600 to-blue-700' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-gradient-to-br from-sky-400 to-sky-600' },
    { id: 'snapchat', name: 'Snapchat', icon: '👻', color: 'bg-gradient-to-br from-yellow-400 to-yellow-500' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleBlockAll = () => {
    const allPlatformIds = platforms.map(p => p.id);
    const areAllSelected = allPlatformIds.every(id => selectedPlatforms.includes(id));
    
    if (areAllSelected) {
      setSelectedPlatforms([]);
      toast({
        title: "All platforms deselected",
        description: "No platforms are currently selected for blocking.",
      });
    } else {
      setSelectedPlatforms(allPlatformIds);
      toast({
        title: "All platforms selected! 🎯",
        description: "All social media platforms are now selected for blocking.",
      });
    }
  };

  const startBlock = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please select at least one platform to block.",
        variant: "destructive",
      });
      return;
    }

    const endTime = new Date();
    endTime.setHours(endTime.getHours() + blockDuration);
    setBlockEndTime(endTime);
    setIsBlocked(true);
    
    toast({
      title: "Block activated! 🛡️",
      description: `Selected platforms blocked for ${blockDuration} hour${blockDuration > 1 ? 's' : ''}`,
    });
  };

  const handleBlockEnd = () => {
    setIsBlocked(false);
    setShowOTP(true);
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    setBlockEndTime(null);
    toast({
      title: "Welcome back! 👋",
      description: "Remember to use your time mindfully.",
    });
  };

  const allPlatformIds = platforms.map(p => p.id);
  const areAllSelected = allPlatformIds.every(id => selectedPlatforms.includes(id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧠</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FocusGuard
          </h1>
          <p className="text-gray-600 mt-2">Reclaim your focus, one block at a time</p>
        </div>

        {showOTP ? (
          <OTPUnlock onSuccess={handleOTPSuccess} platforms={selectedPlatforms.map(id => platforms.find(p => p.id === id)?.name || id)} />
        ) : (
          <Tabs defaultValue="block" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="block">Block Apps</TabsTrigger>
              <TabsTrigger value="tracker">Habit Tracker</TabsTrigger>
            </TabsList>

            <TabsContent value="block" className="space-y-6">
              {isBlocked ? (
                <BlockTimer 
                  endTime={blockEndTime!} 
                  platforms={selectedPlatforms.map(id => platforms.find(p => p.id === id)?.name || id)}
                  onBlockEnd={handleBlockEnd}
                />
              ) : (
                <>
                  {/* Platform Selection */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <span>📱</span>
                          Select Platforms to Block
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBlockAll}
                          className="text-xs"
                        >
                          {areAllSelected ? 'Deselect All' : 'Block All'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {platforms.map(platform => (
                        <PlatformCard
                          key={platform.id}
                          platform={platform}
                          isSelected={selectedPlatforms.includes(platform.id)}
                          onToggle={() => handlePlatformToggle(platform.id)}
                        />
                      ))}
                    </CardContent>
                  </Card>

                  {/* Duration Selection */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span>⏰</span>
                        Block Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 2, 4, 8].map(hours => (
                          <Button
                            key={hours}
                            variant={blockDuration === hours ? "default" : "outline"}
                            size="sm"
                            onClick={() => setBlockDuration(hours)}
                          >
                            {hours}h
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Button */}
                  <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="text-2xl">🛡️</div>
                        <Button 
                          onClick={startBlock}
                          size="lg"
                          className="w-full bg-white text-blue-600 hover:bg-gray-100"
                          disabled={selectedPlatforms.length === 0}
                        >
                          Start Focus Session
                        </Button>
                        <p className="text-blue-100 text-sm">
                          Block selected apps for {blockDuration} hour{blockDuration > 1 ? 's' : ''}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="tracker">
              <HabitTracker platforms={platforms} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Index;
