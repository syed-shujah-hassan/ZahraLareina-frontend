import React, { createContext, useContext, useEffect, useState } from 'react';

interface StoreSettingsContextType {
  currency: string;
  currencySymbol: string;
  formatPrice: (amount: number) => string;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000';

const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'PKR':
    default:
      return 'Rs';
  }
};

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>('PKR');

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/public-settings`);
        const data = await res.json();
        if (res.ok && data.success && data.settings?.currency) {
          setCurrency(data.settings.currency);
        }
      } catch (err) {
        // fail silently, fall back to default PKR
        console.error('Failed to load store settings', err);
      }
    };

    run();
  }, []);

  const currencySymbol = getCurrencySymbol(currency);

  const formatPrice = (amount: number) => {
    if (isNaN(amount)) return `${currencySymbol} 0`;
    return `${currencySymbol} ${amount.toLocaleString()}`;
  };

  return (
    <StoreSettingsContext.Provider value={{ currency, currencySymbol, formatPrice }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const ctx = useContext(StoreSettingsContext);
  if (!ctx) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return ctx;
};
