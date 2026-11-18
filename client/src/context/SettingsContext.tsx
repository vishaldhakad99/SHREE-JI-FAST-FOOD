import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { RestaurantSettings } from '../types';

interface SettingsContextType {
  settings: RestaurantSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  error: null,
  refreshSettings: async () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err: any) {
      console.error('Failed to load restaurant settings:', err);
      setError('Unable to load restaurant details from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
