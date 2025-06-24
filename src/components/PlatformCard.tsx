
import React from 'react';
import { Switch } from '@/components/ui/switch';

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface PlatformCardProps {
  platform: Platform;
  isSelected: boolean;
  onToggle: () => void;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({ platform, isSelected, onToggle }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white text-lg`}>
          {platform.icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{platform.name}</h3>
          <p className="text-sm text-gray-500">Short-form content</p>
        </div>
      </div>
      <Switch
        checked={isSelected}
        onCheckedChange={onToggle}
      />
    </div>
  );
};
