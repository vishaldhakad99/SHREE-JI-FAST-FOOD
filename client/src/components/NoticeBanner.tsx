import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Bell } from 'lucide-react';

export const NoticeBanner: React.FC = () => {
  const { settings } = useSettings();

  if (!settings?.noticeBanner?.enabled || !settings?.noticeBanner?.text) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center truncate">
        <Bell className="w-3.5 h-3.5 shrink-0 text-amber-200" />
        <span className="truncate">{settings.noticeBanner.text}</span>
      </div>
    </div>
  );
};
